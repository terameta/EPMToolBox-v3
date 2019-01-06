import { Stream } from 'shared/models/streams.models';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';

export const FEATURE = '[STREAMS]';

export interface StreamState {
	items: { [key: number]: Stream },
	ids: number[],
	loaded: boolean
}

const baseState: StreamState = { items: {}, ids: [], loaded: false };

export const initialState = (): StreamState => JSONDeepCopy( baseState );
