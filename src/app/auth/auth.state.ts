import { AuthStatus, User, UserType } from './auth.models';

export const FEATURE = 'AUTH';

export interface AuthState {
	user: User,
	status: AuthStatus
}

export const authInitialState: AuthState = {
	user: {
		name: '',
		surname: '',
		email: '',
		type: UserType.Guest
	},
	status: AuthStatus.SignedOut
};
