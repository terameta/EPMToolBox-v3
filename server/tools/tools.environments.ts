import { DB } from './db';
import { MainTools } from './tools.main';
import { EnvironmentOnDB, Environment, EnvironmentType, EnvironmentDetail, prepareToWrite, EnvironmentMSSQL, EnvironmentSmartView } from '../../shared/models/environments.models';
import { CredentialTools } from './tools.credentials';
import { HPTool } from './tools.hp';
import { PBCSTool } from './tools.pbcs';
import { MSSQLTool } from './tools.mssql';
import { CloneTarget } from '../../shared/models/clone.target';
import { Tuple } from 'shared/models/tuple';

export class EnvironmentTools {
	private credentialTool: CredentialTools;
	private sourceTools: { [key: number]: HPTool | PBCSTool | MSSQLTool } = {};

	constructor( private db: DB, private tools: MainTools ) {
		this.credentialTool = new CredentialTools( this.db, this.tools );
		this.sourceTools[EnvironmentType.HP] = new HPTool( this.db, this.tools );
		this.sourceTools[EnvironmentType.PBCS] = new PBCSTool( this.db, this.tools );
		this.sourceTools[EnvironmentType.MSSQL] = new MSSQLTool( this.db, this.tools );
	}

	public getAll = async () => {
		const { tuples } = await this.db.query<Tuple>( 'SELECT * FROM environments' );
		return tuples.map<EnvironmentDetail>( this.tools.pTR );
	}

	public getOne = ( id: number ) => this.getDetails( id );

	public getDetails = async ( id: number, reveal = false ) => {
		const { tuple } = await this.db.queryOne<Tuple>( 'SELECT * FROM environments WHERE id = ?', id );
		const toReturn = this.tools.pTR<EnvironmentDetail>( tuple );
		if ( reveal ) {
			const { username, password } = await this.credentialTool.getDetails( toReturn.credential, true );
			toReturn.username = username;
			toReturn.password = password;
		}
		if ( toReturn.type === EnvironmentType.MSSQL && !toReturn.mssql ) toReturn.mssql = <EnvironmentMSSQL>{};
		if ( toReturn.type === EnvironmentType.PBCS && !toReturn.smartview ) toReturn.smartview = <EnvironmentSmartView>{};
		if ( toReturn.type === EnvironmentType.HP && !toReturn.smartview ) toReturn.smartview = <EnvironmentSmartView>{};
		return toReturn;
	}

	public create = async ( payload: Environment ) => {
		delete payload.id;
		const target = prepareToWrite( payload );
		if ( !target.name ) target.name = 'New Environment';
		const result = await this.db.queryOne<any>( 'INSERT INTO environments SET ?', this.tools.pTW( target ) );
		target.id = result.tuple.insertId;
		return target;
	}

	public clone = async ( payload: CloneTarget ) => {
		const environment = await this.getOne( payload.sourceid );
		environment.name = payload.name;
		environment.verified = false;
		return await this.create( environment );
	}

	public update = async ( payload: Environment ) => {
		await this.db.queryOne( 'UPDATE environments SET ? WHERE id = ?', [this.tools.pTW( prepareToWrite( payload ) ), payload.id] );
		return { status: 'success' };
	}

	public delete = async ( id: number ) => {
		await this.db.query( 'DELETE FROM environments WHERE id = ?', id );
		return { status: 'success' };
	}

	public verify = async ( id: number ) => {
		const payload = await this.getDetails( id, true );
		await this.setUnVerified( payload );
		await this.sourceTools[payload.type].verify( payload );
		await this.setVerified( payload );
		return { id, result: 'OK' };
	}

	private setVerified = async ( payload: EnvironmentDetail ) => this.update( { ...payload, ...{ verified: true } } );
	private setUnVerified = async ( payload: EnvironmentDetail ) => this.update( { ...payload, ...{ verified: false } } );

	public listDatabases = async ( id: number ) => {
		const payload = await this.getDetails( id, true );
		const databasesReceived = await this.sourceTools[payload.type].listDatabases( payload );
		if ( !payload.databases ) payload.databases = {};
		databasesReceived.forEach( db => {
			if ( !payload.databases[db.name] ) payload.databases[db.name] = { name: db.name, tables: [] };
		} );
		await this.update( payload );
		return { result: 'success' };
	}
	public listTables = async ( payload: { id: number, database: string } ) => {
		const lister = await this.getDetails( payload.id, true );
		if ( payload.database ) {
			if ( lister.smartview ) lister.smartview.application = payload.database;
			if ( lister.mssql ) lister.mssql.database = payload.database;
		}
		if ( !lister.databases ) lister.databases = {};
		if ( !lister.databases[payload.database] ) lister.databases[payload.database] = { name: payload.database, tables: [] };
		lister.databases[payload.database].tables = await this.sourceTools[lister.type].listTables( lister );
		await this.update( lister );
		return { result: 'success' };
	}
}

// import { ATTuple } from '../../shared/models/at.tuple';
// import { ATEnvironmentType, ATEnvironment, ATEnvironmentDetail , atEnvironmentPrepareToSave } from '../../shared/models/at.environment';
// import { ATStream, ATStreamField } from '../../shared/models/at.stream';



// 	public listDescriptiveTables = async ( payload: { id: number, database: string, table: string } ) => {
// 		const cEnv = await this.getEnvironmentDetails( payload.id, true );
// 		if ( payload.database ) cEnv.database = payload.database;
// 		if ( payload.table ) cEnv.table = payload.table;
// 		if ( cEnv.type === ATEnvironmentType.HP || cEnv.type === ATEnvironmentType.PBCS ) {
// 			return await this.sourceTools[cEnv.type].listAliasTables( cEnv );
// 		} else {
// 			return await this.sourceTools[cEnv.type].listTables( cEnv );
// 		}
// 	}
// 	public listFields = async ( payload: { id: number, database: string, table: string, query: string } ) => {
// 		const currentEnvironment = await this.getEnvironmentDetails( payload.id, true );
// 		if ( payload.database ) currentEnvironment.database = payload.database;
// 		if ( payload.table ) currentEnvironment.table = payload.table;
// 		if ( payload.query ) currentEnvironment.query = payload.query;
// 		return await this.sourceTools[currentEnvironment.type].listFields( currentEnvironment );
// 	}
// 	public listAliasTables = async ( id: number, database: string, query: string, table: string ) => {
// 		const payload = await this.getEnvironmentDetails( id, true );
// 		if ( database ) payload.database = database;
// 		if ( query ) payload.query = query;
// 		if ( table ) payload.table = table;
// 		return await this.sourceTools[payload.type].listAliasTables( payload );
// 	}
// 	public listProcedures = async ( stream: ATStream ) => {
// 		const payload = await this.getEnvironmentDetails( stream.environment, true );
// 		if ( stream.dbName ) payload.database = stream.dbName;
// 		if ( stream.tableName ) payload.table = stream.tableName;
// 		return await this.sourceTools[payload.type].listProcedures( payload );
// 	}
// 	public listProcedureDetails = async ( refObj: { stream: ATStream, procedure: any } ) => {
// 		const payload = await this.getEnvironmentDetails( refObj.stream.environment, true );
// 		if ( refObj.stream.dbName ) payload.database = refObj.stream.dbName;
// 		if ( refObj.stream.tableName ) payload.table = refObj.stream.tableName;
// 		payload.procedure = refObj.procedure;
// 		return await this.sourceTools[payload.type].listProcedureDetails( payload );
// 	}
// 	public runProcedure = async ( refObj: { stream: ATStream, procedure: any } ) => {
// 		if ( !refObj ) throw new Error( 'No object passed.' );
// 		if ( !refObj.stream ) throw new Error( 'No stream passed.' );
// 		if ( !refObj.stream.environment ) throw new Error( 'Malformed stream object' );
// 		if ( !refObj.procedure ) throw new Error( 'Procedure definition is missing' );
// 		const payload = await this.getEnvironmentDetails( refObj.stream.environment, true );
// 		if ( refObj.stream.dbName ) payload.database = refObj.stream.dbName;
// 		if ( refObj.stream.tableName ) payload.table = refObj.stream.tableName;
// 		payload.procedure = refObj.procedure;
// 		if ( refObj.procedure ) {
// 			if ( refObj.procedure.tableName ) payload.table = refObj.procedure.tableName;
// 		}
// 		return await this.sourceTools[payload.type].runProcedure( payload );
// 	}
// 	public getDescriptions = async ( stream: ATStream, field: ATStreamField ) => {
// 		const payload = await this.getEnvironmentDetails( stream.environment, true );
// 		payload.database = stream.dbName;
// 		payload.table = stream.tableName;
// 		return await this.sourceTools[payload.type].getDescriptions( payload, field );
// 	}
// 	public getDescriptionsWithHierarchy = async ( stream: ATStream, field: ATStreamField ) => {
// 		const payload = await this.getEnvironmentDetails( stream.environment, true );
// 		payload.database = stream.dbName;
// 		payload.table = stream.tableName;
// 		return await this.sourceTools[payload.type].getDescriptionsWithHierarchy( payload, field );
// 	}
// 	public writeData = async ( refObj: any ) => {
// 		const payload: any = await this.getEnvironmentDetails( refObj.id, true );
// 		payload.database = refObj.db;
// 		payload.table = refObj.table;
// 		payload.data = refObj.data;
// 		payload.sparseDims = refObj.sparseDims;
// 		payload.denseDim = refObj.denseDim;
// 		return await this.sourceTools[payload.type].writeData( payload );
// 	}
// 	public readData = async ( id: number, database: string, table: string, query: any ) => {
// 		const payload = await this.getEnvironmentDetails( id, true );
// 		payload.database = database;
// 		payload.table = table;
// 		payload.query = query;
// 		return await this.sourceTools[payload.type].readData( payload );
// 	}
// }
