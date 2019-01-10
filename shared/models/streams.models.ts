import { JSONDeepCopy } from '../utilities/utility.functions';

export interface Stream {
	id: number,
	name: string,
	type: StreamType,
	environment: number,
	dbName: string,
	tableName: string,
	customQuery: string,
	finalQuery: string,
	tags: any,
	exports: StreamExport[],
	databaseList: { name: string }[],
	tableList: { name: string, type?: string }[],
	fieldList: StreamField[]
}

export const getDefaultStream = () => ( <Stream>JSONDeepCopy( { tags: {}, exports: [] } ) );
export const getDefaultStreamExport = () => ( <StreamExport>JSONDeepCopy( { name: '' } ) );

export interface StreamField {
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
	description: StreamFieldDescription
	items: StreamFieldItem[]
}

export interface StreamFieldItem {
	name: string,
	description: string,
	parent: string
}

export interface StreamFieldDescription {
	database: string,
	table: string,
	query: string,
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

export interface StreamExport {
	name: string
}

export interface StreamExportHPDB extends StreamExport {
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

export const getDefaultATStreamExportHPDB = () => ( <StreamExportHPDB>JSONDeepCopy( {
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

export enum StreamType {
	'RDBT' = 1,
	'HPDB' = 2
}

export function getTypeDescription( typecode: number | string ) {
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
