import { createSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { AppState } from '../app.state';

export const selectRouter = ( state: AppState ) => state.router;

export const getURL = createSelector(
	selectRouter,
	( state: RouterReducerState ) => state.state.url
);
