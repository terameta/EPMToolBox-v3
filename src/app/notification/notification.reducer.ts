import { NotificationState, initialNotificationState, FEATURE } from './notification.state';
import { ReducingAction } from '../shared/reducingaction.model';

export function notificationReducer( state: NotificationState = initialNotificationState(), action: ReducingAction ) {
	return action.feature === FEATURE && typeof action.reducer === 'function' ? action.reducer( state ) : state;
}
