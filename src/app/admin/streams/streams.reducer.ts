import { StreamState, initialState, FEATURE } from './streams.state';
import { ReducingAction } from 'src/app/shared/reducingaction.model';

export function streamReducer( state: StreamState = initialState(), action: ReducingAction ) {
	return action.feature === FEATURE && typeof action.reducer === 'function' ? action.reducer( state ) : state;
}
