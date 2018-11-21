import { ReducingAction } from '../shared/reducingaction.model';
import { AuthState, FEATURE } from './auth.state';

export class SignIn implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = '[AUTH] SignIn';

	constructor( public payload: { username: string, password: string } ) { console.log( this.type, 'is requested with', this.payload ); }
}

export class SignInSuccess implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = '[AUTH] SignIn Success';

	constructor( public payload: { token: string } ) { }

	public reducer = ( state: AuthState ) => {
		console.log( state );
		console.log( this.payload );
		return state;
	}
}
