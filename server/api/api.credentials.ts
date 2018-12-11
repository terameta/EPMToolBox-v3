import { CredentialTools } from '../tools/tools.credentials';
import { Router, Application } from 'express';
import { Rester } from '../tools/tools.rester';
import { DB } from 'server/tools/db';
import { MainTools } from 'server/tools/tools.main';

export class ApiCredentials {
	private tool: CredentialTools;
	private apiRoutes: Router;
	private rester: Rester;

	constructor( public app: Application, public db: DB, public tools: MainTools ) {
		this.tool = new CredentialTools( this.db, this.tools );
		this.apiRoutes = Router();
		this.rester = new Rester( this.tools );

		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.tool );
		this.app.use( '/api/credentials', this.apiRoutes );
	}

	private setRoutes = () => {
		this.apiRoutes.get( '/reveal/:id', ( req, res ) => { this.rester.respond( this.tool.reveal, req.params.id, req, res ); } );
	}
}
