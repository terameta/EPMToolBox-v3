import { DB } from './db';
import { MainTools } from './tools.main';
import { Tag } from 'src/app/admin/tags/tag.models';

export class TagTools {
	constructor( private db: DB, private tools: MainTools ) { }

	public getAll = async () => ( await this.db.query<Tag>( 'SELECT * FROM tags' ) ).tuples;
	public getOne = async ( id: number ) => ( await this.db.queryOne<Tag>( 'SELECT * FROM tags WHERE id = ?', id ) ).tuple;
	// public create = async (payload: Tag) =>
}
