import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { filter, combineLatest, map } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { StreamExport, StreamExportHPDB } from 'shared/models/streams.models';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';

@Component( {
	selector: 'app-stream-export-detail-hpdb',
	templateUrl: './stream-export-detail-hpdb.component.html',
	styleUrls: ['./stream-export-detail-hpdb.component.scss']
} )
export class StreamExportDetailHpdbComponent implements OnInit, OnDestroy {
	public stream$ = this.store.select( 'streams' ).pipe(
		filter( s => s.loaded ),
		combineLatest( this.store.select( 'shared' ) ),
		map( ( [t, h] ) => t.items[h.currentID] )
	);

	public xid$ = this.store.select( 'shared' ).pipe( map( s => s.currentURL.split( '/' ).splice( -1 ).join( '' ) ) );
	public sxport$ = this.stream$.pipe( combineLatest( this.xid$ ), map( ( [s, i] ) => ( s.exports.filter( e => e.id === i )[0] ) ) );

	public sxport: StreamExportHPDB;
	private sub = this.sxport$.subscribe( e => {
		this.sxport = JSONDeepCopy( e ) as StreamExportHPDB;
		if ( !this.sxport.povDims ) { this.sxport.povDims = []; }
	} );

	constructor( private store: Store<AppState> ) { }

	ngOnInit() { }

	ngOnDestroy() { this.sub.unsubscribe(); this.sub = null; }

}
