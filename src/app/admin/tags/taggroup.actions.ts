import { ReducingAction } from 'src/app/shared/reducingaction.model';
import { FEATURE, TagGroupState } from './taggroups.state';
import { TagGroup } from './taggroup.models';
import { keyBy } from 'lodash';
import { SortByName } from 'shared/utilities/utility.functions';

export class TagGroupsLoad implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Load';

	constructor( public payload?: TagGroup[] ) { }

	public reducer = ( state: TagGroupState ): TagGroupState => {
		if ( this.payload ) {
			return { ...state, items: keyBy( this.payload, 'id' ), ids: this.payload.sort( SortByName ).map( t => t.id ), loaded: true };
		} else {
			return state;
		}
	}
}
