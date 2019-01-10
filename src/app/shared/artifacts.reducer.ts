import { ArtifactState, initialState, FEATURE } from './artifacts.state';
import { ReducingAction } from 'src/app/shared/reducingaction.model';

export function artifactReducer( state: ArtifactState = initialState(), action: ReducingAction ) {
	return action.feature === FEATURE && typeof action.reducer === 'function' ? action.reducer( state ) : state;
}
