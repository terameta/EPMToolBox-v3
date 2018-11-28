import { ReducingAction } from 'src/app/shared/reducingaction.model';
import { FEATURE, TagState } from './tags.state';
import { Tag } from './tag.models';
import * as _ from 'lodash';
import { SortByName } from 'shared/utilities/utility.functions';

export class TagsLoad implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Load';

	constructor( public payload?: Tag[] ) { }

	public reducer = ( state: TagState ): TagState => {
		if ( this.payload ) {
			const newState: TagState = { ...state };
			newState.items = _.keyBy( this.payload, 'id' );
			newState.ids = this.payload.sort( SortByName ).map( t => t.id );
			return newState;
		} else {
			return state;
		}
	}
}
