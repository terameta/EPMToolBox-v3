import { ConnectionPool } from 'mssql';
import { CookieJar } from 'request';

// import { JSONDeepCopy } from '../../shared/utilities/utility.functions';

export interface EnvironmentBase {
	id: number,
	name: string,
	type: EnvironmentType,
	server: string,
	port: string,
	verified: boolean,
	identitydomain: string,
	credential: number
}
export interface Environment extends EnvironmentBase { tags: { [key: string]: boolean } }
export interface EnvironmentOnDB extends EnvironmentBase { tags: string }

export interface EnvironmentDetail extends Environment {
	username: string,
	password: string,
	databases: { [key: string]: DatabaseListItem },
	mssql: EnvironmentMSSQL,
	smartview: EnvironmentSmartView
}

export interface EnvironmentMSSQL {
	connection: ConnectionPool,
	database: string,
	table: string,
	query: string
}

export interface EnvironmentSmartView {
	SID: string,
	ssotoken: string,
	cookie: string,
	url: string,
	nexturl: string,
	planningurl: string,
	planningserver: string,
	applications: { name: string }[],
	application: string,
	cubes: string[],
	cube: string,
	dimensions: any[],
	aliastables: any[],
	memberList: any[],
	ruleList: any[],
	procedure: { name: string, type: string, hasRTP: string, variables: any[] },
	jar: CookieJar,
	form: any
}

export interface DatabaseListItem { name: string, tables: TableListItem[] }
export interface TableListItem { name: string, type: string }

export enum EnvironmentType {
	'HP' = 1,
	'MSSQL' = 2,
	'PBCS' = 3,
	'ORADB' = 4
}

export const prepareToWrite = ( payload: Environment ): EnvironmentDetail => {
	const toReturn = <EnvironmentDetail>{ ...payload };
	delete toReturn.username;
	delete toReturn.password;
	if ( toReturn.mssql && toReturn.mssql.connection ) delete toReturn.mssql.connection;
	return toReturn;
};

// export interface ATEnvironmentDetail extends ATEnvironment {
// isSSOActive: string,
// 	database: string,
// 	table: string,
// 	smartview: {

// 	},
// 	pbcs: {
// 		address: string,
// 		restInitiated: boolean,
// 		resturl: string,
// 		smartviewurl: string
// 	},
// 	query: string,
// 	procedure: string
// }

// export const getDefaultATEnvironment = () => ( <ATEnvironment>JSONDeepCopy( { tags: {} } ) );

export function getTypeDescription( typecode: number | string ) {
	switch ( typecode ) {
		case 1:
		case '1':
		case 'HP': {
			return 'Hyperion Planning On-Premises';
		}
		case 2:
		case '2':
		case 'MSSQL': {
			return 'Microsoft SQL Server';
		}
		case 3:
		case '3':
		case 'PBCS': {
			return 'Hyperion Planning PBCS';
		}
		case 4:
		case '4':
		case 'ORADB': {
			return 'Oracle Database Server';
		}
	}
}



