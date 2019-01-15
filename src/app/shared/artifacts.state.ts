import { DatabaseList, TableList, DescriptiveFieldList } from 'shared/models/artifacts.models';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';

export const FEATURE = '[ARTIFACTS]';

export interface ArtifactState {
	databaseLists: { [key: number]: DatabaseList },
	tableLists: { [key: string]: TableList },
	descriptiveFieldLists: { [key: string]: DescriptiveFieldList }
}

const baseState: ArtifactState = {
	databaseLists: {},
	tableLists: {},
	descriptiveFieldLists: {}
};

export const initialState = (): ArtifactState => JSONDeepCopy( baseState );
