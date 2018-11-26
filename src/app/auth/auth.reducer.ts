import { AuthState, initialAuthState, FEATURE } from './auth.state';
import { ReducingAction } from '../shared/reducingaction.model';

export function authReducer( state: AuthState = initialAuthState(), action: ReducingAction ) {
	return action.feature === FEATURE && typeof action.reducer === 'function' ? action.reducer( state ) : state;
}
