import { Component, OnInit } from '@angular/core';
import { FEATURE } from '../streams.state';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UtilityService } from 'src/app/shared/utility.service';
import { map, distinctUntilChanged, combineLatest, filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Stream, StreamFieldDescription } from 'shared/models/streams.models';
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
		tap( ( i: Stream ) => i.fieldList.forEach( f => f.description = f.description || <StreamFieldDescription>{} ) )
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

	constructor( private store: Store<AppState>, public us: UtilityService ) { }

	ngOnInit() {
	}

	public save = ( f: string, i: Stream, o: NgForm ) => {
		this.us.update( f, i, o );
	}

	public refreshDatabases = ( eid: number ) => this.store.dispatch( new Load( { environment: eid, type: ArtifactType.DatabaseList } ) );
	public refreshTables = ( eid: number, dbName: string ) => this.store.dispatch( new Load( { environment: eid, database: dbName, type: ArtifactType.TableList } ) );

}
