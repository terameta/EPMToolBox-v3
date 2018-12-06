import { Application } from 'express';
import { MainTools } from 'server/tools/tools.main';
import { DB } from 'server/tools/db';
import { ApiAuth } from './api.auth';
import { ApiTags } from './api.tags';
import { ApiTagGroups } from './api.taggroups';

// export const initializeRestApi = ( app: Application, db: DB, tools: MainTools ) => {
// 	console.log( 'initializing Rest API' );

// 	// const apiLog = new ApiLog( app, refDB, refTools );

// 	// const apiDimeTag = new ApiDimeTag( app, refDB, refTools );
// 	// const apiDimeTagGroup = new ApiDimeTagGroup( app, refDB, refTools );
// 	// const apiDimeCredential = new ApiDimeCredential( app, refDB, refTools );
// 	// const apiDimeEnvironment = new ApiDimeEnvironment( app, refDB, refTools );
// 	// const apiDimeStream = new ApiDimeStream( app, refDB, refTools );
// 	// const apiDimeMap = new ApiDimeMap( app, refDB, refTools );
// 	// const apiDimeMatrix = new ApiDimeMatrix( app, refDB, refTools );
// 	// const apiDimeProcess = new ApiDimeProcess( app, refDB, refTools );
// 	// const apiDimeAsyncProcess = new ApiDimeAsyncProcess( app, refDB, refTools );
// 	// const apiDimeSchedule = new ApiDimeSchedule( app, refDB, refTools );
// 	// const apiDimeSecret = new ApiDimeSecret( app, refDB, refTools );

// 	// const apiAcmServer = new ApiAcmServers( app, refDB, refTools );
// 	// const apiAcmUser = new ApiAcmUsers( app, refDB, refTools );

// 	// const apiAuth = new ApiAuth( app, refDB, refTools );
// 	// const apiSettings = new ApiSettings( app, refDB, refTools );
// };

export class RestAPI {
	constructor( private app: Application, private db: DB, private tools: MainTools ) {
		const apiAuth = new ApiAuth( this.app, this.db, this.tools );
		const apiTags = new ApiTags( this.app, this.db, this.tools );
		const apiTagGroups = new ApiTagGroups( this.app, this.db, this.tools );
	}
}
