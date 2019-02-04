import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { filter, combineLatest, map, tap, distinctUntilKeyChanged, distinctUntilChanged } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { StreamExport, StreamExportHPDB, StreamExportHPDBDimensionDefinition, Stream, StreamField, StreamExportHPDBSelectionDefinition, StreamExportHPDBSelectionDefinitionItem } from 'shared/models/streams.models';
import { JSONDeepCopy, SortByPosition } from 'shared/utilities/utility.functions';
import { FEATURE } from '../streams.state';
import { UtilityService } from 'src/app/shared/utility.service';
import { NotificationType } from 'src/app/notification/notification.models';
import { NotificationNew } from 'src/app/notification/notification.actions';
import { v4 as uuid } from 'uuid';
import { RouterGo } from 'src/app/shared/router.actions';
import { Load } from 'src/app/shared/artifacts.actions';
import { ArtifactType, FieldDescriptionList, FieldDescriptionItem } from 'shared/models/artifacts.models';
import { LoadState } from 'shared/models/generic.loadstate';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HpdbMemberSelectorComponent } from 'src/app/shared/hpdb-member-selector/hpdb-member-selector.component';
import * as HPUtilities from 'shared/utilities/hp.utilities';
import { RunExport } from '../streams.actions';
import { ExecutionStatus } from 'shared/models/generic.executionstate';

@Component( {
	selector: 'app-stream-export-detail-hpdb',
	templateUrl: './stream-export-detail-hpdb.component.html',
	styleUrls: ['./stream-export-detail-hpdb.component.scss']
} )
export class StreamExportDetailHpdbComponent implements OnInit, OnDestroy {
	private modalRef: BsModalRef;
	public XState = ExecutionStatus;
	private hpUtilities = HPUtilities;
	public feature = FEATURE;
	public LoadStates = LoadState;
	private saving = false;
	public pageSelections: { [key: string]: string } = {};
	public stream$ = this.store.select( 'streams' ).pipe(
		filter( s => s.loaded ),
		combineLatest( this.store.select( 'shared' ) ),
		map( ( [t, h] ) => <Stream>JSONDeepCopy( t.items[h.currentID] ) ),
		tap( () => this.saving = false )
		// distinctUntilChanged()
	);
	private artifactDispatcher = this.stream$.pipe(
		filter( s => !!s.fieldList ),
		combineLatest( this.store.select( s => s.artifacts.fieldDescriptionLists ) ),
		filter( ( [s, a] ) => ( Object.values( a ).filter( ai => ai.loadState === LoadState.Loading ).length === 0 ) ),
		map( ( [s, a] ) => (
			s.fieldList.
				filter( f => !a[s.id + '_' + f.name] ).
				filter( ( f, fi ) => ( fi === 0 ) ).
				map( f => ( new Load( { stream: s.id, environment: s.environment, field: f.name, type: ArtifactType.FieldDescriptionList } ) ) )
		) ),
		filter( al => al.length > 0 ),
		map( al => al[0] ),
		tap( a => this.store.dispatch( a ) )
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
			if ( !sxp.pags ) sxp.pags = {};
			if ( !sxp.povs ) sxp.povs = {};
			if ( !sxp.rows ) sxp.rows = [{}];
			if ( !sxp.cols ) sxp.cols = [{}];
			if ( !sxp.status ) sxp.status = ExecutionStatus.Ready;
			return sxp;
		} ) );


	constructor( private store: Store<AppState>, public us: UtilityService, private modalService: BsModalService, ) { }

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
		this.saving = true;
		item.exports = item.exports.filter( e => e.id !== sx.id );
		sx.lastUpdate = new Date();
		item.exports.push( sx );
		this.us.update( this.feature, item );
	}

	public execute = async ( item: Stream, sx: StreamExport ) => {
		this.store.dispatch( new RunExport( { id: item.id, exportid: sx.id, selections: this.pageSelections } ) );
	}

	public refreshMembers = async ( stream: Stream, field: StreamField ) => {
		this.store.dispatch( new Load( { stream: stream.id, environment: stream.environment, field: field.name, type: ArtifactType.FieldDescriptionList, forceRefetch: true } ) );
	}

	public openMemberSelector = async ( stream: Stream, field: string, section: StreamExportHPDBSelectionDefinition, isPOV = false ) => {
		this.modalRef = this.modalService.show( HpdbMemberSelectorComponent, {
			class: 'modal-lg',
			initialState: { field, section, stream, isPOV }
		} );
	}

	public representSelection = ( payload: StreamExportHPDBSelectionDefinitionItem ) => {
		if ( payload.function === 'member' ) {
			return payload.selection;
		} else if ( payload.function === 'ichildren' ) {
			return `@IChildren(${ payload.selection })`;
		} else if ( payload.function === 'children' ) {
			return `@Children(${ payload.selection })`;
		} else if ( payload.function === 'descendants' ) {
			return `@Descendants(${ payload.selection })`;
		} else if ( payload.function === 'idescendants' ) {
			return `@IDescendants(${ payload.selection })`;
		} else if ( payload.function === 'level0descendants' ) {
			return `@Level0Descendants(${ payload.selection })`;
		}
	}

	public sectionTupleAdd = ( section: StreamExportHPDBSelectionDefinition[] ) => {
		if ( !section ) {
			section = [];
		} else {
			section.push( JSONDeepCopy( section[section.length - 1] ) );
		}
	}

	public sectionTupleRemove = ( section: StreamExportHPDBSelectionDefinition[], index: number ) => {
		if ( section && section.length > 1 ) { section.splice( index, 1 ); }
	}

	public countMembers = ( memberList: FieldDescriptionItem[], member: StreamExportHPDBSelectionDefinitionItem ) => {
		if ( !this.saving ) member.cellCount = this.hpUtilities.countMembers( memberList, member );
		return member.cellCount;
	}

	public countAll = ( payload: StreamExportHPDB ) => {
		// For the curious mind: We have page definitions, so that the end user can select 1 and only 1 member for each dimension while running the export.
		// So this fact makes it only a single intersection
		// const pagCount = Object.values( payload.pags ).map( c => c.map( ci => ci.cellCount ).reduce( this.add, 0 ) ).reduce( this.multiply, 1 );
		const povCount = Object.values( payload.povs ).map( c => c.map( ci => ci.cellCount ).reduce( this.add, 0 ) ).reduce( this.multiply, 1 );
		if ( povCount !== 1 ) return -1;
		const rowCount = payload.rows.map( r => Object.values( r ).map( c => c.map( ci => ci.cellCount ).reduce( this.add, 0 ) ).reduce( this.multiply, 1 ) ).reduce( this.add, 0 );
		const colCount = payload.cols.map( r => Object.values( r ).map( c => c.map( ci => ci.cellCount ).reduce( this.add, 0 ) ).reduce( this.multiply, 1 ) ).reduce( this.add, 0 );
		return rowCount * colCount;
	}

	public add = ( a: number, b: number ) => a + b;
	public multiply = ( a: number, b: number ) => a * b;

	public findMembers = ( selections: { function: string, selection: string }[], listParent: { list: { RefField: string, Parent: string, Description: string }[] } ): FieldDescriptionItem[] => {
		if ( !listParent ) return null;
		if ( !listParent.list ) return null;
		if ( !selections ) return null;
		if ( !Array.isArray( selections ) ) return null;
		return selections.map( selection => this.hpUtilities.findMembers( listParent.list, selection.function, selection.selection ) ).reduce( ( pv, cv ) => ( [...pv, ...cv] ) );
	}

}
