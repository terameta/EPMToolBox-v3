import { SharedState, initialSharedState, FEATURE } from './shared.state';
import { ReducingAction } from './reducingaction.model';

export function sharedReducer( state: SharedState = initialSharedState(), action: ReducingAction ) {
	return action.feature === FEATURE && typeof action.reducer === 'function' ? action.reducer( state ) : state;
}
