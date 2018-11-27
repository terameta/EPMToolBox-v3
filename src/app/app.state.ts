import { AuthState } from './auth/auth.state';
import { RouterReducerState } from '@ngrx/router-store';
import { NotificationState } from './notification/notification.state';
import { SharedState } from './shared/shared.state';
import { TagState } from './admin/tags/tags.state';

export interface AppState {
	auth: AuthState,
	notification: NotificationState,
	router: RouterReducerState,
	shared: SharedState,
	tags: TagState
}
