import { StreamTools } from '../tools/tools.streams';
import { Application, Router } from 'express';
import { DB } from 'server/tools/db';
import { MainTools } from '../tools/tools.main';
import { Rester } from '../tools/tools.rester';

export class ApiStreams {
	private tool: StreamTools;
	private apiRoutes: Router;
	private rester: Rester;

	constructor( public app: Application, public db: DB, public tools: MainTools ) {
		this.tool = new StreamTools( this.db, this.tools );
		this.apiRoutes = Router();
		this.rester = new Rester( this.tools );

		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.tool );
		this.app.use( '/api/streams', this.apiRoutes );
	}

	private setRoutes = () => {
		this.apiRoutes.post( '/export/:id/:xid', ( req, res ) => {
			this.rester.respond( this.tool.executeExport, {
				id: parseInt( req.params.id, 10 ),
				xid: req.params.xid, user: ( req as any ).user,
				selections: req.body
			}, req, res );
		} );
	}
}
