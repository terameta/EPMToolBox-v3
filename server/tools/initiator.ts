import { InitiatorUtils } from './initiator.utils';
import { MainTools } from './tools.main';
import { SystemConfig } from '../../shared/models/systemconfig';
import { DB } from './db';
import * as tableDefinitions from './initiator.tabledefinitions';
import { ATEnvironmentType, ATEnvironment } from '../../shared/models/at.environment';
import { EnumToArray, SortByName, waiter } from '../../shared/utilities/utility.functions';
import * as _ from 'lodash';
import { ATCredential } from '../../shared/models/at.credential';
import { ATStreamType, ATStreamFieldDetailOLD, ATStreamField, ATStream, ATStreamOnDB, atStreamObj2DB } from '../../shared/models/at.stream';
import { ATProcessStepType } from '../../shared/models/at.process';
import { Stream } from 'shared/models/streams.models';

// import { EnumToArray, SortByName } from '../../shared/utilities/utilityFunctions';
// import { ATEnvironmentType } from '../../shared/models/at.environment';
// import { ATEnvironment } from '../../shared/models/at.environment';
// import { ATCredential } from '../../shared/models/at.credential';
// import { ATSetting } from '../../shared/models/at.setting';
// import { ATStreamType } from '../../shared/models/at.stream';
// import { ATProcessStepType } from '../../shared/models/at.process';
// import { ATStream, ATStreamField, ATStreamFieldDetailOLD } from '../../shared/models/at.stream';
// import { ATTuple } from 'shared/models/at.tuple';
// import { FieldInfo } from 'mysql';

interface InitiatorStep { expectedCurrentVersion: number, operatorFunction: any, shouldSetVersion?: boolean }

export class Initiator {
	private utils: InitiatorUtils;
	private tools: MainTools;

	private steps: InitiatorStep[] = [];

	constructor(
		private db: DB,
		private configuration: SystemConfig
	) {
		this.utils = new InitiatorUtils( this.db.pool, this.configuration );
		this.tools = new MainTools( this.db.pool, this.configuration );
		this.prepareSteps();
	}

	private prepareSteps = () => {
		this.steps.push( {
			expectedCurrentVersion: -1,
			operatorFunction: () => this.utils.doWeHaveTable( 'currentversion' ),
			shouldSetVersion: false
		} );
		this.steps.push( {
			expectedCurrentVersion: -1,
			operatorFunction: async ( doWeHaveTable: number ) => {
				if ( doWeHaveTable === 0 ) {
					console.log( 'Do we have table', doWeHaveTable );
					await this.db.query( 'CREATE TABLE currentversion ( version SMALLINT UNSIGNED NULL)' );
				}
				return doWeHaveTable;
			},
			shouldSetVersion: false
		} );
		this.steps.push( {
			expectedCurrentVersion: -1,
			operatorFunction: async ( doWeHaveTable: number ) => {
				if ( doWeHaveTable === 0 ) {
					await this.db.query( 'INSERT INTO currentversion (version) VALUES (0)' );
				}
				return doWeHaveTable;
			},
			shouldSetVersion: false
		} );
		this.steps.push( {
			expectedCurrentVersion: -1,
			operatorFunction: async () => {
				let currentVersion = 0;
				const resultSet = await this.db.query<{ version: number }>( 'SELECT version FROM currentversion' );
				resultSet.tuples.map( tuple => currentVersion = tuple.version );
				return currentVersion;
			},
			shouldSetVersion: true
		} );
		this.steps.push( { expectedCurrentVersion: 0, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.users ) } );
		this.steps.push( { expectedCurrentVersion: 1, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.environmenttypes ) } );
		this.steps.push( { expectedCurrentVersion: 2, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.environments ) } );
		this.steps.push( { expectedCurrentVersion: 3, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.streams ) } );
		this.steps.push( { expectedCurrentVersion: 4, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.streamtypes ) } );
		this.steps.push( { expectedCurrentVersion: 5, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.streamfields ) } );
		this.steps.push( { expectedCurrentVersion: 6, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.streampreprocesses ) } );
		this.steps.push( { expectedCurrentVersion: 7, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.maps ) } );
		this.steps.push( { expectedCurrentVersion: 8, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.maptypes ) } );
		this.steps.push( { expectedCurrentVersion: 9, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.mapfields ) } );
		this.steps.push( { expectedCurrentVersion: 10, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.logs ) } );
		this.steps.push( { expectedCurrentVersion: 11, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.processes ) } );
		this.steps.push( { expectedCurrentVersion: 12, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.processsteps ) } );
		this.steps.push( { expectedCurrentVersion: 13, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.processdefaulttargets ) } );
		this.steps.push( { expectedCurrentVersion: 14, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.processfilters ) } );
		this.steps.push( { expectedCurrentVersion: 15, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.processfiltersdatafile ) } );
		this.steps.push( { expectedCurrentVersion: 16, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.settings ) } );
		this.steps.push( { expectedCurrentVersion: 17, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.ldapservers ) } );
		this.steps.push( { expectedCurrentVersion: 18, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.secrets ) } );
		this.steps.push( { expectedCurrentVersion: 19, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.processsteptypes ) } );
		this.steps.push( { expectedCurrentVersion: 20, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.acmservers ) } );
		this.steps.push( { expectedCurrentVersion: 21, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.matrices ) } );
		this.steps.push( { expectedCurrentVersion: 22, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.matrixfields ) } );
		this.steps.push( { expectedCurrentVersion: 23, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.userdimeprocesses ) } );
		this.steps.push( { expectedCurrentVersion: 24, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.schedules ) } );
		this.steps.push( { expectedCurrentVersion: 25, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.asyncprocesses ) } );
		this.steps.push( { expectedCurrentVersion: 26, operatorFunction: () => this.db.query( 'ALTER TABLE environments MODIFY password VARCHAR(4096)' ) } );
		this.steps.push( { expectedCurrentVersion: 27, operatorFunction: () => this.utils.tableAddColumn( 'streamfields', 'shouldIgnore TINYINT NULL DEFAULT 0 AFTER fOrder' ) } );
		this.steps.push( { expectedCurrentVersion: 28, operatorFunction: () => this.utils.tableAddColumn( 'streamfields', 'shouldIgnoreCrossTab TINYINT NULL DEFAULT 0 AFTER fOrder' ) } );
		this.steps.push( { expectedCurrentVersion: 29, operatorFunction: () => this.utils.tableAddColumn( 'streamfields', 'isCrossTabFilter TINYINT NULL DEFAULT 0 AFTER shouldIgnoreCrossTab' ) } );
		this.steps.push( { expectedCurrentVersion: 30, operatorFunction: () => this.utils.tableAddColumn( 'streamfields', 'generation2members VARCHAR(4096) DEFAULT \'\' AFTER `ddfDateFormat`' ) } );
		this.steps.push( { expectedCurrentVersion: 31, operatorFunction: () => this.utils.tableAddColumn( 'logs', 'reftype VARCHAR(256) NOT NULL AFTER `details`' ) } );
		this.steps.push( { expectedCurrentVersion: 32, operatorFunction: () => this.utils.tableAddColumn( 'processes', 'erroremail VARCHAR(1024) NULL DEFAULT \'\' AFTER `status`' ) } );
		this.steps.push( { expectedCurrentVersion: 33, operatorFunction: () => this.utils.tableAddColumn( 'logs', 'refid BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER details' ) } );
		this.steps.push( { expectedCurrentVersion: 34, operatorFunction: () => this.db.query( 'ALTER TABLE `logs` CHANGE `details` `details` LONGBLOB NULL DEFAULT NULL' ) } );
		this.steps.push( { expectedCurrentVersion: 35, operatorFunction: () => this.db.query( 'ALTER TABLE matrices CHANGE map stream BIGINT UNSIGNED NOT NULL DEFAULT 0' ) } );
		this.steps.push( { expectedCurrentVersion: 36, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.credentials ) } );
		this.steps.push( { expectedCurrentVersion: 37, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.tags ) } );
		this.steps.push( { expectedCurrentVersion: 38, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.taggroups ) } );
		this.steps.push( { expectedCurrentVersion: 39, operatorFunction: () => this.utils.tableAddColumn( 'credentials', 'tags VARCHAR(4096) NULL AFTER password' ) } );
		this.steps.push( { expectedCurrentVersion: 40, operatorFunction: () => this.utils.tableAddColumn( 'environments', 'isconverted TINYINT NOT NULL DEFAULT 0 AFTER password' ) } );
		this.steps.push( {
			expectedCurrentVersion: 41, operatorFunction: async () => {
				const environmentTypeObject = _.keyBy( EnumToArray( ATEnvironmentType ), 'label' );
				const environmentResult = await this.db.query<any>( 'SELECT * FROM environments WHERE isconverted = 0' );
				const environmentList = environmentResult.tuples;
				const typeResult = await this.db.query<any>( 'SELECT * FROM environmenttypes' );
				const typesObject = _.keyBy( typeResult.tuples, 'id' );
				for ( const curEnvironment of environmentList ) {
					curEnvironment.type = environmentTypeObject[typesObject[curEnvironment.type].value].value;
					curEnvironment.isconverted = 1;
					await this.db.query( 'UPDATE environments SET ? WHERE id = ?', [curEnvironment, curEnvironment.id] );
				}
			}
		} );
		this.steps.push( { expectedCurrentVersion: 42, operatorFunction: () => this.db.query( 'ALTER TABLE environments DROP isconverted' ) } );
		this.steps.push( { expectedCurrentVersion: 43, operatorFunction: () => this.utils.tableAddColumn( 'environments', 'tags VARCHAR(4096) NULL AFTER password' ) } );
		this.steps.push( { expectedCurrentVersion: 44, operatorFunction: () => this.utils.tableAddColumn( 'environments', 'identitydomain VARCHAR(128) NULL AFTER verified' ) } );
		this.steps.push( { expectedCurrentVersion: 45, operatorFunction: () => this.db.query( 'DROP TABLE environmenttypes' ) } );
		this.steps.push( { expectedCurrentVersion: 46, operatorFunction: () => this.utils.tableAddColumn( 'environments', 'credential BIGINT UNSIGNED NULL AFTER identitydomain' ) } );
		this.steps.push( {
			expectedCurrentVersion: 47, operatorFunction: async () => {
				const environmentResult = await this.db.query<ATEnvironment>( 'SELECT * FROM environments' );
				const environmentList = environmentResult.tuples;

				for ( const curEnvironment of environmentList ) {

					const credentialToCreate = <ATCredential>{};
					credentialToCreate.name = ( 'FromEnv-' + curEnvironment.id + '-' + curEnvironment.name ).substr( 0, 1000 );
					credentialToCreate.username = ( <any>curEnvironment ).username;
					credentialToCreate.password = this.tools.encryptText( this.tools.decryptTextOLDDONOTUSE( ( <any>curEnvironment ).password ) );
					credentialToCreate.tags = curEnvironment.tags;

					await this.db.query( 'INSERT INTO credentials SET ?', credentialToCreate );
				}
			}
		} );
		this.steps.push( { expectedCurrentVersion: 48, operatorFunction: () => this.db.query( 'ALTER TABLE environments DROP username' ) } );
		this.steps.push( { expectedCurrentVersion: 49, operatorFunction: () => this.db.query( 'ALTER TABLE environments DROP password' ) } );
		this.steps.push( { expectedCurrentVersion: 50, operatorFunction: () => this.utils.tableAddColumn( 'streams', 'tags TEXT NULL AFTER customQuery' ) } );
		this.steps.push( { expectedCurrentVersion: 51, operatorFunction: () => this.db.query( 'ALTER TABLE environments CHANGE tags tags TEXT NULL DEFAULT NULL' ) } );
		this.steps.push( { expectedCurrentVersion: 52, operatorFunction: () => this.db.query( 'ALTER TABLE credentials CHANGE tags tags TEXT NULL DEFAULT NULL' ) } );
		this.steps.push( { expectedCurrentVersion: 53, operatorFunction: () => this.db.query( 'ALTER TABLE streamfields CHANGE fOrder position INT( 10 ) UNSIGNED NULL DEFAULT NULL AFTER type' ) } );
		this.steps.push( { expectedCurrentVersion: 54, operatorFunction: () => this.utils.tableAddColumn( 'environments', 'ssotoken TEXT NULL AFTER credential' ) } );
		this.steps.push( { expectedCurrentVersion: 55, operatorFunction: () => this.db.query( 'ALTER TABLE environments CHANGE ssotoken SID TEXT NULL DEFAULT NULL' ) } );
		this.steps.push( { expectedCurrentVersion: 56, operatorFunction: () => this.utils.tableAddColumn( 'environments', 'cookies TEXT NULL AFTER SID' ) } );
		this.steps.push( { expectedCurrentVersion: 57, operatorFunction: () => this.db.query( 'ALTER TABLE environments DROP SID, DROP cookies' ) } );
		this.steps.push( { expectedCurrentVersion: 58, operatorFunction: () => this.db.query( 'UPDATE processes SET status = 0' ) } );
		this.steps.push( { expectedCurrentVersion: 59, operatorFunction: () => this.db.query( 'ALTER TABLE streamfields DROP shouldIgnore' ) } );
		this.steps.push( { expectedCurrentVersion: 60, operatorFunction: () => this.db.query( 'DROP TABLE matrixfields' ) } );
		this.steps.push( { expectedCurrentVersion: 61, operatorFunction: () => this.utils.tableAddColumn( 'maps', 'tags TEXT NULL AFTER target' ) } );
		this.steps.push( { expectedCurrentVersion: 62, operatorFunction: () => this.utils.tableAddColumn( 'matrices', 'fields TEXT NULL AFTER stream' ) } );
		this.steps.push( { expectedCurrentVersion: 63, operatorFunction: () => this.utils.tableAddColumn( 'matrices', 'tags TEXT NULL AFTER fields' ) } );
		this.steps.push( { expectedCurrentVersion: 64, operatorFunction: () => this.utils.tableAddColumn( 'maps', 'matrix BIGINT UNSIGNED NULL AFTER target' ) } );
		this.steps.push( { expectedCurrentVersion: 65, operatorFunction: () => this.db.query( 'DROP TABLE processsteptypes' ) } );
		this.steps.push( { expectedCurrentVersion: 66, operatorFunction: () => this.db.query( 'ALTER TABLE processsteps CHANGE sOrder position INT( 10 ) UNSIGNED NULL DEFAULT NULL AFTER details' ) } );
		this.steps.push( { expectedCurrentVersion: 67, operatorFunction: () => this.db.query( 'UPDATE processsteps SET type= ? WHERE type = ?', ['transform', 'manipulate'] ) } );
		this.steps.push( { expectedCurrentVersion: 68, operatorFunction: () => this.utils.tableAddColumn( 'processes', 'tags TEXT NULL AFTER erroremail' ) } );
		this.steps.push( { expectedCurrentVersion: 69, operatorFunction: () => this.db.query( 'ALTER TABLE processes CHANGE status status TINYINT NULL DEFAULT 0' ) } );
		this.steps.push( { expectedCurrentVersion: 70, operatorFunction: () => this.utils.tableAddColumn( 'processes', 'currentlog BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER tags' ) } );
		this.steps.push( {
			expectedCurrentVersion: 71, operatorFunction: async () => {
				const queryResult = await this.db.query<any[]>( 'SELECT * FROM settings WHERE name = \'emailserverhost\'' );
				if ( queryResult.tuples.length === 0 ) {
					await this.db.query( 'INSERT INTO settings (name, value) VALUES (\'emailserverhost\', \'\')' );
				}
			}
		} );
		this.steps.push( {
			expectedCurrentVersion: 72, operatorFunction: async () => {
				const queryResult = await this.db.query<any[]>( 'SELECT * FROM settings WHERE name = \'emailserverport\'' );
				if ( queryResult.tuples.length === 0 ) {
					await this.db.query( 'INSERT INTO settings (name, value) VALUES (\'emailserverport\', \'\')' );
				}
			}
		} );
		this.steps.push( {
			expectedCurrentVersion: 73, operatorFunction: async () => {
				const queryResult = await this.db.query<any[]>( 'SELECT * FROM settings WHERE name = \'systemadminemailaddress\'' );
				if ( queryResult.tuples.length === 0 ) {
					await this.db.query( 'INSERT INTO settings (name, value) VALUES (\'systemadminemailaddress\', \'\')' );
				}
			}
		} );
		this.steps.push( {
			expectedCurrentVersion: 74, operatorFunction: async () => {
				const settingResult = await this.db.query<any>( 'SELECT * FROM settings' );
				const newSetting: any = { host: '', port: 25 };
				const rowsToDelete: number[] = [];

				settingResult.tuples.forEach( row => {
					if ( row.name === 'emailserverhost' ) {
						newSetting.host = row.value;
						if ( !newSetting.host ) { newSetting.host = ''; }
						rowsToDelete.push( row.id );
					} else if ( row.name === 'emailserverport' ) {
						newSetting.port = parseInt( row.value, 10 );
						if ( !newSetting.port ) { newSetting.port = 25; }
						rowsToDelete.push( row.id );
					}
				} );
				await this.db.query( 'INSERT INTO settings (name, value) VALUES (?, ?)', ['emailserver', JSON.stringify( newSetting )] );
				await this.db.query( 'DELETE FROM settings WHERE id IN (' + rowsToDelete.join( ', ' ) + ')' );
			}
		} );
		this.steps.push( {
			expectedCurrentVersion: 75, operatorFunction: async () => {
				const settingResult = await this.db.query<any>( 'SELECT * FROM settings' );
				const newSetting: any = { emailaddress: '' };
				const rowsToDelete: number[] = [];

				settingResult.tuples.forEach( row => {
					if ( row.name === 'systemadminemailaddress' ) {
						newSetting.emailaddress = row.value;
						rowsToDelete.push( row.id );
					}
				} );
				await this.db.query( 'INSERT INTO settings (name, value) VALUES (?, ?)', ['systemadmin', JSON.stringify( newSetting )] );
				await this.db.query( 'DELETE FROM settings WHERE id IN (' + rowsToDelete.join( ', ' ) + ')' );
			}
		} );
		this.steps.push( { expectedCurrentVersion: 76, operatorFunction: () => this.db.query( 'ALTER TABLE settings CHANGE value value TEXT NULL DEFAULT NULL' ) } );
		this.steps.push( { expectedCurrentVersion: 77, operatorFunction: () => this.utils.tableAddColumn( 'schedules', 'tags TEXT NULL AFTER status' ) } );
		this.steps.push( { expectedCurrentVersion: 78, operatorFunction: () => this.utils.tableAddColumn( 'streams', 'newtype BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER type' ) } );
		this.steps.push( {
			expectedCurrentVersion: 79, operatorFunction: async () => {
				const streamTypeResult = await this.db.query<any>( 'SELECT * FROM streamtypes' );
				const types = _.keyBy( streamTypeResult.tuples, 'value' );
				await this.db.query( 'UPDATE streams SET newtype = ? WHERE type = ?', [ATStreamType.HPDB, types.HPDB.id] );
				await this.db.query( 'UPDATE streams SET newtype = ? WHERE type = ?', [ATStreamType.RDBT, types.RDBT.id] );
				await this.db.query( 'UPDATE streams SET type = newtype' );
			}
		} );
		this.steps.push( { expectedCurrentVersion: 80, operatorFunction: () => this.db.query( 'ALTER TABLE streams DROP newtype' ) } );
		this.steps.push( { expectedCurrentVersion: 81, operatorFunction: () => this.db.query( 'DROP TABLE streamtypes' ) } );
		this.steps.push( { expectedCurrentVersion: 82, operatorFunction: () => this.db.query( 'UPDATE streamfields SET isDescribed = 1 WHERE stream IN (SELECT id FROM streams WHERE type = ?)', ATStreamType.HPDB ) } );
		this.steps.push( {
			expectedCurrentVersion: 83, operatorFunction: async () => {
				const stepList = await this.db.query<any>( 'SELECT * FROM processsteps WHERE type = ?', ATProcessStepType.TargetProcedure );
				for ( const row of stepList.tuples ) {
					if ( row.details ) {
						row.details = JSON.parse( row.details.toString() );
						if ( row.details.type === 'Rules' ) {
							row.details.type = 'graphical';
							row.details = JSON.stringify( row.details );
							await this.db.query( 'UPDATE processsteps SET details = ? WHERE id = ?', [row.details, row.id] );
						}
					}
				}
			}
		} );
		// Look at the old version of to0085 to fix below
		this.steps.push( { expectedCurrentVersion: 84, operatorFunction: async () => ( true ) } );
		this.steps.push( { expectedCurrentVersion: 85, operatorFunction: () => this.db.query( 'ALTER TABLE processsteps CHANGE details details LONGTEXT NULL DEFAULT NULL' ) } );
		this.steps.push( { expectedCurrentVersion: 86, operatorFunction: () => this.utils.tableAddColumn( 'streams', 'exports TEXT NULL AFTER tags' ) } );
		this.steps.push( { expectedCurrentVersion: 87, operatorFunction: () => this.utils.tableAddColumn( 'users', 'clearance TEXT NULL AFTER surname' ) } );
		this.steps.push( {
			expectedCurrentVersion: 88, operatorFunction: async () => {
				const usersResult = await this.db.query<any>( 'SELECT * FROM users' );
				const users = usersResult.tuples;
				const assignmentsResult = await this.db.query<any>( 'SELECT * FROM userdimeprocesses' );
				const assignments = assignmentsResult.tuples;
				for ( const user of users ) {
					if ( !user.clearance ) user.clearance = {};
					user.clearance.processes = assignments.filter( a => a.user === user.id ).map( a => ( { id: a.process } ) );
					await this.db.query( 'UPDATE users SET clearance = ? WHERE id = ?', [JSON.stringify( user.clearance ), user.id] );
				}
			}
		} );
		this.steps.push( { expectedCurrentVersion: 89, operatorFunction: () => this.db.query( 'DROP TABLE userdimeprocesses' ) } );
		this.steps.push( { expectedCurrentVersion: 90, operatorFunction: async () => ( true ) } );
		this.steps.push( { expectedCurrentVersion: 91, operatorFunction: async () => ( true ) } );
		this.steps.push( { expectedCurrentVersion: 92, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.dbchecker ) } );
		this.steps.push( { expectedCurrentVersion: 93, operatorFunction: () => this.db.query( 'INSERT INTO dbchecker SET ?', ( { lastwrite: ( new Date() ), lastread: ( new Date() ) } ) ) } );
		this.steps.push( { expectedCurrentVersion: 94, operatorFunction: () => this.db.query( 'DROP TABLE ldapservers' ) } );
		this.steps.push( { expectedCurrentVersion: 95, operatorFunction: () => this.utils.tableAddColumn( 'streams', 'fields LONGTEXT NULL DEFAULT NULL AFTER tags' ) } );
		this.steps.push( { expectedCurrentVersion: 96, operatorFunction: () => this.db.query( 'ALTER TABLE streams CHANGE exports exports LONGTEXT NULL DEFAULT NULL' ) } );
		this.steps.push( { expectedCurrentVersion: 97, operatorFunction: () => this.db.query( 'ALTER TABLE streams CHANGE customQuery customQuery LONGTEXT NULL DEFAULT NULL' ) } );
		this.steps.push( { expectedCurrentVersion: 98, operatorFunction: () => this.db.query( 'ALTER TABLE streams CHANGE fields fieldList LONGTEXT NULL DEFAULT NULL' ) } );
		this.steps.push( {
			expectedCurrentVersion: 99, operatorFunction: async () => {
				const { tuples } = await this.db.query<ATStreamOnDB>( 'SELECT * FROM streams' );
				const atStreams: ATStream[] = tuples.map( t => ( t as any ) );

				for ( const atStream of atStreams ) {
					if ( !atStream.exports ) {
						atStream.exports = [];
					} else {
						atStream.exports = JSON.parse( <any>atStream.exports );
					}
					atStream.exports.sort( SortByName );
					if ( !atStream.tags ) {
						atStream.tags = {};
					} else {
						atStream.tags = JSON.parse( atStream.tags );
					}
					if ( atStream.dbName && !atStream.databaseList ) atStream.databaseList = [{ name: atStream.dbName }];
					if ( atStream.tableName && !atStream.tableList ) atStream.tableList = [{ name: atStream.tableName }];
					const { tuples: atFields } = await this.db.query<ATStreamFieldDetailOLD>( 'SELECT * FROM streamfields WHERE stream = ? ORDER BY position', atStream.id );
					const streamFields: ATStreamField[] = atFields.map( sF => { 	// Source Field
						const cF: ATStreamField = {											// Converted Field
							name: sF.name,
							type: sF.type,
							position: sF.position,
							isDescribed: !!sF.isDescribed,
							fCharacters: sF.fCharacters,
							fPrecision: sF.fPrecision,
							fDecimals: sF.fDecimals,
							fDateFormat: sF.fDateFormat,
							shouldIgnoreCrossTab: !!sF.shouldIgnoreCrossTab,
							isFilter: !!sF.isFilter,
							isCrossTabFilter: !!sF.isCrossTabFilter,
							isCrossTab: !!sF.isCrossTab,
							isMonth: !!sF.isMonth,
							isData: !!sF.isData,
							aggregateFunction: sF.aggregateFunction,
							description: {
								database: sF.descriptiveDB,
								table: sF.descriptiveTable,
								query: sF.descriptiveQuery,
								tableList: sF.descriptiveTableList || [],
								fieldList: sF.descriptiveFieldList || [],
								referenceField: {
									name: sF.drfName,
									type: sF.drfType,
									characters: sF.drfCharacters,
									precision: sF.drfPrecision,
									decimals: sF.drfDecimals,
									dateformat: sF.drfDateFormat
								},
								descriptionField: {
									name: sF.ddfName,
									type: sF.ddfType,
									characters: sF.ddfCharacters,
									precision: sF.ddfPrecision,
									decimals: sF.ddfDecimals,
									dateformat: sF.ddfDateFormat
								}
							},
							items: []
						};
						return cF;
					} );
					atStream.fieldList = streamFields;
					await this.db.query( 'UPDATE streams SET fieldList = ? WHERE id = ?', [JSON.stringify( atStream.fieldList ), atStream.id] );
				}
			}, shouldSetVersion: true
		} );
		this.steps.push( { expectedCurrentVersion: 100, operatorFunction: () => this.db.query( 'ALTER TABLE logs MODIFY details LONGTEXT NULL DEFAULT NULL' ) } );
		this.steps.push( { expectedCurrentVersion: 101, operatorFunction: () => this.db.query( 'ALTER TABLE logs MODIFY reftype VARCHAR(256) NULL DEFAULT NULL' ) } );
		this.steps.push( { expectedCurrentVersion: 102, operatorFunction: () => this.db.query( 'ALTER TABLE environments CHANGE type type BIGINT(20) UNSIGNED NOT NULL DEFAULT 0' ) } );
		this.steps.push( { expectedCurrentVersion: 103, operatorFunction: () => this.db.query( 'ALTER TABLE environments CHANGE server server VARCHAR(255) NULL' ) } );
		this.steps.push( { expectedCurrentVersion: 104, operatorFunction: () => this.db.query( 'ALTER TABLE environments CHANGE port port VARCHAR(5) NULL' ) } );
		this.steps.push( { expectedCurrentVersion: 105, operatorFunction: () => this.db.query( 'ALTER TABLE streams ADD details JSON NULL AFTER exports' ) } );
		this.steps.push( {
			expectedCurrentVersion: 106,
			shouldSetVersion: true,
			operatorFunction: async () => {
				const { tuples } = await this.db.query<Stream>( 'SELECT * FROM streams' );
				for ( const tuple of tuples ) {
					await this.db.queryOne( 'UPDATE streams SET details = ? WHERE id = ?', [this.tools.pTW( tuple ).details, tuple.id] );
				}
			}
		} );
		this.steps.push( { expectedCurrentVersion: 107, operatorFunction: () => this.db.query( 'ALTER TABLE streams DROP name, DROP type, DROP environment, DROP dbName' ) } );
		this.steps.push( { expectedCurrentVersion: 108, operatorFunction: () => this.db.query( 'ALTER TABLE streams DROP tableName, DROP customQuery, DROP tags, DROP exports' ) } );
		this.steps.push( { expectedCurrentVersion: 109, operatorFunction: () => this.db.query( 'ALTER TABLE environments ADD details JSON NULL AFTER tags' ) } );
		this.steps.push( { expectedCurrentVersion: 110, operatorFunction: async () => this.jsonizeColumns( 'environments' ) } );
		this.steps.push( { expectedCurrentVersion: 111, operatorFunction: () => this.db.query( 'ALTER TABLE environments DROP name, DROP type, DROP server, DROP port, DROP verified' ) } );
		this.steps.push( { expectedCurrentVersion: 112, operatorFunction: () => this.db.query( 'ALTER TABLE environments DROP identitydomain, DROP credential, DROP tags' ) } );
		this.steps.push( { expectedCurrentVersion: 113, operatorFunction: () => this.utils.checkAndCreateTable( tableDefinitions.artifacts ) } );
	}

	public initiate = async () => {

		console.log( '===============================================' );
		console.log( '=== Initiator is now starting               ===' );
		console.log( '===============================================' );

		this.steps.forEach( s => {
			if ( s.shouldSetVersion !== false ) { s.shouldSetVersion = true; }
		} );

		let stepResult: any = null;
		let currentVersion = await this.findCurrentVersion();


		for ( const step of this.steps ) {
			if ( step.expectedCurrentVersion === currentVersion ) {
				stepResult = await step.operatorFunction( stepResult );
				if ( step.shouldSetVersion ) {
					currentVersion++;
					stepResult = await this.utils.updateToVersion( currentVersion );
				}
			}
		}
		const versionToLog = ( '00000' + currentVersion ).substr( -5 );
		console.log( '===============================================' );
		console.log( '=== Database is now at version ' + versionToLog + '        ===' );
		console.log( '===============================================' );
	}

	public findCurrentVersion = async () => {
		let currentVersion = -1;
		const doWeHaveTable = await this.utils.doWeHaveTable( 'currentversion' );
		if ( doWeHaveTable > 0 ) {
			const resultSet = await this.db.query<{ version: number }>( 'SELECT version FROM currentversion' );
			resultSet.tuples.map( tuple => currentVersion = tuple.version );
		}
		return currentVersion;
	}

	private jsonizeColumns = async ( tableName: string ) => {
		const { tuples } = await this.db.query<any>( 'SELECT * FROM ??', tableName );
		for ( const tuple of tuples ) {
			await this.db.queryOne( 'UPDATE ?? SET details = ? WHERE id = ?', [tableName, this.tools.pTW( tuple ).details, tuple.id] );
		}
	}
}
