import { CredentialState, initialState, FEATURE } from './credentials.state';
import { ReducingAction } from 'src/app/shared/reducingaction.model';

export function credentialReducer( state: CredentialState = initialState(), action: ReducingAction ) {
	return action.feature === FEATURE && typeof action.reducer === 'function' ? action.reducer( state ) : state;
}
