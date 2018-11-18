import { AuthState } from './auth/auth.state';
import { RouterState } from '@angular/router';

export interface AppState {
	auth: AuthState,
	router: RouterState
}
