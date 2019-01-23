import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { filter, combineLatest, map } from 'rxjs/operators';
import { Stream, StreamExport } from 'shared/models/streams.models';
import { UtilityService } from 'src/app/shared/utility.service';
import { JSONDeepCopy, SortByName } from 'shared/utilities/utility.functions';
import { v4 as uuid } from 'uuid';
import { Update } from '../streams.actions';
import { RouterGo } from 'src/app/shared/router.actions';

@Component( {
	selector: 'app-stream-export-list',
	templateUrl: './stream-export-list.component.html',
	styleUrls: ['./stream-export-list.component.scss']
} )
export class StreamExportListComponent implements OnInit {
	public item$ = this.store.select( 'streams' ).pipe(
		filter( s => s.loaded ),
		combineLatest( this.store.select( 'shared' ) ),
		map( ( [t, h] ) => t.items[h.currentID] )
	);

	constructor( private store: Store<AppState>, private us: UtilityService ) { }

	ngOnInit() { }

	public create = async ( s: Stream ) => {
		const name = await this.us.prompt( 'Please name the new export', 'New Export' );
		if ( name ) {
			const target: Stream = JSONDeepCopy( s );
			const newExport: StreamExport = { id: uuid(), name, lastUpdate: new Date() };
			if ( !Array.isArray( target.exports ) ) {
				target.exports = [];
			}
			target.exports.push( newExport );
			target.exports.sort( SortByName );
			this.store.dispatch( new Update( target ) );
			this.store.dispatch( new RouterGo( { path: ['admin', 'streams', s.id, 'exports', newExport.id] } ) );
		}
	}

	public delete = async ( s: Stream, ce: StreamExport ) => {
		if ( await this.us.confirm( 'Are you sure you want to delete ' + ce.name || 'the export?' ) ) {
			const target: Stream = JSONDeepCopy( s );
			target.exports = target.exports.filter( e => e.id !== ce.id );
			this.store.dispatch( new Update( target ) );
			this.store.dispatch( new RouterGo( { path: ['admin', 'streams', s.id, 'exports', 0] } ) );
		}
	}

}
