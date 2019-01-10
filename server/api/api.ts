import { Application } from 'express';
import { MainTools } from 'server/tools/tools.main';
import { DB } from 'server/tools/db';
import { ApiAuth } from './api.auth';
import { ApiTags } from './api.tags';
import { ApiTagGroups } from './api.taggroups';
import { ApiCredentials } from './api.credentials';
import { ApiEnvironments } from './api.environments';
import { ApiStreams } from './api.streams';
import { ApiArtifacts } from './api.artifacts';

export class RestAPI {
	constructor( private app: Application, private db: DB, private tools: MainTools ) {
		const apiArtifacts = new ApiArtifacts( this.app, this.db, this.tools );
		const apiAuth = new ApiAuth( this.app, this.db, this.tools );
		const apiCredential = new ApiCredentials( this.app, this.db, this.tools );
		const apiEnvironment = new ApiEnvironments( this.app, this.db, this.tools );
		const apiStream = new ApiStreams( this.app, this.db, this.tools );
		const apiTags = new ApiTags( this.app, this.db, this.tools );
		const apiTagGroups = new ApiTagGroups( this.app, this.db, this.tools );
	}
}
