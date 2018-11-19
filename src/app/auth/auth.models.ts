export enum AuthStatus {
	SignedOut = 0,
	SignedIn = 1,
	Authenticating = 2
}

export enum UserType {
	Guest = 0,
	User = 1,
	Admin = 2
}

export interface User {
	name: string,
	surname: string,
	email: string,
	type: UserType
}
