import { JSONDeepCopy } from 'shared/utilities/utility.functions';

export const FEATURE = '[SHARED]';

export interface SharedState {
	interests: Interest[],
	selectedTags: any
}

export const initialSharedState = (): SharedState => {
	return JSONDeepCopy( { interests: [], selectedTags: {} } );
};

export type Interest = 'environments' | 'streams' | 'maps' | 'matrices' | 'schedules' | 'processes' | 'asyncbr' | 'settings' | 'secrets' | 'credentials' | 'tags' | 'users';
