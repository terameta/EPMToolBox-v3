import { AuthTools } from '../tools/tools.auth';
import { Application, Router } from 'express';
import { DB } from '../tools/db';
import { Rester } from '../tools/tools.rester';
import { MainTools } from '../tools/tools.main';
// import { Pool } from 'mysql';

// import { Rester } from '../tools/tools.rester';
// import { MainTools } from '../tools/tools.main';

// import { AuthTools } from '../tools/tools.auth';


export class ApiAuth {
	private tool: AuthTools;
	private apiRoutes: Router;
	private rester: Rester;

	constructor( public app: Application, public db: DB, public tools: MainTools ) {
		this.tool = new AuthTools( this.db, this.tools );
		this.apiRoutes = Router();
		this.rester = new Rester( this.tools );

		this.setRoutes();
		// this.rester.restify(this.apiRoutes, this.tool);
		this.app.use( '/api/auth', this.apiRoutes );
	}

	private setRoutes = () => {
		this.apiRoutes.post( '/signin', ( req, res ) => { this.rester.respond( this.tool.signin, req.body, req, res ); } );
	}
}
