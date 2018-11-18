import { Action } from '@ngrx/store';

export interface ReducingAction extends Action {
	feature: string,
	reducer: any
}
