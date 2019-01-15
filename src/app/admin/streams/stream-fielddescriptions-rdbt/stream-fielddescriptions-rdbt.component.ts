import { Component, OnInit } from '@angular/core';
import { FEATURE } from '../streams.state';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UtilityService } from 'src/app/shared/utility.service';
import { map, distinctUntilChanged, combineLatest, filter, tap, distinctUntilKeyChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Stream, StreamFieldDescription, StreamField } from 'shared/models/streams.models';
import { JSONDeepCopy, SortByName } from 'shared/utilities/utility.functions';
import { NgForm } from '@angular/forms';
import { Load } from 'src/app/shared/artifacts.actions';
import { ArtifactType } from 'shared/models/artifacts.models';
import { LoadState } from 'shared/models/generic.loadstate';

@Component( {
	selector: 'app-stream-fielddescriptions-rdbt',
	templateUrl: './stream-fielddescriptions-rdbt.component.html',
	styleUrls: ['./stream-fielddescriptions-rdbt.component.scss']
} )
export class StreamFielddescriptionsRdbtComponent implements OnInit {
	public feature = FEATURE;
	public loadStates = LoadState;
	public id$ = this.store.select( 'shared' ).pipe( map( s => s.currentID ), distinctUntilChanged() );
	public fieldName$ = this.store.select( 'shared' ).pipe( map( s => s.currentURL.split( '/' ).pop() ), distinctUntilChanged() );
	public item$: Observable<Stream> = this.store.select( 'streams' ).pipe(
		combineLatest( this.id$ ),
		filter( ( [s, id] ) => !!id && s.loaded && !!s.items[id] ),
		map( ( [s, id] ) => JSONDeepCopy( s.items[id] ) ),
		tap( ( i: Stream ) => i.fieldList.forEach( f => f.description = f.description || <StreamFieldDescription>{} ) ),
		tap( ( i: Stream ) => i.fieldList.forEach( f => f.description.referenceField = f.description.referenceField || <any>{} ) ),
		tap( ( i: Stream ) => i.fieldList.forEach( f => f.description.descriptionField = f.description.descriptionField || <any>{} ) )
	);
	public databases$ = this.store.select( 'artifacts' ).pipe(
		combineLatest( this.item$ ),
		distinctUntilChanged(),
		filter( ( [a, i] ) => ( !!i.environment ) ),
		tap( ( [a, i] ) => {
			if ( !a.databaseLists[i.environment] || a.databaseLists[i.environment].loadState === LoadState.NotLoaded ) {
				this.store.dispatch( new Load( { environment: i.environment, type: ArtifactType.DatabaseList } ) );
			}
		} ),
		map( ( [a, i] ) => ( a.databaseLists[i.environment] ) ),
		filter( a => !!a )
	);
	public tables$ = this.store.select( 'artifacts' ).pipe(
		combineLatest( this.item$ ),
		distinctUntilChanged(),
		filter( ( [a, i] ) => ( !!i.environment ) ),
		filter( ( [a, i] ) => ( !!i.dbName ) ),
		tap( ( [a, i] ) => {
			if ( !a.tableLists[i.environment + '_' + i.dbName] || a.tableLists[i.environment + '_' + i.dbName].loadState === LoadState.NotLoaded ) {
				this.store.dispatch( new Load( { environment: i.environment, database: i.dbName, type: ArtifactType.TableList } ) );
			}
		} ),
		map( ( [a, i] ) => ( a.tableLists[i.environment + '_' + i.dbName] ) ),
		filter( a => !!a )
	);
	public descriptiveFields$ = this.store.select( 'artifacts' ).pipe(
		combineLatest( this.item$, this.fieldName$ ),
		distinctUntilChanged(),
		filter( ( [a, i, f] ) => ( !!f ) ),
		map( ( [a, i, f] ) => ( { artifacts: a, item: i, field: i.fieldList.filter( fl => fl.name === f )[0] } ) ),
		tap( ( pl ) => {
			if ( !pl.artifacts.descriptiveFieldLists[pl.item.id + '_' + pl.field.name] && pl.field && pl.field.description && pl.field.description.table ) {
				let shouldDispatch = true;
				if ( pl.field.description.table === 'Custom Query' ) {
					if ( !pl.field.description.query ) {
						shouldDispatch = false;
					} else if ( pl.field.description.query.trim() === '' ) {
						shouldDispatch = false;
					}
				}
				if ( shouldDispatch ) {
					this.store.dispatch( new Load( {
						environment: pl.item.environment, stream: pl.item.id, field: pl.field.name, type: ArtifactType.DescriptiveFieldList, forceRefetch: false
					} ) );
				}
			}
		} ),
		map( ( pl ) => ( pl.artifacts.descriptiveFieldLists[pl.item.id + '_' + pl.field.name] ) ),
		filter( f => !!f ),
		filter( f => f.loadState === LoadState.Loaded ),
		map( f => f.list )
	);

	constructor( private store: Store<AppState>, public us: UtilityService ) { }

	ngOnInit() {
	}

	public save = ( f: string, i: Stream, o: NgForm ) => {
		this.us.update( f, i, o );
	}

	public refreshDatabases = ( eid: number, force = false ) => this.store.dispatch( new Load( { environment: eid, type: ArtifactType.DatabaseList, forceRefetch: force } ) );
	public refreshTables = ( eid: number, dbName: string, force = false ) => this.store.dispatch( new Load( { environment: eid, database: dbName, type: ArtifactType.TableList, forceRefetch: force } ) );
	public refreshFields = ( stream: Stream, field: string, force = false ) => this.store.dispatch( new Load( {
		environment: stream.environment, stream: stream.id, field, type: ArtifactType.DescriptiveFieldList, forceRefetch: force
	} ) )
	public codeCustomQuery = async ( item: Stream, field: StreamField, f: NgForm ) => {
		let result = await this.us.coder( field.description.query, { language: 'sql' }, 'Custom Query for ' + item.name + ' > ' + field.name );
		if ( result !== false && result !== true ) {
			result = result.trim();
			if ( result.split( '' ).pop() === ';' ) result = result.substring( 0, result.length - 1 );
			if ( field.description.query !== result ) {
				field.description.query = result;
				this.us.update( this.feature, item, f );
			}
		}
	}
	public setFieldType = ( which: 'ref' | 'des', field: StreamField, descriptiveFields: any[] ) => {
		const cField = which === 'ref' ? field.description.referenceField : field.description.descriptionField;
		cField.type = descriptiveFields.find( f => f.name === cField.name ).type;
		delete cField.characters;
		delete cField.dateformat;
		delete cField.precision;
		delete cField.decimals;
	}
}
