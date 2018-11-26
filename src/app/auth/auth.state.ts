import { AuthStatus } from './auth.models';
import { User, UserRole, UserType } from 'shared/models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';

export const FEATURE = '[AUTH]';

export interface AuthState {
	user: User,
	status: AuthStatus
}

const authInitialStateBase: AuthState = {
	user: {
		id: 0,
		username: '',
		password: '',
		role: UserRole.Guest,
		type: UserType.Local,
		ldapserver: 0,
		email: '',
		name: '',
		surname: '',
		clearance: {}
	},
	status: AuthStatus.SignedOut
};

export const initialAuthState = (): AuthState => {
	const state: AuthState = JSONDeepCopy( authInitialStateBase );
	const helper = new JwtHelperService();
	const storedToken = localStorage.getItem( 'token' );
	// console.log( 'Stored Token', storedToken );
	// console.log( 'isTokenExpired', helper.isTokenExpired( storedToken ) );
	if ( !helper.isTokenExpired( storedToken ) ) {
		state.user = helper.decodeToken( storedToken );
		state.status = AuthStatus.SignedIn;
	}
	// console.log( 'Initial State', state );
	return state;
};
