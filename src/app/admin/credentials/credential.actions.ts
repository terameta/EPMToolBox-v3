import { ReducingAction } from 'src/app/shared/reducingaction.model';
import { FEATURE, CredentialState } from './credentials.state';
import { Credential } from './credential.models';
import { keyBy } from 'lodash';
import { JSONDeepCopy, SortByName } from 'shared/utilities/utility.functions';

export class Load implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Load';

	constructor( public payload?: Credential[] ) { }

	public reducer = ( state: CredentialState ): CredentialState => {
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

	constructor( public payload: Credential ) { }
}

export class Update implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Update';

	constructor( public payload: Credential ) { }
}

export class Delete implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Delete';

	constructor( public payload: Credential ) { }
}

export class Reveal implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Reveal';

	constructor( public payload: Credential ) { }

	public reducer = ( state: CredentialState ): CredentialState => {
		if ( this.payload.clearPassword ) {
			const newState: CredentialState = JSONDeepCopy( state );
			newState.items[this.payload.id] = this.payload;
			return newState;
		} else {
			return state;
		}
	}
}

export class Conceal implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'Conceal';

	constructor( public payload: Credential ) { }

	public reducer = ( state: CredentialState ): CredentialState => {
		const newState: CredentialState = JSONDeepCopy( state );
		delete newState.items[this.payload.id].clearPassword;
		return newState;
	}
}
