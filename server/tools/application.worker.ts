import { SystemConfig } from 'shared/models/systemconfig';
import { DB } from './db';
import * as express from 'express';
import { Server } from 'http';
import * as socketio from 'socket.io';
import * as multer from 'multer';
import { MainTools } from './tools.main';
import { json, text, urlencoded } from 'body-parser';
import { join } from 'path';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as jwt from 'express-jwt';
import { RestAPI } from '../api/api';
import { Subscription } from 'rxjs';
import { Interest } from 'src/app/shared/shared.state';

// import * as express from 'express';
// import { Server } from 'http';
// import * as multer from 'multer';
// import * as bodyParser from 'body-parser';

// import { Subscription } from 'rxjs';

// import { DB } from '../tools/tools.db';
// import { SystemConfig } from '../../shared/models/systemconfig';
// import { MainTools } from '../tools/tools.main';
// import { ATApi } from '../api/api';
// import { ATDataStoreInterest } from '../../shared/models/at.datastoreinterest';
// import { ATApiCommunication } from '../../shared/models/at.socketrequest';

export class ApplicationWorker {
	private app: express.Application;
	private server: Server;
	private io: socketio.Server;
	private restAPI: RestAPI;

	private mainTools: MainTools;
	private multerStorage: multer.StorageEngine;

	constructor( private db: DB, config: SystemConfig ) {
		this.app = express();
		this.server = new Server( this.app );
		this.io = socketio( this.server );

		this.mainTools = new MainTools( db.pool, config );
		// 	this.api = new ATApi( db, this.mainTools );

		this.multerStorage = multer.memoryStorage();

		this.app.use( json( { limit: '100mb' } ) );
		this.app.use( text( { limit: '100mb' } ) );
		this.app.use( urlencoded( { extended: true, limit: '100mb' } ) );
		this.app.use( multer( { storage: this.multerStorage } ).any() );
		this.app.use( express.static( join( __dirname, '../../dist' ) ) );

		this.app.set( 'trust proxy', true );
		// 	this.app.enable( 'trust proxy' );
		this.app.use( helmet() );
		this.app.use( helmet.noCache() );

		this.app.use( morgan( 'short' ) );

		this.app.use( '/api', jwt( { secret: config.hash } ).unless( { path: ['/api/auth/signin', /\/api\/dime\/secret\/givemysecret/i] } ) );

		this.restAPI = new RestAPI( this.app, this.db, this.mainTools );

		this.app.all( '/api/*', ( req, res ) => {
			res.status( 500 ).send( new Error( 'Not implemented' ) );
		} );

		this.app.get( '*', ( req, res ) => {
			res.sendFile( join( __dirname, '../../dist/index.html' ) );
		} );

		this.server.listen( config.serverPort, () => {
			console.log( 'Server is now running on port ' + config.serverPort );
		} );

		this.io.on( 'connection', this.handleConnection );


	}

	private handleConnection = ( socket: socketio.Socket ) => {
		const interests: Interest[] = [];
		const changeSubscription: Subscription = this.db.rtdb.changes$.subscribe( tablename => this.handleChanges( tablename, interests, socket ) );
		socket.on( 'disconnect', () => {
			changeSubscription.unsubscribe();
		} );
		socket.on( 'interest', async ( payload ) => {
			this.handleInterests( interests, payload, socket );
		} );
	}

	private handleInterests = ( interests: Interest[], newInterests: Interest[], socket: socketio.Socket ) => {
		newInterests.filter( interest => !interests.includes( interest ) ).forEach( interest => this.handleChanges( interest, newInterests, socket ) );
		interests.splice( 0 );
		newInterests.forEach( interest => interests.push( interest ) );
	}

	private handleChanges = async ( changedTable: string, interests: Interest[], socket: socketio.Socket ) => {
		interests.filter( interest => interest === changedTable ).forEach( interest => socket.emit( 'datachange', interest ) );
	}
}
