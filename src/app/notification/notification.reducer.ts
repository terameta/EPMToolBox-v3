import { NotificationState, notificationInitialState, FEATURE } from './notification.state';
import { ReducingAction } from '../shared/reducingaction.model';

export function notificationReducer( state: NotificationState = notificationInitialState(), action: ReducingAction ) {
	return action.feature === FEATURE && typeof action.reducer === 'function' ? action.reducer( state ) : state;
}
