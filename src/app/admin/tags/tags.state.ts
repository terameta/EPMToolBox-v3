import { Tag } from './tag.models';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';

export const FEATURE = '[TAGS]';

export interface TagState {
	items: { [key: number]: Tag }
}

export const initialTagState = (): TagState => JSONDeepCopy( {} );
