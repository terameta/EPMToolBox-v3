import { authReducer } from './auth/auth.reducer';
import { routerReducer } from '@ngrx/router-store';
import { notificationReducer } from './notification/notification.reducer';
import { sharedReducer } from './shared/shared.reducer';

export const AppReducer = {
	auth: authReducer,
	notification: notificationReducer,
	router: routerReducer,
	shared: sharedReducer
};
