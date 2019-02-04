import { SmartViewTool } from './tools.smartview';
import { DB } from './db';
import { MainTools } from './tools.main';
import { EnvironmentDetail } from '../../shared/models/environments.models';
import { StreamField, Stream } from 'shared/models/streams.models';

export class HPTool {
	smartview: SmartViewTool;

	constructor( public db: DB, public tools: MainTools ) {
		this.smartview = new SmartViewTool( this.db, this.tools );
	}

	public verify = ( payload: EnvironmentDetail ) => this.smartview.validateSID( payload );
	public listDatabases = ( payload: EnvironmentDetail ) => this.smartview.listApplications( payload );
	public listTables = ( payload: EnvironmentDetail ) => this.smartview.listCubes( payload );
	public listFields = ( payload: EnvironmentDetail ) => this.smartview.listDimensions( payload );
	public listAliasTables = ( payload: EnvironmentDetail ) => this.smartview.listAliasTables( payload );
	public listDescriptions = ( payload: EnvironmentDetail, stream: Stream, field: StreamField ) => this.smartview.listDescriptions( { environment: payload, stream, field } );
	// public listProcedures = ( payload: EnvironmentDetail ) => this.smartview.listBusinessRules( payload );
	// public listProcedureDetails = ( payload: EnvironmentDetail ) => this.smartview.listBusinessRuleDetails( payload );
	// public writeData = ( refObj ) => this.smartview.writeData( refObj );
	public readData = async ( payload: EnvironmentDetail, stream: Stream ) => this.smartview.readData( payload, stream );
	// public runProcedure = ( payload ) => this.smartview.runBusinessRule( payload );
}
