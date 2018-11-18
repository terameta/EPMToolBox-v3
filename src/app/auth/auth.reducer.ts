import { AuthState, authInitialState, FEATURE } from './auth.state';
import { ReducingAction } from '../shared/reducingaction.model';

export function authReducer( state: AuthState = authInitialState, action: ReducingAction ) {
	return action.feature === FEATURE ? action.reducer( state ) : state;
}
