import { TagGroup } from './taggroup.models';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';

export const FEATURE = '[TAGGROUPS]';

export interface TagGroupState {
	items: { [key: number]: TagGroup },
	ids: number[],
	loaded: boolean
}

const baseState: TagGroupState = { items: {}, ids: [], loaded: false };

export const initialState = (): TagGroupState => JSONDeepCopy( baseState );
