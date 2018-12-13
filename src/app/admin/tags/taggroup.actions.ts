import { ReducingAction } from 'src/app/shared/reducingaction.model';
import { FEATURE, TagGroupState as State } from './taggroups.state';
import { TagGroup } from './taggroup.models';
import { keyBy } from 'lodash';
import { SortByPosition } from 'shared/utilities/utility.functions';
import { CloneTarget } from 'shared/models/clone.target';

export class Load implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Load';

	constructor( public payload?: TagGroup[] ) { }

	public reducer = ( state: State ): State => {
		if ( this.payload ) {
			return { ...state, items: keyBy( this.payload, 'id' ), ids: this.payload.sort( SortByPosition ).map( t => t.id ), loaded: true };
		} else {
			return state;
		}
	}
}

export class Create implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Create';

	constructor( public payload: TagGroup ) { }

}

export class Clone implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Clone';

	constructor( public payload: CloneTarget ) { }

}

export class Update implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Update';

	constructor( public payload: TagGroup ) { }
}

export class Delete implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Delete';

	constructor( public payload: TagGroup ) { }
}
