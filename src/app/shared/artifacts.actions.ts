import { ReducingAction } from './reducingaction.model';
import { FEATURE, ArtifactState } from './artifacts.state';
import { ArtifactQuery, Artifact, ArtifactType, DatabaseList, TableList } from 'shared/models/artifacts.models';
import { LoadState } from 'shared/models/generic.loadstate';

export class Load implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Load';

	constructor( public payload: ArtifactQuery ) { }

	public reducer = ( state: ArtifactState ): ArtifactState => {

		if ( this.payload.type === ArtifactType.DatabaseList ) {
			return { ...state, databaseLists: { ...state.databaseLists, [this.payload.environment]: <DatabaseList>{ loadState: LoadState.Loading } } };
		}
		if ( this.payload.type === ArtifactType.TableList ) {
			return { ...state, tableLists: { ...state.tableLists, [this.payload.environment + '_' + this.payload.database]: <TableList>{ loadState: LoadState.Loading } } };
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

		return state;
	}
}
