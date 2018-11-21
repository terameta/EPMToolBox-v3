import { JSONDeepCopy } from '../../shared/utilities/utility.functions';

interface ATStreamBase {
	id: number,
	name: string,
	type: ATStreamType,
	environment: number,
	dbName: string,
	tableName: string,
	customQuery: string,
	finalQuery: string,
	tags: any,
	exports: ATStreamExport[] | string,
	databaseList: { name: string }[] | string,
	tableList: { name: string, type?: string }[] | string,
	fieldList: ATStreamField[] | string
}

export interface ATStreamOnDB extends ATStreamBase {
	tags: string,
	exports: string,
	databaseList: string,
	tableList: string,
	fieldList: string
}

export interface ATStream extends ATStreamBase {
	tags: any
	exports: ATStreamExport[],
	databaseList: { name: string }[],
	tableList: { name: string, type?: string }[],
	fieldList: ATStreamField[]
}

export const atStreamObj2DB = ( payload: ATStream ): ATStreamOnDB => {
	const toReturn: ATStreamOnDB = {
		...payload,
		...{ tags: JSON.stringify( payload.tags || {} ) },
		...{ exports: JSON.stringify( payload.exports || [] ) },
		...{ databaseList: JSON.stringify( payload.databaseList || [] ) },
		...{ tableList: JSON.stringify( payload.tableList ) },
		...{ fieldList: JSON.stringify( payload.fieldList ) }
	};
	return toReturn;
};

export const atStreamDB2Obj = ( payload: ATStreamOnDB ): ATStream => {
	const toReturn: ATStream = {
		...payload,
		...{ tags: JSON.parse( payload.tags ) },
		...{ exports: JSON.parse( payload.exports ) },
		...{ databaseList: JSON.parse( payload.databaseList ) },
		...{ tableList: JSON.parse( payload.tableList ) },
		...{ fieldList: JSON.parse( payload.fieldList ) }
	};
	return toReturn;
};

export const getDefaultATStream = () => ( <ATStream>JSONDeepCopy( { tags: {}, exports: [] } ) );
export const getDefaultATStreamExport = () => ( <ATStreamExport>JSONDeepCopy( { name: '' } ) );

export interface ATStreamField {
	name: string,
	type: string,
	position: number,
	isDescribed: boolean
	fCharacters: number,
	fPrecision: number,
	fDecimals: number,
	fDateFormat: string,
	shouldIgnoreCrossTab: boolean,
	isFilter: boolean,
	isCrossTabFilter: boolean,
	isCrossTab: boolean,
	isMonth: boolean,
	isData: boolean,
	aggregateFunction: string,
	description: ATStreamFieldDescription
	items: ATStreamFieldItem[]
}

export interface ATStreamFieldItem {
	name: string,
	description: string,
	parent: string
}

export interface ATStreamFieldDescription {
	database: string,
	table: string,
	query: string,
	tableList: any[],
	fieldList: any[],
	referenceField: {
		name: string,
		type: string,
		characters: number,
		precision: number,
		decimals: number,
		dateformat: string
	},
	descriptionField: {
		name: string,
		type: string,
		characters: number,
		precision: number,
		decimals: number,
		dateformat: string
	}
}

// Before new changes

export interface ATStreamExport {
	name: string
}

export interface ATStreamExportHPDB extends ATStreamExport {
	rowDims: ATStreamExportHPDBDimensionDefinition[],
	colDims: ATStreamExportHPDBDimensionDefinition[],
	povDims: ATStreamExportHPDBDimensionDefinition[],
	cellCounts: any,
	cellCount: number,
	rows: any[],
	cols: any[],
	povs: any[]
}

export interface ATStreamExportHPDBDimensionDefinition {
	name: string,
	position: number,
	selectable: boolean,
	defaultSelection: string,
	limits: any[]
}

export const getDefaultATStreamExportHPDB = () => ( <ATStreamExportHPDB>JSONDeepCopy( {
	name: '',
	rowDims: [], colDims: [], povDims: [],
	cellCounts: <any>{},
	cellCount: 0,
	rows: [], cols: [], povs: []
} ) );

export interface ATStreamFieldOLD {
	id: number,
	stream: number,
	name: string,
	type: string,
	position: number,
	isDescribed: boolean
}

export interface ATStreamFieldDetailOLD extends ATStreamFieldOLD {
	fCharacters: number,
	fPrecision: number,
	fDecimals: number,
	fDateFormat: string,
	shouldIgnoreCrossTab: boolean,
	isFilter: boolean,
	isCrossTabFilter: boolean,
	isCrossTab: boolean,
	isMonth: boolean,
	isData: boolean,
	aggregateFunction: string,
	descriptiveDB: string,
	descriptiveTable: string,
	descriptiveTableList: any[],
	descriptiveFieldList: any[],
	descriptiveQuery: string,
	drfName: string,
	drfType: string,
	drfCharacters: number,
	drfPrecision: number,
	drfDecimals: number,
	drfDateFormat: string,
	ddfName: string,
	ddfType: string,
	ddfCharacters: number,
	ddfPrecision: number,
	ddfDecimals: number,
	ddfDateFormat: string
}

export enum ATStreamType {
	'RDBT' = 1,
	'HPDB' = 2
}

export function atGetStreamTypeDescription( typecode: number | string ) {
	switch ( typecode ) {
		case 1:
		case '1':
		case 'RDBT': {
			return 'Relational Database Table/View';
		}
		case 2:
		case '2':
		case 'HPDB': {
			return 'Hyperion Planning Database';
		}
	}
}
