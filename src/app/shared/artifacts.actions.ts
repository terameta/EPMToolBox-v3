import { ReducingAction } from './reducingaction.model';
import { FEATURE, ArtifactState } from './artifacts.state';
import { ArtifactQuery, Artifact, ArtifactType, DatabaseList, TableList, DescriptiveFieldList, FieldDescriptionList } from 'shared/models/artifacts.models';
import { LoadState } from 'shared/models/generic.loadstate';

export class Load implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Load';

	constructor( public payload: ArtifactQuery ) { if ( !payload.retryCount ) payload.retryCount = 1; }

	public reducer = ( state: ArtifactState ): ArtifactState => {

		if ( this.payload.type === ArtifactType.DatabaseList ) {
			return { ...state, databaseLists: { ...state.databaseLists, [this.payload.environment]: <DatabaseList>{ loadState: LoadState.Loading } } };
		}
		if ( this.payload.type === ArtifactType.TableList ) {
			return { ...state, tableLists: { ...state.tableLists, [this.payload.environment + '_' + this.payload.database]: <TableList>{ loadState: LoadState.Loading } } };
		}
		if ( this.payload.type === ArtifactType.DescriptiveFieldList ) {
			return { ...state, descriptiveFieldLists: { ...state.descriptiveFieldLists, [this.payload.stream + '_' + this.payload.field]: <DescriptiveFieldList>{ loadState: LoadState.Loading } } };
		}
		if ( this.payload.type === ArtifactType.FieldDescriptionList ) {
			return { ...state, fieldDescriptionLists: { ...state.fieldDescriptionLists, [this.payload.stream + '_' + this.payload.field]: <FieldDescriptionList>{ loadState: LoadState.Loading } } };
		}
		return state;
	}
}

export class LoadComplete implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Load Complete';

	constructor( public payload: Artifact ) { }

	public reducer = ( state: ArtifactState ): ArtifactState => {

		if ( this.payload.type === ArtifactType.DatabaseList ) {
			const artifact = { ...( this.payload as DatabaseList ), loadState: LoadState.Loaded };
			return { ...state, ...{ databaseLists: { ...state.databaseLists, [artifact.environment]: artifact } } };
		}
		if ( this.payload.type === ArtifactType.TableList ) {
			const artifact = { ...( this.payload as TableList ), loadState: LoadState.Loaded };
			return { ...state, ...{ tableLists: { ...state.tableLists, [artifact.environment + '_' + artifact.database]: artifact } } };
		}
		if ( this.payload.type === ArtifactType.DescriptiveFieldList ) {
			const artifact = { ...( this.payload as DescriptiveFieldList ), loadState: LoadState.Loaded };
			return { ...state, ...{ descriptiveFieldLists: { ...state.descriptiveFieldLists, [artifact.stream + '_' + artifact.field]: artifact } } };
		}
		if ( this.payload.type === ArtifactType.FieldDescriptionList ) {
			const artifact = { ...( this.payload as FieldDescriptionList ), loadState: LoadState.Loaded };
			return { ...state, ...{ fieldDescriptionLists: { ...state.fieldDescriptionLists, [artifact.stream + '_' + artifact.field]: artifact } } };
		}
		return state;
	}
}
