import { DB } from './db';
import { MainTools } from './tools.main';
import { AccessManagementServer } from 'shared/models/accessmanagement.server';

export class AccessManagementServerTool {
	private protectedWord = '|||---protected---|||';

	constructor( public db: DB, public tools: MainTools ) { }

	public getAll = async () => {
		const { tuples } = await this.db.query<AccessManagementServer>( 'SELECT * FROM acmservers' );
		tuples.forEach( t => t.password = this.protectedWord );
		return tuples;
	}
	public create = async ( payload?: AccessManagementServer ) => {
		const toCreate: AccessManagementServer = { ...payload, ...{ name: 'New Server (Please change name' } };
		delete toCreate.id;
		const { tuple } = await this.db.queryOne( 'INSERT INTO acmservers SET ?', toCreate );
		return { id: ( tuple as any ).insertId };
	}
	public getOne = ( id: number ) => {
		return this.getServerDetails( <AccessManagementServer>{ id: id } );
	}
	public getServerDetails = async ( refObj: AccessManagementServer, shouldShowPassword?: boolean ) => {
		const { tuple } = await this.db.queryOne<AccessManagementServer>( 'SELECT * FROM acmservers WHERE id = ?', refObj.id );
		if ( shouldShowPassword ) {
			tuple.password = this.tools.decryptText( tuple.password );
		} else {
			tuple.password = this.protectedWord;
		}
		return tuple;
	}
	public update = async ( payload: AccessManagementServer ) => {
		if ( payload.password === this.protectedWord ) {
			delete payload.password;
		} else {
			payload.password = this.tools.encryptText( payload.password );
		}
		await this.db.queryOne( 'UPDATE acmservers SET ? WHERE id = ?', [payload, payload.id] );
		payload.password = this.protectedWord;
		return payload;
	}
	public delete = async ( id: number ) => {
		await this.db.queryOne( 'DELETE FROM acmservers WHERE id = ?', id );
		return { id };
	}
}
