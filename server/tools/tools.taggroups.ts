import { DB } from './db';
import { MainTools } from './tools.main';
import { TagGroup } from 'src/app/admin/tags/taggroup.models';

export class TagGroupTools {
	constructor( private db: DB, private tools: MainTools ) { }

	public getAll = async () => ( await this.db.query<TagGroup>( 'SELECT * FROM taggroups' ) ).tuples;
	public getOne = async ( id: number ) => ( await this.db.queryOne<TagGroup>( 'SELECT * FROM taggroups WHERE id = ?', id ) ).tuple;
}
