import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { filter, map, combineLatest, distinctUntilChanged, tap } from 'rxjs/operators';
import { RouterGo } from 'src/app/shared/router.actions';
import { NgForm } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { UtilityService } from 'src/app/shared/utility.service';
import { Stream, StreamExport } from 'shared/models/streams.models';
import { JSONDeepCopy, SortByName } from 'shared/utilities/utility.functions';
import { Update } from '../streams.actions';

@Component( {
	selector: 'app-stream-exports',
	templateUrl: './stream-exports.component.html',
	styleUrls: ['./stream-exports.component.scss']
} )
export class StreamExportsComponent implements OnInit {
	public item$ = this.store.select( 'streams' ).pipe(
		filter( s => s.loaded ),
		combineLatest( this.store.select( 'shared' ) ),
		map( ( [t, h] ) => t.items[h.currentID] )
	);
	public id$ = this.store.select( 'shared' ).pipe( map( s => s.currentURL ), distinctUntilChanged(), map( u => u.split( '/' ).splice( 5, 1 ).join( '' ) ) );

	constructor( private store: Store<AppState>, public us: UtilityService ) { }

	ngOnInit() { }

	public goToExport = ( $event: any, streamid: number, f: NgForm ) => {
		this.store.dispatch( new RouterGo( { path: ['admin', 'streams', streamid, 'exports', $event.target.value || 0] } ) );
		f.form.markAsPristine();
	}

	public create = async ( s: Stream ) => {
		const name = await this.us.prompt( 'Please name the new export', 'New Export' );
		if ( name ) {
			const target: Stream = JSONDeepCopy( s );
			const newExport: StreamExport = { id: uuid(), name };
			if ( !Array.isArray( target.exports ) ) {
				target.exports = [];
			}
			target.exports.push( newExport );
			target.exports.sort( SortByName );
			this.store.dispatch( new Update( target ) );
			this.store.dispatch( new RouterGo( { path: ['admin', 'streams', s.id, 'exports', newExport.id] } ) );
		}
	}

}
