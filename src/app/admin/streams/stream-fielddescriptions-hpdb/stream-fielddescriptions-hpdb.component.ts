import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UtilityService } from 'src/app/shared/utility.service';
import { FEATURE } from '../streams.state';
import { map, distinctUntilChanged, combineLatest, filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Stream, StreamField, StreamFieldDescription } from 'shared/models/streams.models';
import { JSONDeepCopy, SortByPosition } from 'shared/utilities/utility.functions';
import { NgForm } from '@angular/forms';
import { FieldsRefresh, DescriptiveTablesRefresh } from '../../environments/environments.actions';
import { EnvironmentDetail } from 'shared/models/environments.models';

@Component( {
	selector: 'app-stream-fielddescriptions-hpdb',
	templateUrl: './stream-fielddescriptions-hpdb.component.html',
	styleUrls: ['./stream-fielddescriptions-hpdb.component.scss']
} )
export class StreamFielddescriptionsHpdbComponent implements OnInit {
	public feature = FEATURE;
	public id$ = this.store.select( 'shared' ).pipe( map( s => s.currentID ), distinctUntilChanged() );
	public fieldName$ = this.store.select( 'shared' ).pipe( map( s => s.currentURL.split( '/' ).pop() ), distinctUntilChanged() );
	public item$: Observable<Stream> = this.store.select( 'streams' ).pipe(
		combineLatest( this.id$ ),
		filter( ( [s, id] ) => !!id && s.loaded && !!s.items[id] ),
		map( ( [s, id] ) => JSONDeepCopy( s.items[id] ) ),
		tap( ( i: Stream ) => i.fieldList.forEach( f => f.description = f.description || <StreamFieldDescription>{} ) )
	);
	public environment$ = this.store.select( 'environments' ).pipe(
		combineLatest( this.item$ ),
		map( ( [e, i] ) => e.items[i.environment] ),
		map( e => ( e as EnvironmentDetail ) )
	);

	constructor( private store: Store<AppState>, public us: UtilityService ) { }

	ngOnInit() { }

	public refreshAliasTables = ( i: Stream ) => {
		this.store.dispatch( new DescriptiveTablesRefresh( { environment: i.environment, database: i.dbName, table: i.tableName } ) );
	}

	public setToAllFields = ( i: Stream, t: string, fo: NgForm ) => {
		i.fieldList.filter( f => f.isDescribed ).forEach( f => f.description.table = t );
		this.us.update( this.feature, i, fo );
	}

	public save = ( f: string, i: Stream, o: NgForm ) => {
		this.us.update( f, i, o );
	}

}
