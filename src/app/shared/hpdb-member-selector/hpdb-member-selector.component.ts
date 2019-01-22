import { Component, OnInit, Input } from '@angular/core';
import { StreamExportHPDBSelectionDefinition, Stream, StreamExportHPDBSelectionDefinitionItem } from 'shared/models/streams.models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Load } from '../artifacts.actions';
import { ArtifactType } from 'shared/models/artifacts.models';
import { tap } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';

@Component( {
	selector: 'app-hpdb-member-selector',
	templateUrl: './hpdb-member-selector.component.html',
	styleUrls: ['./hpdb-member-selector.component.scss']
} )
export class HpdbMemberSelectorComponent implements OnInit {
	@Input() field = '';
	@Input() section: StreamExportHPDBSelectionDefinition = null;
	@Input() stream: Stream = null;

	public selections: string[] = [];
	public tempSection: StreamExportHPDBSelectionDefinitionItem[] = [];

	public artifacts$ = this.store.select( s => s.artifacts.fieldDescriptionLists[this.stream.id + '_' + this.field] ).pipe(
		tap( s => {
			if ( !s ) this.refreshArtifact();
		} ),
		// tap( s => { if ( !this.section[this.field] ) this.section[this.field] = []; } )
	);

	constructor( private store: Store<AppState>, public modalRef: BsModalRef ) { }

	ngOnInit() {
		if ( this.section && this.field ) this.tempSection = JSONDeepCopy( this.section[this.field] || [] );
	}

	public refreshArtifact = async ( forceRefetch = false ) => {
		this.store.dispatch( new Load( { stream: this.stream.id, environment: this.stream.environment, field: this.field, type: ArtifactType.FieldDescriptionList, forceRefetch } ) );
	}

	public addToSelections = async ( payload: string ) => {
		if ( !this.selections.find( s => s === payload ) ) this.selections.push( payload );
	}

	public isSelected = ( payload: string ) => ( !!this.selections.find( s => s === payload ) );

	public addToSection = async ( payload: 'member' | 'children' | 'ichildren' | 'descendants' | 'idescendants' | 'level0descendants' ) => {
		// this.section[this.field] = [...( this.section[this.field] || [] ), ...this.selections.map( s => ( { function: payload, selection: s } ) )];
		this.tempSection = [...( this.tempSection || [] ), ...this.selections.map( s => ( { function: payload, selection: s } ) )];
		this.selections = [];
	}

	public removeFromSection = async ( payload: StreamExportHPDBSelectionDefinitionItem ) => {
		this.tempSection.splice( this.tempSection.findIndex( s => s.function === payload.function && s.selection === payload.selection ), 1 );
	}

	public ok = () => {
		this.section[this.field] = JSONDeepCopy( this.tempSection );
		this.modalRef.hide();
	}

	public cancel = () => {
		this.modalRef.hide();
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

}
