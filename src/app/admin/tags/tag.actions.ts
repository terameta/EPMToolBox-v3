import { ReducingAction } from 'src/app/shared/reducingaction.model';
import { FEATURE, TagState } from './tags.state';
import { Tag } from './tag.models';
import { keyBy } from 'lodash';
import { SortByName, JSONDeepCopy } from 'shared/utilities/utility.functions';

export class Load implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Load';

	constructor( public payload?: Tag[] ) { }

	public reducer = ( state: TagState ): TagState => {
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

	constructor( public payload: Tag ) { }
}

export class Update implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Update';

	constructor( public payload: Tag ) { }
}

export class Delete implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Delete';

	constructor( public payload: Tag ) { }
}
