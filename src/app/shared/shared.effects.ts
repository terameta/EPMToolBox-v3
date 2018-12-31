import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { withLatestFrom, map, filter, distinctUntilChanged, mergeMap, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { AuthStatus } from '../auth/auth.models';
import { UserRole } from 'shared/models/user';
import { RouterGo } from './router.actions';
import { InterestShowAll } from './interest.actions';
import { FEATURE } from './shared.state';
import { ReducingAction } from './reducingaction.model';
import { NotificationNew, NotificationDismissWithTitle } from '../notification/notification.actions';
import { DoNothing, SetCurrentFeature, SetCurrentID, TagSelectionsFromLocalStorage } from './shared.actions';
import { NotificationType } from '../notification/notification.models';
import * as TagActions from '../admin/tags/tag.actions';
import * as TagGroupActions from '../admin/tags/taggroup.actions';
import * as CredentialActions from '../admin/credentials/credentials.actions';
import * as EnvironmentActions from '../admin/environments/environments.actions';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';

@Injectable()
export class SharedEffects {
	@Effect() ROUTER_NAVIGATION$: Observable<any> = this.actions$.pipe(
		ofType( ROUTER_NAVIGATED ),
		withLatestFrom( this.store ),
		filter( ( [routerAction, appState] ) => ( routerAction as RouterNavigatedAction ).payload.event.urlAfterRedirects === '/sign-in' && appState.auth.status === AuthStatus.SignedIn ),
		map( ( [routerAction, appState] ) => {
			console.log( 'We are actually logged in, let\'s go to correct location' );
			if ( appState.auth.user.role === UserRole.Admin ) return new RouterGo( { path: ['/', 'admin'] } );
			if ( appState.auth.user.role === UserRole.User ) return new RouterGo( { path: ['/', 'end-user'] } );
			return new NotificationNew( { title: 'User Error', message: 'User type is not determined <br> Please contact system admin.', type: NotificationType.FatalError } );
		} )
	);

	@Effect() ROUTER_NAVIGATION_GET_CONCEPT$: Observable<any> = this.actions$.pipe(
		ofType( ROUTER_NAVIGATED ),
		mergeMap( ( a: RouterNavigatedAction ) => [
			new SetCurrentFeature( a.payload.event.urlAfterRedirects.split( '/' )[2] || null ),
			new SetCurrentID( a.payload.event.urlAfterRedirects.split( '/' )[3] || null )
			// new SetCurrentFeature( a.payload.routerState.url.split( '/' )[2] || null ),
			// new SetCurrentID( a.payload.routerState.url.split( '/' )[3] || null )
		] )
	);

	@Effect() SHOWINITIALINTEREST$: Observable<any> = this.actions$.pipe(
		ofType( ROUTER_NAVIGATED ),
		withLatestFrom( this.store.select( 'auth' ) ),
		filter( ( [routerAction, authState] ) => authState.status === AuthStatus.SignedIn ),
		distinctUntilChanged(),
		tap( () => this.store.dispatch( new TagSelectionsFromLocalStorage() ) ),
		map( () => ( new InterestShowAll() ) )
	);

	@Effect() DETECTSESSION$: Observable<any> = this.actions$.pipe(
		ofType( 'ROUTER_NAVIGATION' ),
		filter( ( a: ReducingAction ) => a.payload.routerState.url !== '/' ),
		withLatestFrom( this.store.select( 'auth' ) ),
		map( ( [r, a] ) => a ),
		filter( ( authState ) => authState.status === AuthStatus.SignedOut ),
		distinctUntilChanged(),
		map( () => ( new RouterGo( { path: ['/'] } ) ) )
	);

	@Effect() DataChange$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Data Change' ),
		map( ( action: ReducingAction ) => {
			if ( action.payload === 'tags' ) return ( new TagActions.Load() );
			if ( action.payload === 'taggroups' ) return ( new TagGroupActions.Load() );
			if ( action.payload === 'credentials' ) return ( new CredentialActions.Load() );
			if ( action.payload === 'environments' ) return ( new EnvironmentActions.Load() );
			return ( new DoNothing() );
		} )
	);

	// @Effect( { dispatch: false } ) ANYTHING$: Observable<any> = this.actions$.pipe( tap( a => console.log( a.type ) ) );

	constructor( private actions$: Actions, private store: Store<AppState> ) { }
}
