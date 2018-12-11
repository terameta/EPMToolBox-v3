import { DB } from './db';
import { MainTools } from './tools.main';
import { Credential, credentialProtectionString } from '../../src/app/admin/credentials/credential.models';

export class CredentialTools {
	constructor( private db: DB, private tools: MainTools ) { }

	public getAll = async () => {
		const { tuples } = await this.db.query<Credential>( 'SELECT * FROM credentials' );
		return tuples.map( this.prepareCredentialToRead );
	}

	public getOne = async ( id: number ) => this.getCredentialDetails( id );

	public getCredentialDetails = async ( id: number, reveal = false, leaveAsItIs = false ) => {
		const { tuple: credential } = await this.db.queryOne<Credential>( 'SELECT * FROM credentials WHERE id = ?', id );
		if ( reveal ) {
			credential.password = this.tools.decryptText( credential.password );
		} else if ( !leaveAsItIs ) {
			this.prepareCredentialToRead( credential );
		}
		return credential;
	}

	public create = async ( payload: Credential ) => {
		delete payload.id;
		if ( !payload.name ) payload.name = 'New Credential';
		if ( payload.password && payload.password !== credentialProtectionString ) {
			payload.password = this.tools.encryptText( payload.password );
		}
		payload.tags = JSON.stringify( payload.tags );
		const result = await this.db.queryOne<any>( 'INSERT INTO credentials SET ?', payload );
		payload.id = result.tuple.insertId;
		return payload;
	}

	public update = async ( payload: Credential ) => {
		if ( payload.password === credentialProtectionString ) {
			delete payload.password;
		} else {
			payload.password = this.tools.encryptText( payload.password );
		}
		delete payload.clearPassword;
		payload.tags = JSON.stringify( payload.tags );
		await this.db.queryOne( 'UPDATE credentials SET ? WHERE id = ?', [payload, payload.id] );
		return { status: 'success' };
	}

	public delete = async ( id: number ) => {
		await this.db.query( 'DELETE FROM credentials WHERE id = ?', id );
		return { status: 'success' };
	}

	public reveal = async ( id: number ) => ( { clearPassword: ( await this.getCredentialDetails( id, true ) ).password } );

	private prepareCredentialToRead = ( payload: Credential ): Credential => {
		payload.password = credentialProtectionString;
		payload.tags = payload.tags ? JSON.parse( payload.tags ) : JSON.parse( '{}' );
		return payload;
	}
}
