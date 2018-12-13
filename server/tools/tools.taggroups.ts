import { DB } from './db';
import { MainTools } from './tools.main';
import { TagGroup } from 'src/app/admin/tags/taggroup.models';
import { CloneTarget } from 'shared/models/clone.target';
import { TagTools } from './tools.tags';

export class TagGroupTools {
	private tagTool: TagTools;
	constructor( private db: DB, private tools: MainTools ) {
		this.tagTool = new TagTools( db, tools );
	}

	public getAll = async () => {
		const { tuples } = await this.db.query<TagGroup>( 'SELECT * FROM taggroups ORDER BY -position DESC, id' );
		this.makeSureOrderIsCorrect( tuples );
		return tuples.map( t => ( { ...t, position: t.position || 999999 } ) );
	}
	public makeSureOrderIsCorrect = ( tuples: TagGroup[] ) => {
		const ids: number[] = [];
		const indexes: number[] = [];
		tuples.forEach( ( tuple, ti ) => {
			if ( tuple.position !== ( ( ti + 1 ) * 10 ) ) {
				ids.push( tuple.id );
				indexes.push( ( ti + 1 ) * 10 );
			}
		} );
		if ( ids.length > 0 ) {
			let q = 'UPDATE taggroups SET position = ( case ';
			ids.forEach( ( id, idx ) => {
				q += '\n when id = ' + id + ' then ' + indexes[idx];
			} );
			q += '\n end) WHERE id IN (' + ids.join( ',' ) + ')';
			this.db.queryOne( q );
		}
	}
	public getOne = async ( id: number ) => {
		return ( await this.db.queryOne<TagGroup>( 'SELECT * FROM taggroups WHERE id = ?', id ) ).tuple;
	}
	public create = async ( payload: TagGroup ) => {
		delete payload.id;
		if ( !payload.position ) payload.position = 999999;
		const result = await this.db.queryOne<any>( 'INSERT INTO taggroups SET ?', payload );
		payload.id = result.tuple.insertId;
		return payload;
	}
	public clone = async ( payload: CloneTarget ) => {
		const sourceGroup = await this.getOne( payload.sourceid );
		sourceGroup.name = payload.name;
		const targetGroup = await this.create( sourceGroup );
		const tags = ( await this.tagTool.getAll() ).
			filter( t => t.taggroup === payload.sourceid ).
			map( t => ( { ...t, taggroup: targetGroup.id } ) );
		for ( const tag of tags ) {
			await this.tagTool.create( tag );
		}
		return targetGroup;
	}
	public update = async ( payload: TagGroup ) => {
		await this.db.queryOne( 'UPDATE taggroups SET ? WHERE id = ?', [payload, payload.id] );
	}
	public delete = async ( id: number ) => {
		await this.db.query( 'DELETE FROM tags WHERE taggroup = ?', id );
		await this.db.query( 'DELETE FROM taggroups WHERE id = ?', id );
	}
}
