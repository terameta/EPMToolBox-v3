import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { filter, combineLatest, map, tap, debounceTime, distinctUntilKeyChanged, distinctUntilChanged, take } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { StreamExport, StreamExportHPDB, StreamExportHPDBDimensionDefinition, Stream } from 'shared/models/streams.models';
import { JSONDeepCopy, SortByPosition } from 'shared/utilities/utility.functions';
import { FEATURE } from '../streams.state';
import { UtilityService } from 'src/app/shared/utility.service';
import { CloneTarget } from 'shared/models/clone.target';
import { NotificationType } from 'src/app/notification/notification.models';
import { NotificationNew } from 'src/app/notification/notification.actions';
import { v4 as uuid } from 'uuid';
import { RouterGo } from 'src/app/shared/router.actions';
import { Load } from 'src/app/shared/artifacts.actions';
import { ArtifactType } from 'shared/models/artifacts.models';
import { from } from 'rxjs';
import { LoadState } from 'shared/models/generic.loadstate';

@Component( {
	selector: 'app-stream-export-detail-hpdb',
	templateUrl: './stream-export-detail-hpdb.component.html',
	styleUrls: ['./stream-export-detail-hpdb.component.scss']
} )
export class StreamExportDetailHpdbComponent implements OnInit, OnDestroy {
	public feature = FEATURE;
	private debouncer = 0;
	public stream$ = this.store.select( 'streams' ).pipe(
		filter( s => s.loaded ),
		combineLatest( this.store.select( 'shared' ) ),
		map( ( [t, h] ) => <Stream>JSONDeepCopy( t.items[h.currentID] ) ),
		distinctUntilKeyChanged( 'id' ),
		// tap( a => console.log( JSON.stringify( a ) ) )
		// combineLatest( this.store.select( 'artifacts' ) ),
		// // tap( s => s.fieldList.forEach( f => this.store.dispatch( new Load( { stream: s.id, environment: s.environment, field: f.name, type: ArtifactType.FieldDescriptionList } ) ) ) )
		// tap( ( [s, a] ) => {
		// 	s.fieldList.forEach( f => {
		// 		this.debouncer += 1000;
		// 		if ( !a.fieldDescriptionLists[s.id + '_' + f.name] || a.fieldDescriptionLists[s.id + '_' + f.name].loadState === LoadState.NotLoaded ) {
		// 			console.log( 'Dispatching', s.id + '_' + f.name, JSON.stringify( a.fieldDescriptionLists ) );
		// 			// this.store.dispatch( new Load( { stream: s.id, environment: s.environment, field: f.name, type: ArtifactType.FieldDescriptionList } ) );
		// 			setTimeout( () => {
		// 				this.store.dispatch( new Load( { stream: s.id, environment: s.environment, field: f.name, type: ArtifactType.FieldDescriptionList } ) );
		// 			}, this.debouncer );
		// 		}
		// 	} );
		// 	console.log( a );
		// } ),
		// map( ( [s, a] ) => s )
	);
	private artifactDispatcher = this.stream$.pipe(
		filter( s => !!s.fieldList ),
		tap( s => console.log( 'We will now dispatch for all' ) ),
		tap( s => s.fieldList.forEach( f => this.store.dispatch( new Load( { stream: s.id, environment: s.environment, field: f.name, type: ArtifactType.FieldDescriptionList } ) ) ) )
	).subscribe();

	public artifacts$ = this.store.select( 'artifacts' ).pipe( map( a => a.fieldDescriptionLists ) );

	public xid$ = this.store.select( 'shared' ).pipe( map( s => s.currentURL.split( '/' ).splice( -1 ).join( '' ) ) );
	public sxport$ = this.stream$.pipe(
		combineLatest( this.xid$ ),
		filter( ( [s, i] ) => ( s.exports && s.exports.filter( e => e.id === i ).length > 0 ) ),
		map( ( [s, i] ) => {
			const sxp = ( JSONDeepCopy( s.exports.filter( e => e.id === i )[0] ) as StreamExportHPDB );
			if ( !sxp.pagDims ) sxp.pagDims = [];
			if ( !sxp.povDims ) sxp.povDims = [];
			if ( !sxp.rowDims ) sxp.rowDims = [];
			if ( !sxp.colDims ) sxp.colDims = [];
			const presentedDims = [...sxp.pagDims.map( d => d.name ), ...sxp.povDims.map( d => d.name ), ...sxp.rowDims.map( d => d.name ), ...sxp.colDims.map( d => d.name )];
			s.fieldList.sort( SortByPosition ).forEach( f => {
				if ( !presentedDims.includes( f.name ) ) sxp.pagDims.push( <StreamExportHPDBDimensionDefinition>{ name: f.name } );
			} );
			sxp.pagDims.forEach( ( d, di ) => d.position = di );
			sxp.povDims.forEach( ( d, di ) => d.position = di );
			sxp.rowDims.forEach( ( d, di ) => d.position = di );
			sxp.colDims.forEach( ( d, di ) => d.position = di );
			return sxp;
		} ) );


	constructor( private store: Store<AppState>, public us: UtilityService ) { }

	ngOnInit() { }

	ngOnDestroy() { this.artifactDispatcher.unsubscribe(); this.artifactDispatcher = null; }

	public dimensionDrop = ( event: CdkDragDrop<StreamExportHPDBDimensionDefinition[]> ) => {
		if ( event.previousContainer === event.container ) {
			moveItemInArray( event.container.data, event.previousIndex, event.currentIndex );
			event.container.data.forEach( ( d, di ) => d.position = di );
		} else {
			transferArrayItem( event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex );
			event.container.data.forEach( ( d, di ) => d.position = di );
			event.previousContainer.data.forEach( ( d, di ) => d.position = di );
		}
	}

	public clone = async ( item: Stream, sx: StreamExport ) => {
		const newName = await this.us.prompt( 'What is the new item\'s name?', sx.name );
		if ( newName ) {
			const newExport = { ...sx, id: uuid(), name: newName };
			item.exports.push( newExport );
			this.us.update( this.feature, item );
			this.store.dispatch( new RouterGo( { path: ['admin', 'streams', item.id, 'exports', newExport.id] } ) );
		} else {
			this.store.dispatch( new NotificationNew( { title: 'Clone Cancelled', message: 'No action is taken', type: NotificationType.Info } ) );
		}
	}

	public delete = async ( item: Stream, sx: StreamExport ) => {
		if ( await this.us.confirm( 'Are you sure you want to delete ' + sx.name || 'Export' ) ) {
			item.exports = item.exports.filter( e => e.id !== sx.id );
			this.us.update( this.feature, item );
			this.store.dispatch( new RouterGo( { path: ['admin', 'streams', item.id, 'exports', 0] } ) );
		} else {
			this.store.dispatch( new NotificationNew( { title: 'Delete Cancelled', message: 'No action is taken', type: NotificationType.Info } ) );
		}
	}

	public update = async ( item: Stream, sx: StreamExport ) => {
		item.exports = item.exports.filter( e => e.id !== sx.id );
		item.exports.push( sx );
		this.us.update( this.feature, item );
	}

}
