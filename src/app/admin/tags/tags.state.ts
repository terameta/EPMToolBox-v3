import { Tag } from './tag.models';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';

export const FEATURE = '[TAGS]';

export interface TagState {
	items: { [key: number]: Tag },
	ids: number[]
}

const baseTagState: TagState = { items: {}, ids: [] };

export const initialTagState = (): TagState => JSONDeepCopy( baseTagState );
