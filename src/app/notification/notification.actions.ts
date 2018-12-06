import { ReducingAction } from '../shared/reducingaction.model';
import { FEATURE, NotificationState as NS } from './notification.state';
import { getBaseNotification, NotificationType as NT } from './notification.models';
import { actionType2Title } from 'shared/utilities/utility.functions';

export class NotificationNew implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'New';

	constructor( public payload: { title: string, message: string, type: NT } ) {
		this.payload.title = actionType2Title( this.payload.title );
		this.payload = { ...getBaseNotification(), ...this.payload };
	}

	public reducer = ( state: NS ): NS => ( {
		...state,
		notifications: [
			...state.notifications,
			{ ...getBaseNotification(), ...this.payload, countDown: ( this.payload.type === NT.Info || this.payload.type === NT.Success ) ? 10 : null }
		]
	} )
}

export class NotificationCountDown implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Count Down';

	constructor( public payload: string ) { }

	public reducer = ( state: NS ): NS => ( { ...state, notifications: [...state.notifications.map( n => ( n.uuid === this.payload ? { ...n, countDown: n.countDown - 1 } : n ) )] } );
}

export class NotificationDismissWithTitle implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Dismiss with Title';

	constructor( public payload: string ) { }

	public reducer = ( state: NS ): NS => ( { ...state, notifications: [...state.notifications.filter( n => n.title !== actionType2Title( this.payload ) )] } );
}

export class NotificationDismissWithUUID implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Dismiss with UUID';

	constructor( public payload: string ) { }

	public reducer = ( state: NS ): NS => ( { ...state, notifications: [...state.notifications.filter( n => n.uuid !== this.payload )] } );
}

export class NotificationShowDetail implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Show Details';

	constructor( public payload: string ) { }

	public reducer = ( state: NS ): NS => {
		const newState: NS = { ...state };
		newState.notifications = state.notifications.map( n => {
			const nn = { ...n };
			if ( nn.uuid === this.payload ) { nn.show = true; }
			return nn;
		} );
		newState.notifications = state.notifications.map( n => ( { ...n, show: n.uuid === this.payload } ) );
		return newState;
	}
}

