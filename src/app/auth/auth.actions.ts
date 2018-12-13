import { ReducingAction } from '../shared/reducingaction.model';
import { AuthState, FEATURE } from './auth.state';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthStatus } from './auth.models';
import { HttpErrorResponse } from '@angular/common/http';

export class SignIn implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'SignIn';

	constructor( public payload: { username: string, password: string } ) { }

	public reducer = ( state: AuthState ): AuthState => {
		const newState: AuthState = { ...state, ...{ status: AuthStatus.Authenticating } };
		return newState;
	}
}

export class SignInSuccess implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'SignIn Success';

	constructor( public payload: { token: string } ) { }

	public reducer = ( state: AuthState ): AuthState => {
		const helper = new JwtHelperService();
		localStorage.setItem( 'token', this.payload.token );
		const newState = { ...state, ...{ user: helper.decodeToken( this.payload.token ) } };
		newState.status = AuthStatus.SignedIn;
		return newState;
	}
}

export class SignInFailure implements ReducingAction {
	readonly feature = FEATURE;
	readonly type = FEATURE + 'SignIn Failure';

	constructor( public payload: HttpErrorResponse ) { }

	public reducer = ( state: AuthState ): AuthState => {
		return { ...state, ...{ status: AuthStatus.SignedOut } };
	}
}
