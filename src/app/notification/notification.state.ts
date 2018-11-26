import { Notification } from './notification.models';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';

export const FEATURE = '[NOTIFICATION]';

export interface NotificationState {
	notifications: Notification[]
}

export const initialNotificationState = (): NotificationState => {
	return JSONDeepCopy( { notifications: [] } );
};
