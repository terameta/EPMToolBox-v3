import { Credential } from './credentials.models';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';

export const FEATURE = '[CREDENTIALS]';

export interface CredentialState {
	items: { [key: number]: Credential },
	ids: number[],
	loaded: boolean
}

const baseState: CredentialState = { items: {}, ids: [], loaded: false };

export const initialState = (): CredentialState => JSONDeepCopy( baseState );
