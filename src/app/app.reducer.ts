import { authReducer } from './auth/auth.reducer';
import { routerReducer } from '@ngrx/router-store';
import { notificationReducer } from './notification/notification.reducer';
import { sharedReducer } from './shared/shared.reducer';
import { tagReducer } from './admin/tags/tag.reducer';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { AppState } from './app.state';
import { environment } from 'src/environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';
import { tagGroupReducer } from './admin/tags/taggroup.reducer';
import { credentialReducer } from './admin/credentials/credentials.reducer';
import { environmentReducer } from './admin/environments/environments.reducer';

export const AppReducer: ActionReducerMap<AppState> = {
	auth: authReducer,
	credentials: credentialReducer,
	environments: environmentReducer,
	notification: notificationReducer,
	router: routerReducer,
	shared: sharedReducer,
	tags: tagReducer,
	taggroups: tagGroupReducer
};

export const AppMetaReducer: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];
