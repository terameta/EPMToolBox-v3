import { Environment } from 'shared/models/environments.models';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';

export const FEATURE = '[ENVIRONMENTS]';

export interface EnvironmentState {
	items: { [key: number]: Environment },
	ids: number[],
	loaded: boolean
}

const baseState: EnvironmentState = { items: {}, ids: [], loaded: false };

export const initialState = (): EnvironmentState => JSONDeepCopy( baseState );
