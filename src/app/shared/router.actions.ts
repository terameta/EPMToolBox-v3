import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export const GO = '[Router] Go';
export const BACK = '[Router] Back';
export const FORWARD = '[Router] Forward';

export class RouterGo implements Action {
	readonly type = GO;
	constructor( public payload: {
		path: any[],
		query?: object,
		extras?: NavigationExtras
	} ) { }
}

export class RouterBack implements Action { readonly type = BACK; }
export class RouterForward implements Action { readonly type = FORWARD; }

export type RouterActionsUnion = RouterGo | RouterBack | RouterForward;
