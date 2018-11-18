import { User, UserAuthStatus } from './auth.models';

export const FEATURE = 'auth';

export interface AuthState {
	user: User
}

export const authInitialState: AuthState = {
	user: {
		name: '',
		surname: '',
		email: '',
		authStatus: UserAuthStatus.SignedOut
	}
};
