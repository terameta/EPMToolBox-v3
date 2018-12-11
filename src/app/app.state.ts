import { AuthState } from './auth/auth.state';
import { RouterReducerState } from '@ngrx/router-store';
import { NotificationState } from './notification/notification.state';
import { SharedState } from './shared/shared.state';
import { TagState } from './admin/tags/tags.state';
import { TagGroupState } from './admin/tags/taggroups.state';
import { CredentialState } from './admin/credentials/credentials.state';

export interface AppState {
	auth: AuthState,
	credentials: CredentialState,
	notification: NotificationState,
	router: RouterReducerState,
	shared: SharedState,
	tags: TagState,
	taggroups: TagGroupState
}
