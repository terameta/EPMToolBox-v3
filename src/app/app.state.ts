import { AuthState } from './auth/auth.state';
import { RouterReducerState } from '@ngrx/router-store';
import { NotificationState } from './notification/notification.state';
import { SharedState } from './shared/shared.state';
import { TagState } from './admin/tags/tags.state';
import { TagGroupState } from './admin/tags/taggroups.state';
import { CredentialState } from './admin/credentials/credentials.state';
import { EnvironmentState } from './admin/environments/environments.state';
import { StreamState } from './admin/streams/streams.state';
import { ArtifactState } from './shared/artifacts.state';

export interface AppState {
	artifacts: ArtifactState,
	auth: AuthState,
	environments: EnvironmentState,
	streams: StreamState,
	credentials: CredentialState,
	notification: NotificationState,
	router: RouterReducerState,
	shared: SharedState,
	tags: TagState,
	taggroups: TagGroupState
}
