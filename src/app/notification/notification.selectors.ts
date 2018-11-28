import { AppState } from '../app.state';
import { createSelector } from '@ngrx/store';
import { NotificationState } from './notification.state';

export const selectNotifications = ( state: AppState ) => state.notification;

export const getNotifications = createSelector(
	selectNotifications,
	( state: NotificationState ) => state.notifications
);
