import { TagState, FEATURE, initialTagState } from './tags.state';
import { ReducingAction } from 'src/app/shared/reducingaction.model';

export function tagReducer( state: TagState = initialTagState(), action: ReducingAction ) {
	return action.feature === FEATURE && typeof action.reducer === 'function' ? action.reducer( state ) : state;
}
