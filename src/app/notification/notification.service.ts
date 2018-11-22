import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { NotificationState } from './notification.state';

@Injectable( {
	providedIn: 'root'
} )
export class NotificationService {

	constructor( private store: Store<AppState> ) {
		console.log( 'Notification service constructed' );
		this.store.pipe( select( 'notification' ) ).subscribe( this.handleNotifications );
	}

	private handleNotifications = ( state: NotificationState ) => {
		console.log( state );
	}
}
