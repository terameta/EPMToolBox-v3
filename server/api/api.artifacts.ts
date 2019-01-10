import { ArtifactTools } from '../tools/tools.artifacts';
import { Application, Router } from 'express';
import { Rester } from '../tools/tools.rester';
import { DB } from '../tools/db';
import { MainTools } from '../tools/tools.main';

export class ApiArtifacts {
	private tool: ArtifactTools;
	private apiRoutes: Router;
	private rester: Rester;

	constructor( public app: Application, public db: DB, public tools: MainTools ) {
		this.tool = new ArtifactTools( this.db, this.tools );
		this.apiRoutes = Router();
		this.rester = new Rester( this.tools );

		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.tool );
		this.app.use( '/api/artifacts', this.apiRoutes );
	}

	private setRoutes = () => {
		this.apiRoutes.post( '/load', ( req, res ) => this.rester.respond( this.tool.load, req.body, req, res ) );
	}

}
