import { authReducer } from './auth/auth.reducer';
import { routerReducer } from '@ngrx/router-store';

export const AppReducer = {
	auth: authReducer,
	router: routerReducer
};
