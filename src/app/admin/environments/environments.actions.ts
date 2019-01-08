import { ReducingAction } from 'src/app/shared/reducingaction.model';
import { FEATURE, EnvironmentState } from './environments.state';
import { Environment } from 'shared/models/environments.models';
import { keyBy } from 'lodash';
import { JSONDeepCopy, SortByName } from 'shared/utilities/utility.functions';
import { CloneTarget } from 'shared/models/clone.target';

export class Load implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Load';

	constructor( public payload?: Environment[] ) { }

	public reducer = ( state: EnvironmentState ): EnvironmentState => {
		if ( this.payload ) {
			return { ...state, items: keyBy( this.payload, 'id' ), ids: JSONDeepCopy( this.payload ).sort( SortByName ).map( t => t.id ), loaded: true };
		} else {
			return state;
		}
	}
}

export class Create implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Create';

	constructor( public payload: Environment ) { }
}

export class Clone implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Clone';

	constructor( public payload: CloneTarget ) { }
}

export class Update implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Update';

	constructor( public payload: Environment ) { }
}

export class Delete implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Delete';

	constructor( public payload: Environment ) { }
}

export class Verify implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Verify';

	constructor( public payload: Environment ) { }
}

export class DatabasesRefresh implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Databases Refresh';

	constructor( public payload: number ) { }
}

export class TablesRefresh implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Tables Refresh';

	constructor( public payload: { environment: number, database: string } ) { }
}

export class FieldsRefresh implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Fields Refresh';

	constructor( public payload: { environment: number, stream: number } ) { }
}
