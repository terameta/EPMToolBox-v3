import { DB } from './db';
import { MainTools } from './tools.main';
import { Tuple } from 'shared/models/tuple';
import { CloneTarget } from 'shared/models/clone.target';
import { ArtifactQuery, ArtifactType, DatabaseList, TableList, Artifact, DescriptiveFieldList } from '../../shared/models/artifacts.models';
import { EnvironmentTools } from './tools.environments';

export class ArtifactTools {
	private environmentTools: EnvironmentTools;

	constructor( private db: DB, private tools: MainTools ) {
		this.environmentTools = new EnvironmentTools( this.db, this.tools );
	}

	public getAll = async () => {
		const { tuples } = await this.db.query<Tuple>( 'SELECT * FROM artifacts' );
		return tuples.map<any>( this.tools.pTR );
	}

	public getOne = async ( id: number ) => {
		const { tuple } = await this.db.queryOne<Tuple>( 'SELECT * FROM artifacts WHERE id = ?', id );
		return this.tools.pTR<any>( tuple );
	}

	public create = async ( payload: any ) => {
		const target = this.tools.pTW( payload );
		delete target.id;
		const result = await this.db.queryOne<any>( 'INSERT INTO artifacts SET ?', target );
		target.id = result.tuple.insertId;
		return target;
	}

	public clone = async ( payload: CloneTarget ) => {
		const target = await this.getOne( payload.sourceid );
		if ( payload.name ) target.name = payload.name;
		return await this.create( target );
	}

	public update = async ( payload: any ) => {
		await this.db.queryOne( 'UPDATE artifacts SET ? WHERE id = ?', [this.tools.pTW( payload ), payload.id] );
		return { status: 'success' };
	}

	public delete = async ( id: number ) => {
		await this.db.query( 'DELETE FROM artifacts WHERE id = ?', id );
		return { status: 'success' };
	}

	public load = async ( payload: ArtifactQuery ) => {
		if ( payload.type === ArtifactType.DatabaseList ) {
			const { tuple } = await this.db.queryOne<Tuple>( 'SELECT * FROM artifacts WHERE details->"$.environment" = ? AND details->"$.type" = ?', [payload.environment, payload.type] ).catch( () => ( { tuple: null } ) );
			if ( tuple ) {
				const artifact: DatabaseList = this.tools.pTR<any>( tuple );
				if ( payload.forceRefetch ) {
					artifact.list = await this.environmentTools.listDatabases( payload.environment );
					this.update( artifact );
				}
				return artifact;
			} else {
				const artifact = <DatabaseList>{
					type: ArtifactType.DatabaseList,
					list: await this.environmentTools.listDatabases( payload.environment ),
					environment: payload.environment
				};
				this.create( artifact );
				return artifact;
			}
		}
		if ( payload.type === ArtifactType.TableList ) {
			const { tuple } = await this.db.
				queryOne<Tuple>( 'SELECT * FROM artifacts WHERE details->"$.environment" = ? AND details->"$.database" = ? AND details->"$.type" = ?', [payload.environment, payload.database, payload.type] ).
				catch( () => ( { tuple: null } ) );
			if ( tuple ) {
				const artifact: TableList = this.tools.pTR<any>( tuple );
				if ( payload.forceRefetch ) {
					artifact.list = await this.environmentTools.listTables( { id: payload.environment, database: payload.database } );
					this.update( artifact );
				}
				return artifact;
			} else {
				const artifact = <TableList>{
					type: ArtifactType.TableList,
					list: await this.environmentTools.listTables( { id: payload.environment, database: payload.database } ),
					environment: payload.environment,
					database: payload.database
				};
				this.create( artifact );
				return artifact;
			}
		}
		if ( payload.type === ArtifactType.DescriptiveFieldList ) {
			const { tuple } = await this.db.
				queryOne<Tuple>( 'SELECT * FROM artifacts WHERE details->"$.stream" = ? AND details->"$.field" = ? AND details->"$.type" = ?', [payload.stream, payload.field, payload.type] ).
				catch( () => ( { tuple: null } ) );
			if ( tuple ) {
				const artifact: DescriptiveFieldList = this.tools.pTR<any>( tuple );
				if ( payload.forceRefetch ) {
					artifact.list = await this.environmentTools.listDescriptiveFields( { id: payload.environment, streamid: payload.stream, field: payload.field } );
					this.update( artifact );
				}
				return artifact;
			} else {
				const artifact = <DescriptiveFieldList>{
					type: ArtifactType.DescriptiveFieldList,
					stream: payload.stream,
					field: payload.field,
					list: await this.environmentTools.listDescriptiveFields( { id: payload.environment, streamid: payload.stream, field: payload.field } )
				};
				this.create( artifact );
				return artifact;
			}
		}
		console.log( '???????????????????????????????????????????' );
		console.log( '???????????????????????????????????????????' );
		console.log( 'Wrong artifact type @tools.artifacts.ts@load' );
		console.log( '???????????????????????????????????????????' );
		console.log( '???????????????????????????????????????????' );
	}
}
