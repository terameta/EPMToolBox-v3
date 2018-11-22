import { ReducingAction } from '../shared/reducingaction.model';
import { FEATURE, NotificationState } from './notification.state';
import { getBaseNotification, NotificationType } from './notification.models';

export class NotificationNewInfo implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'New Info';

	constructor( public payload: { title: string, message: string } ) { }

	public reducer = ( state: NotificationState ): NotificationState => {
		const newState: NotificationState = { ...state };
		newState.notifications.push( { ...getBaseNotification(), ...this.payload, ...{ type: NotificationType.Info } } );
		return newState;
	}
}

export class NotificationNewProgress implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'New Progress';

	constructor( public payload: { title: string, message: string } ) { }

	public reducer = ( state: NotificationState ): NotificationState => {
		const newState: NotificationState = { ...state };
		newState.notifications.push( { ...getBaseNotification(), ...this.payload, ...{ type: NotificationType.Progress } } );
		return newState;
	}
}

export class NotificationNewBlockingProgress implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'New Blocking Progress';

	constructor( public payload: { title: string, message: string } ) { }

	public reducer = ( state: NotificationState ): NotificationState => {
		const newState: NotificationState = { ...state };
		newState.notifications.push( { ...getBaseNotification(), ...this.payload, ...{ type: NotificationType.BlockingProgress } } );
		return newState;
	}
}

export class NotificationNewWarning implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'New Warning';

	constructor( public payload: { title: string, message: string } ) { }

	public reducer = ( state: NotificationState ): NotificationState => {
		const newState: NotificationState = { ...state };
		newState.notifications.push( { ...getBaseNotification(), ...this.payload, ...{ type: NotificationType.Warning } } );
		return newState;
	}
}

export class NotificationNewError implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'New Warning';

	constructor( public payload: Error ) { }

	public reducer = ( state: NotificationState ): NotificationState => {
		const newState: NotificationState = { ...state };
		newState.notifications.push( { ...getBaseNotification(), ...{ title: this.payload.name, message: this.payload.message }, ...{ type: NotificationType.Error } } );
		return newState;
	}
}

export class NotificationNewFatalError implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'New Warning';

	constructor( public payload: Error ) { }

	public reducer = ( state: NotificationState ): NotificationState => {
		console.log( 'We received a new fatal error' );
		console.log( this.payload );
		const newState: NotificationState = { ...state };
		newState.notifications.push( { ...getBaseNotification(), ...this.payload, ...{ type: NotificationType.FatalError } } );
		return newState;
	}
}

export class NotificationDismissWithTitle implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Dismiss with Title';

	constructor( public payload: string ) { console.log( 'NotificationDismissWithTitle constructed' ); }

	public reducer = ( state: NotificationState ): NotificationState => {
		console.log( 'NotificationDismissWithTitle reducing' );
		const newState: NotificationState = { ...state };
		newState.notifications = newState.notifications.filter( n => n.title !== this.payload );
		console.log( 'NotificationDismissWithTitle reduced' );
		return newState;
	}
}

