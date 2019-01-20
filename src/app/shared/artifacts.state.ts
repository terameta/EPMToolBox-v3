import { DatabaseList, TableList, DescriptiveFieldList, FieldDescriptionList } from 'shared/models/artifacts.models';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';

export const FEATURE = '[ARTIFACTS]';

export interface ArtifactState {
	databaseLists: { [key: number]: DatabaseList },
	tableLists: { [key: string]: TableList },
	descriptiveFieldLists: { [key: string]: DescriptiveFieldList },
	fieldDescriptionLists: { [key: string]: FieldDescriptionList },
}

const baseState: ArtifactState = {
	databaseLists: {},
	tableLists: {},
	descriptiveFieldLists: {},
	fieldDescriptionLists: {}
};

export const initialState = (): ArtifactState => JSONDeepCopy( baseState );
