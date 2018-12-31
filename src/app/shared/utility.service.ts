import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmComponent } from './confirm/confirm.component';
import { PromptComponent } from './prompt/prompt.component';

import * as TagActions from '../admin/tags/tag.actions';
import { FEATURE as TagFeature } from '../admin/tags/tags.state';
import * as TagGroupActions from '../admin/tags/taggroup.actions';
import { FEATURE as TagGroupFeature } from '../admin/tags/taggroups.state';
import * as CredentialActions from '../admin/credentials/credentials.actions';
import { FEATURE as CredentialFeature } from '../admin/credentials/credentials.state';
import * as EnvironmentActions from '../admin/environments/environments.actions';
import { FEATURE as EnvironmentFeature } from '../admin/environments/environments.state';
import { NotificationNew } from '../notification/notification.actions';
import { NotificationType } from '../notification/notification.models';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, filter, tap } from 'rxjs/operators';
import { actionType2Title } from 'shared/utilities/utility.functions';
import { CloneTarget } from 'shared/models/clone.target';

@Injectable( {
	providedIn: 'root'
} )
export class UtilityService {
	private dispatcher: { [key: string]: any } = {};

	constructor(
		private store: Store<AppState>,
		private modalService: BsModalService
	) {
		this.dispatcher[TagFeature] = TagActions;
		this.dispatcher[TagGroupFeature] = TagGroupActions;
		this.dispatcher[CredentialFeature] = CredentialActions;
		this.dispatcher[EnvironmentFeature] = EnvironmentActions;
	}

	public confirm = ( question: string, okonly = false ): Promise<boolean> => {
		const modalRef: BsModalRef = this.modalService.show( ConfirmComponent, { initialState: { question, okonly } } );
		return new Promise( ( resolve, reject ) => {
			modalRef.content.onClose.subscribe( resolve, reject );
		} );
	}

	public prompt = ( question: string, defaultValue = '' ): Promise<string> => {
		const modalRef: BsModalRef = this.modalService.show( PromptComponent, { initialState: { question, defaultValue } } );
		return new Promise( ( resolve, reject ) => {
			modalRef.content.onClose.subscribe( resolve, reject );
		} );
	}

	public clone = async ( feature: string, item: { id: number, name: string } ) => {
		const newName = await this.prompt( 'What is the new item\'s name?', item.name );
		const target: CloneTarget = { sourceid: item.id, name: newName };
		if ( newName ) {
			this.store.dispatch( new this.dispatcher[feature].Clone( target ) );
		} else {
			this.store.dispatch( new NotificationNew( { title: 'Clone Cancelled', message: 'No action is taken', type: NotificationType.Info } ) );
		}
	}

	public create = async ( feature: string, item?: Partial<{ name: string }>, forceAskName = false ) => {
		if ( !item ) item = {};
		if ( !item.name || forceAskName ) item.name = await this.prompt( 'What is the new item\'s name?', item.name );
		if ( item.name ) {
			this.store.dispatch( new this.dispatcher[feature].Create( { ...item } ) );
		} else {
			this.store.dispatch( new NotificationNew( { title: 'Item Creation Cancelled', message: 'No action is taken', type: NotificationType.Info } ) );
		}
	}

	public update = async ( feature: string, item: any, form?: NgForm ) => {
		console.log( 'Update request received at US', feature, item, form );
		const stopper = new Subject<boolean>();
		const action = new this.dispatcher[feature].Update( item );
		this.store.select( 'notification' ).pipe(
			takeUntil( stopper ),
			filter( s => s.notifications.filter( n => n.title === actionType2Title( action.type ) ).length > 0 ),
			filter( s => s.notifications.filter( n => n.type === NotificationType.Success ).length > 0 ),
			tap( () => { if ( form ) form.form.markAsPristine(); } ),
			tap( () => { stopper.next( true ); } )
		).subscribe();
		this.store.dispatch( action );
	}

	public positionMove = async ( feature: string, item: { position: number }, direction: 1 | -1 ) => {
		this.update( feature, { ...item, position: item.position + direction * 11 } );
	}

	public delete = async ( feature: string, item: any ) => {
		if ( await this.confirm( 'Are you sure you want to delete ' + item.name || item.id + '?' ) ) {
			this.store.dispatch( new this.dispatcher[feature].Delete( item ) );
		} else {
			this.store.dispatch( new NotificationNew( { title: 'Delete Cancelled', message: 'No action is taken', type: NotificationType.Info } ) );
		}
	}
}
