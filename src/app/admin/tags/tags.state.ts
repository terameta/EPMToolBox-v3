import { Tag } from './tag.models';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';

export const FEATURE = '[TAGS]';

export interface TagState {
	items: { [key: number]: Tag },
	ids: number[],
	loaded: boolean
}

const baseState: TagState = { items: {}, ids: [], loaded: false };

export const initialTagState = (): TagState => JSONDeepCopy( baseState );
