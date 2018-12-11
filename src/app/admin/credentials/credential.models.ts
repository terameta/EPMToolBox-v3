export interface Credential {
	id: number,
	name: string,
	username: string,
	password: string,
	tags: any,
	clearPassword?: string
}

export const credentialProtectionString = '|||---protected---|||';
