import { Component, OnInit } from '@angular/core';
import { EnumToArray, JSONDeepCopy, SortByName } from 'shared/utilities/utility.functions';
import { StreamType, getTypeDescription, Stream } from 'shared/models/streams.models';
import { FEATURE } from '../streams.state';
import { map, distinctUntilChanged, filter, combineLatest, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UtilityService } from 'src/app/shared/utility.service';
import { DatabasesRefresh, TablesRefresh } from '../../environments/environments.actions';
import { Observable, BehaviorSubject } from 'rxjs';
import { EnvironmentDetail } from 'shared/models/environments.models';
import { NgForm } from '@angular/forms';

@Component( {
	selector: 'app-stream-definitions',
	templateUrl: './stream-definitions.component.html',
	styleUrls: ['./stream-definitions.component.scss']
} )
export class StreamDefinitionsComponent {
	public types = EnumToArray( StreamType );
	public typeDescription = getTypeDescription;
	public streamTypes = StreamType;
	public feature = FEATURE;
	public id$ = this.store.select( 'shared' ).pipe( map( s => s.currentID ), distinctUntilChanged() );
	public item$: Observable<Stream> = this.store.select( 'streams' ).pipe(
		tap( e => this.environmentChanged$.next( false ) ),
		tap( e => this.databaseChanged$.next( false ) ),
		combineLatest( this.id$ ),
		filter( ( [s, id] ) => !!id && s.loaded && !!s.items[id] ),
		map( ( [s, id] ) => JSONDeepCopy( s.items[id] ) ),
	);
	public environments$ = this.store.select( 'environments' ).pipe( map( s => s.ids.map( id => s.items[id] ) ) );
	public environment$ = this.store.select( 'environments' ).pipe(
		combineLatest( this.item$ ),
		map( ( [e, s] ) => e.items[s.environment] )
	);
	public databases$ = this.environment$.pipe(
		map( e => <EnvironmentDetail>e ),
		map( e => Object.values( e.databases ).sort( SortByName ) )
	);
	public database$ = this.environment$.pipe(
		map( e => <EnvironmentDetail>e ),
		combineLatest( this.item$ ),
		map( ( [e, s] ) => e.databases[s.dbName] )
	);

	public environmentChanged$ = new BehaviorSubject( false );
	public databaseChanged$ = new BehaviorSubject( false );

	constructor( private store: Store<AppState>, public us: UtilityService ) { }

	public refreshDatabases = ( eid: number ) => this.store.dispatch( new DatabasesRefresh( eid ) );
	public refreshTables = ( eid: number, dbName: string ) => this.store.dispatch( new TablesRefresh( { environment: eid, database: dbName } ) );
	public codeCustomQuery = async ( item: Stream, f: NgForm ) => {
		let result = await this.us.coder( item.customQuery, { language: 'sql' }, 'Custom Query for ' + item.name );
		if ( result !== false && result !== true ) {
			result = result.trim();
			if ( result.split( '' ).pop() === ';' ) result = result.substring( 0, result.length - 1 );
			if ( item.customQuery !== result ) {
				item.customQuery = result;
				this.us.update( this.feature, item, f );
			}
		}
	}
}
