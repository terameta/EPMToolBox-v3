import { EnvironmentTools } from '../tools/tools.environments';
import { Router, Application } from 'express';
import { Rester } from '../tools/tools.rester';
import { DB } from '../tools/db';
import { MainTools } from '../tools/tools.main';

export class ApiEnvironments {
	private tool: EnvironmentTools;
	private apiRoutes: Router;
	private rester: Rester;

	constructor( public app: Application, public db: DB, public tools: MainTools ) {
		this.tool = new EnvironmentTools( this.db, this.tools );
		this.apiRoutes = Router();
		this.rester = new Rester( this.tools );

		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.tool );
		this.app.use( '/api/environments', this.apiRoutes );
	}

	private setRoutes = () => {
		this.apiRoutes.get( '/verify/:id', ( req, res ) => { this.rester.respond( this.tool.verify, req.params.id, req, res ); } );
		this.apiRoutes.get( '/listDatabases/:id', ( req, res ) => { this.rester.respond( this.tool.listDatabases, req.params.id, req, res ); } );
	}
}
