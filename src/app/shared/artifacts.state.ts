import { DatabaseList, TableList } from 'shared/models/artifacts.models';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';

export const FEATURE = '[ARTIFACTS]';

export interface ArtifactState {
	databaseLists: { [key: number]: DatabaseList },
	tableLists: { [key: string]: TableList }
}

const baseState: ArtifactState = {
	databaseLists: {},
	tableLists: {}
};

export const initialState = (): ArtifactState => JSONDeepCopy( baseState );
