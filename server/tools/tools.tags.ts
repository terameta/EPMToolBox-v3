import { DB } from './db';
import { MainTools } from './tools.main';
import { Tag } from 'src/app/admin/tags/tag.models';

export class TagTools {
	constructor( private db: DB, private tools: MainTools ) { }

	public getAll = async () => ( await this.db.query<Tag>( 'SELECT * FROM tags' ) ).tuples;
	public getOne = async ( id: number ) => ( await this.db.queryOne<Tag>( 'SELECT * FROM tags WHERE id = ?', id ) ).tuple;
	public create = async ( payload: Tag ) => {
		delete payload.id;
		await this.db.queryOne<any>( 'INSERT INTO tags SET ?', payload );
	}
	public update = async ( payload: Tag ) => {
		await this.db.queryOne( 'UPDATE tags SET ? WHERE id = ?', [payload, payload.id] );
	}
	public delete = async ( id: number ) => {
		await this.db.query( 'DELETE FROM tags WHERE id = ?', id );
	}
}
