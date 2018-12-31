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
	mssql: EnvironmentMSSQL,
	smartview: EnvironmentSmartView
}

export interface EnvironmentMSSQL {
	connection: ConnectionPool,
	database: string,
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

export enum EnvironmentType {
	'HP' = 1,
	'MSSQL' = 2,
	'PBCS' = 3,
	'ORADB' = 4
}

export const prepareToRead = ( payload: EnvironmentOnDB ): Environment => ( { ...payload, tags: payload.tags ? JSON.parse( payload.tags ) : JSON.parse( '{}' ) } );

export const prepareToWrite = ( payload: Environment ): EnvironmentOnDB => {
	const toReturn = <EnvironmentDetail>{ ...payload };
	delete toReturn.mssql;
	delete toReturn.smartview;
	delete toReturn.username;
	delete toReturn.password;
	return { ...toReturn, tags: JSON.stringify( payload.tags ) };
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



