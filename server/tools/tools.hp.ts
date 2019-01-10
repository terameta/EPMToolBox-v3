import { SmartViewTool } from './tools.smartview';
import { DB } from './db';
import { MainTools } from './tools.main';
import { ATStreamField } from '../../shared/models/at.stream';
import { EnvironmentDetail } from '../../shared/models/environments.models';

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
	// public getDescriptions = ( payload: EnvironmentDetail, field: ATStreamField ) => this.smartview.getDescriptions( payload, field );
	// public getDescriptionsWithHierarchy = ( payload: EnvironmentDetail, field: ATStreamField ) => this.smartview.getDescriptionsWithHierarchy( payload, field );
	// public listProcedures = ( payload: EnvironmentDetail ) => this.smartview.listBusinessRules( payload );
	// public listProcedureDetails = ( payload: EnvironmentDetail ) => this.smartview.listBusinessRuleDetails( payload );
	// public writeData = ( refObj ) => this.smartview.writeData( refObj );
	// public readData = ( refObj ) => this.smartview.readData( refObj );
	// public runProcedure = ( refObj ) => this.smartview.runBusinessRule( refObj );
}
