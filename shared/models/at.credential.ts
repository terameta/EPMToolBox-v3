import { JSONDeepCopy } from '../../shared/utilities/utility.functions';


export interface ATCredential {
	id: number,
	name: string,
	username: string,
	password: string,
	tags: any,
	clearPassword?: string
}

export const getDefaultATCredential = () => ( <ATCredential>JSONDeepCopy( { tags: {} } ) );
