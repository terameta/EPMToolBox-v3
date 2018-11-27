import { ReducingAction } from './reducingaction.model';
import { FEATURE, Interest } from './shared.state';

export class DataChange implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Data Change';

	constructor( public payload: Interest ) { }
}
