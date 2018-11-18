export enum UserAuthStatus {
	SignedOut = 0,
	SignedIn = 1
}

export interface User {
	name: string,
	surname: string,
	email: string,
	authStatus: UserAuthStatus
}
