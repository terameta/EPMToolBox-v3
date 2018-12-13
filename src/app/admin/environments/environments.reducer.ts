import { EnvironmentState, initialState, FEATURE } from './environments.state';
import { ReducingAction } from '../../shared/reducingaction.model';

export function environmentReducer( state: EnvironmentState = initialState(), action: ReducingAction ) {
	// console.log( 'We are here' );
	return action.feature === FEATURE && typeof action.reducer === 'function' ? action.reducer( state ) : state;
}
