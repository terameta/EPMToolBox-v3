import { ReducingAction } from 'src/app/shared/reducingaction.model';
import { FEATURE, StreamState } from './streams.state';
import { Stream } from 'shared/models/streams.models';
import { keyBy } from 'lodash';
import { JSONDeepCopy, SortByName } from 'shared/utilities/utility.functions';
import { CloneTarget } from 'shared/models/clone.target';

export class Load implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Load';

	constructor( public payload?: Stream[] ) { }

	public reducer = ( state: StreamState ): StreamState => {
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

	constructor( public payload: Stream ) { }
}

export class Clone implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Clone';

	constructor( public payload: CloneTarget ) { }
}

export class Update implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Update';

	constructor( public payload: Stream ) { }
}

export class Delete implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Delete';

	constructor( public payload: Stream ) { }
}

export class RunExport implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Run Export';

	constructor( public payload: { id: number, exportid: string, selections: { [key: string]: string } } ) { }
}
