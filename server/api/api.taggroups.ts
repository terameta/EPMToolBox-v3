import { TagGroupTools } from '../tools/tools.taggroups';
import { Router, Application } from 'express';
import { Rester } from '../tools/tools.rester';
import { DB } from 'server/tools/db';
import { MainTools } from 'server/tools/tools.main';

export class ApiTagGroups {
	private tool: TagGroupTools;
	private apiRoutes: Router;
	private rester: Rester;

	constructor( public app: Application, public db: DB, public tools: MainTools ) {
		this.tool = new TagGroupTools( this.db, this.tools );
		this.apiRoutes = Router();
		this.rester = new Rester( this.tools );

		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.tool );
		this.app.use( '/api/taggroups', this.apiRoutes );
	}

	private setRoutes = () => {
		// this.apiRoutes.post( '/signin', ( req, res ) => { this.rester.respond( this.tool.signin, req.body, req, res ); } );
	}
}
