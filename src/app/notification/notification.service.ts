import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { NotificationState } from './notification.state';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Injectable( {
	providedIn: 'root'
} )
export class NotificationService {
	private modalRef: BsModalRef = null;

	constructor(
		private store: Store<AppState>,
		private modalService: BsModalService
	) {
		console.log( 'Notification service constructed because it is referred to in the app.component.ts, maybe we do not need this' );
		this.store.select( 'notification' ).subscribe( this.handleNotifications );
	}

	private handleNotifications = ( state: NotificationState ) => {
	}
}
