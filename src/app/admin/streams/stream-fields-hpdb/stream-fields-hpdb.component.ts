import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UtilityService } from 'src/app/shared/utility.service';
import { FEATURE } from '../streams.state';
import { map, distinctUntilChanged, combineLatest, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Stream } from 'shared/models/streams.models';
import { JSONDeepCopy, SortByPosition } from 'shared/utilities/utility.functions';
import { NgForm } from '@angular/forms';
import { FieldsRefresh } from '../../environments/environments.actions';

@Component( {
	selector: 'app-stream-fields-hpdb',
	templateUrl: './stream-fields-hpdb.component.html',
	styleUrls: ['./stream-fields-hpdb.component.scss']
} )
export class StreamFieldsHpdbComponent implements OnInit {
	public feature = FEATURE;
	public id$ = this.store.select( 'shared' ).pipe( map( s => s.currentID ), distinctUntilChanged() );
	public item$: Observable<Stream> = this.store.select( 'streams' ).pipe(
		combineLatest( this.id$ ),
		filter( ( [s, id] ) => !!id && s.loaded && !!s.items[id] ),
		map( ( [s, id] ) => JSONDeepCopy( s.items[id] ) ),
	);

	constructor( private store: Store<AppState>, public us: UtilityService ) { }

	ngOnInit() { }

	public startOver = async ( s: Stream, f: NgForm ) => {
		const result = await this.us.confirm( 'Are you sure you want to start over?' );
		if ( result ) {
			s.fieldList = [];
			this.us.update( this.feature, s, f );
		}
	}

	public fieldMove = ( item: Stream, index: number, direction: number ) => {
		item.fieldList.forEach( ( field, fieldIndex ) => {
			field.position = field.position * 10 + ( fieldIndex === index ? direction * 11 : 0 );
		} );
		item.fieldList.sort( SortByPosition );
		item.fieldList.forEach( ( field, fieldIndex ) => {
			field.position = fieldIndex + 1;
		} );
	}


	public refreshFields = ( s: Stream ) => this.store.dispatch( new FieldsRefresh( { environment: s.environment, stream: s.id } ) );

}
