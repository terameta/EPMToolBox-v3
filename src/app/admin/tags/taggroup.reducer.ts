import { TagGroupState, initialState, FEATURE } from './taggroups.state';
import { ReducingAction } from 'src/app/shared/reducingaction.model';

export function tagGroupReducer( state: TagGroupState = initialState(), action: ReducingAction ) {
	return action.feature === FEATURE && typeof action.reducer === 'function' ? action.reducer( state ) : state;
}
