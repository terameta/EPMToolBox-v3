import { Component, OnInit, Input } from '@angular/core';
import { Notification, NotificationType } from '../notification.models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { NotificationDismissWithUUID } from '../notification.actions';

@Component( {
	selector: 'app-modal-notification',
	templateUrl: './modal-notification.component.html',
	styleUrls: ['./modal-notification.component.scss']
} )
export class ModalNotificationComponent implements OnInit {
	@Input() notification: Notification;
	public assignedClass: string;
	public notificationType = NotificationType;

	constructor( private store: Store<AppState> ) { }

	ngOnInit() {
		this.assignedClass = '';
		if ( this.notification.type === NotificationType.FatalError ) this.assignedClass = 'bg-danger';
		if ( this.notification.type === NotificationType.BlockingProgress ) this.assignedClass = 'bg-accent';
	}

	public dismiss = () => {
		this.store.dispatch( new NotificationDismissWithUUID( this.notification.uuid ) );
	}

}
