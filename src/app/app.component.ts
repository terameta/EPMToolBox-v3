import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from './notification/notification.service';
import { Store, select } from '@ngrx/store';
import { AppState } from './app.state';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationState } from './notification/notification.state';
import { NotificationType } from './notification/notification.models';
import { NotificationDismissWithUUID } from './notification/notification.actions';
import { SharedService } from './shared/shared.service';
import { waiter } from 'shared/utilities/utility.functions';

@Component( {
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
} )
export class AppComponent implements OnInit {
	public nState: NotificationState = null;
	@ViewChild( 'notificationModal' ) notificationModal: ModalDirective;
	public notificationCount = 0;
	public modalSizeClass: string;

	constructor(
		private notificationService: NotificationService,
		private sharedService: SharedService,
		private store: Store<AppState>
	) { }

	ngOnInit() {
		this.store.pipe( select( 'notification' ) ).subscribe( this.handleNotifications );
	}

	private handleNotifications = ( ns: NotificationState ) => {
		this.nState = ns;
		this.notificationCount = this.nState.notifications.filter( n => ( n.type === NotificationType.BlockingProgress || n.type === NotificationType.FatalError ) ).length;
		this.modalSizeClass = '';
		if ( this.notificationCount < 2 ) this.modalSizeClass = 'modal-sm';
		if ( this.notificationCount > 2 ) this.modalSizeClass = 'modal-lg';
	}

	public onNotificationHide = () => {
		console.log( 'onNotificationHide is called' );
		this.nState.notifications.filter( n => ( n.type === NotificationType.BlockingProgress || n.type === NotificationType.FatalError ) ).forEach( async ( n, ni ) => {
			await waiter( ni * 100 );
			this.store.dispatch( new NotificationDismissWithUUID( n.uuid ) );
		} );
	}
}
