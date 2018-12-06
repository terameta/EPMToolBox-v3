import { ReducingAction } from 'src/app/shared/reducingaction.model';
import { FEATURE, TagState } from './tags.state';
import { Tag } from './tag.models';
import { keyBy } from 'lodash';
import { SortByName } from 'shared/utilities/utility.functions';

export class TagsLoad implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Load';

	constructor( public payload?: Tag[] ) { }

	public reducer = ( state: TagState ): TagState => {
		if ( this.payload ) {
			return { ...state, items: keyBy( this.payload, 'id' ), ids: this.payload.sort( SortByName ).map( t => t.id ), loaded: true };
		} else {
			return state;
		}
	}
}
