import { ReducingAction } from 'src/app/shared/reducingaction.model';
import { FEATURE, TagState } from './tags.state';
import { Tag } from './tag.models';
import * as _ from 'lodash';

export class TagsLoad implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Load';

	constructor() { }
}

export class TagsLoadComplete implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Load Complete';

	constructor( public payload: Tag[] ) { }

	public reducer = ( state: TagState ): TagState => {
		console.log( 'We are at tags load complete' );
		console.log( this.payload );
		const newState: TagState = { ...state };
		newState.items = _.keyBy( this.payload, 'id' );
		return newState;
	}
}
