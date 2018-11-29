import { ReducingAction } from './reducingaction.model';
import { FEATURE, Interest, SharedState } from './shared.state';

export class DataChange implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Data Change';

	constructor( public payload: Interest ) { }
}

export class AutoShowNotificationsToggle implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Auto Show Notifications Change';

	constructor() { }

	public reducer = ( state: SharedState ): SharedState => {
		const newState: SharedState = { ...state };
		newState.autoShowNotifications = !newState.autoShowNotifications;
		localStorage.setItem( 'autoShowNotifications', JSON.stringify( newState.autoShowNotifications ) );
		return newState;
	}
}

export class AutoShowNotificationsOnlyErrorToggle implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Auto Show Notifications Only Error Change';

	constructor() { }

	public reducer = ( state: SharedState ): SharedState => {
		const newState: SharedState = { ...state };
		newState.autoShowNotificationsOnlyError = !newState.autoShowNotificationsOnlyError;
		localStorage.setItem( 'autoShowNotificationsOnlyError', JSON.stringify( newState.autoShowNotificationsOnlyError ) );
		return newState;
	}
}

export class DoNothing implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Do Nothing';

	constructor() { }
}
