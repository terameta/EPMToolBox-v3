import * as bcrypt from 'bcrypt';
import * as ActiveDirectory from 'activedirectory';

import { AccessManagementServer } from 'shared/models/accessmanagement.server';
import { User, UserType } from '../../shared/models/user';
import { AccessManagementServerTool } from './tools.accessmanagement.server';
import { MainTools } from './tools.main';
import { DB } from './db';
import { waiter } from '../../shared/utilities/utility.functions';

interface AuthObjectDirectory {
	username: string,
	password: string,
	dbUser: User,
	ldapClient: any,
	ldapServer: AccessManagementServer
}

export class AuthTools {
	private acmServerTool: AccessManagementServerTool;

	constructor(
		public db: DB,
		public tools: MainTools
	) {
		this.acmServerTool = new AccessManagementServerTool( this.db, this.tools );
	}

	public signin = async ( payload: { username: string, password: string } ) => {
		if ( !payload || !payload.username || !payload.password ) throw new Error( 'No credentials presented' );
		return await this.authenticate( payload );
	}

	private authenticate = async ( payload: { username: string, password: string } ) => {
		const fixedUserName = payload.username.toString().toLowerCase();
		const { tuple: dbUser } = await this.db.queryOne<User>( 'SELECT * FROM users WHERE username = ?', fixedUserName );
		if ( dbUser.type === UserType.Local ) return await this.authenticateWithLocal( payload.username, payload.password, dbUser );
		if ( dbUser.type === UserType.Directory ) return await this.authenticateWithDirectory( payload.username, payload.password, dbUser );
		throw new Error( 'Wrong user type. Please consult with system admin' );
	}

	private authenticateWithLocal = ( username: string, password: string, dbUser: User ) => {
		return new Promise( ( resolve, reject ) => {
			bcrypt.compare( password, dbUser.password, ( err, hashResult ) => {
				if ( err ) {
					reject( new Error( 'There is an issue with the encryption. Please consult with the system admin.' ) );
				} else if ( !hashResult ) {
					reject( new Error( 'Authentication failed' ) );
				} else {
					resolve( this.authenticateAction( dbUser ) );
				}
			} );
		} );
	}

	private authenticateWithDirectory = async ( username: string, password: string, dbUser: User ) => {
		const authObj = <AuthObjectDirectory>{ username, password, dbUser };
		authObj.ldapServer = await this.acmServerTool.getServerDetails( <AccessManagementServer>{ id: dbUser.ldapserver }, true );
		await this.authenticateWithDirectoryBind( authObj );
		await this.authenticateWithDirectorySearch( authObj );
		await this.authenticateWithDirectoryAuthenticate( authObj );
		return await this.authenticateAction( dbUser );
	}

	private authenticateWithDirectoryBind = ( authObj: AuthObjectDirectory ) => {
		return new Promise( ( resolve, reject ) => {
			const config = {
				url: 'ldap://' + authObj.ldapServer.hostname + ':' + authObj.ldapServer.port,
				baseDN: authObj.ldapServer.basedn,
				username: authObj.ldapServer.userdn,
				password: authObj.ldapServer.password
			};
			authObj.ldapClient = new ActiveDirectory( config );
			authObj.ldapClient.authenticate( authObj.ldapServer.prefix + '\\' + authObj.ldapServer.userdn, authObj.ldapServer.password, ( err: any, auth: any ) => {
				if ( err ) {
					reject( err );
				} else if ( auth ) {
					resolve( authObj );
				} else {
					reject( new Error( 'There is an issue with the directory server binding. Please consult with the system admin.' ) );
				}
			} );
		} );
	}
	private authenticateWithDirectorySearch = ( authObj: AuthObjectDirectory ) => {
		return new Promise( ( resolve, reject ) => {
			authObj.ldapClient.findUsers( 'mail=' + authObj.username, ( err: any, users: any ) => {
				if ( err ) {
					reject( err );
				} else if ( !users ) {
					reject( new Error( 'User not found in the directory' ) );
				} else if ( users.length !== 1 ) {
					reject( new Error( 'User not found in the directory.' ) );
				} else {
					authObj.username = users[0].userPrincipalName;
					resolve( authObj );
				}
			} );
		} );
	}
	private authenticateWithDirectoryAuthenticate = ( authObj: AuthObjectDirectory ) => {
		return new Promise( ( resolve, reject ) => {
			authObj.ldapClient.authenticate( authObj.username, authObj.password, ( err: any, auth: any ) => {
				if ( err ) {
					reject( err );
				} else if ( auth ) {
					resolve( authObj.dbUser );
				} else {
					reject( new Error( 'User authentication has failed!' ) );
				}
			} );
		} );
	}
	private authenticateAction = ( dbUser: User ) => {
		return new Promise( ( resolve, reject ) => {
			delete dbUser.password;
			const token = this.tools.signToken( dbUser );
			resolve( { status: 'success', message: 'Welcome to EPM Tool Box', token: token } );
		} );
	}
}
