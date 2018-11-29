import { AppState } from '../app.state';
import { createSelector } from '@ngrx/store';
import { SharedState } from './shared.state';

export const selectSharedState = ( state: AppState ) => state.shared;

export const getAutoShowNotifications = createSelector(
	selectSharedState,
	( state: SharedState ) => state.autoShowNotifications
);

export const getAutoShowNotificationsOnlyError = createSelector(
	selectSharedState,
	( state: SharedState ) => state.autoShowNotificationsOnlyError
);

export const getAutoShowNotificationsAndOnlyError = createSelector(
	selectSharedState,
	( state: SharedState ) => ( {
		autoShow: state.autoShowNotifications,
		isOnlyError: state.autoShowNotificationsOnlyError
	} )
);
