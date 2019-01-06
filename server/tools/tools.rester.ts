import { Request, Response, Router } from 'express';

import { MainTools } from './tools.main';
import { CredentialTools } from './tools.credentials';
import { TagTools } from './tools.tags';
import { TagGroupTools } from './tools.taggroups';
import { EnvironmentTools } from './tools.environments';
import { StreamTools } from './tools.streams';

export class Rester {
	constructor( public tools: MainTools ) { }

	public respond = ( theFunction: Function, payload: any, req: Request, res: Response ) => {
		theFunction( payload ).
			then( ( result: any ) => res.send( result ) ).
			catch( ( issue: Error ) => res.status( 500 ).json( { status: 'fail', title: issue.name, message: issue.message } ) );
	}

	public restify( router: Router, tool: CredentialTools | EnvironmentTools | StreamTools | TagTools | TagGroupTools ) {
		router.get( '/', ( req: Request, res: Response ) => {
			this.respond( tool.getAll, null, req, res );
		} );

		router.get( '/:id', ( req: Request, res: Response ) => {
			this.respond( tool.getOne, req.params.id, req, res );
		} );

		router.post( '/', ( req: Request, res: Response ) => {
			this.respond( tool.create, req.body, req, res );
		} );

		router.put( '/', ( req: Request, res: Response ) => {
			this.respond( tool.clone, req.body, req, res );
		} );

		router.patch( '/', ( req: Request, res: Response ) => {
			this.respond( tool.update, req.body, req, res );
		} );

		router.delete( '/:id', ( req: Request, res: Response ) => {
			this.respond( tool.delete, req.params.id, req, res );
		} );
	}
}
