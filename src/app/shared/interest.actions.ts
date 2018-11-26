import { ReducingAction } from './reducingaction.model';
import { FEATURE, SharedState, Interest } from './shared.state';

export class InterestShow implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Interest Show';

	constructor( public payload: Interest ) { }

	public reducer = ( state: SharedState ): SharedState => {
		const newState: SharedState = { ...state };
		if ( !newState.interests.includes( this.payload ) ) {
			newState.interests.push( this.payload );
			return newState;
		} else {
			return state;
		}
	}
}

export class InterestShowAll implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Interest Show All';

	constructor() { }
}

export class InterestLose implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Interest Lose';

	constructor( public payload: Interest ) { }

	public reducer = ( state: SharedState ): SharedState => {
		const newState: SharedState = { ...state };
		if ( newState.interests.includes( this.payload ) ) {
			newState.interests = newState.interests.filter( i => i !== this.payload );
			return newState;
		} else {
			return state;
		}
	}
}

export class InterestLoseAll implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Interest Lose All';

	constructor() { }
}
