import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, interval, of } from 'rxjs';
import { tap, withLatestFrom, map, filter, distinctUntilChanged, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { AuthStatus } from '../auth/auth.models';
import { UserRole } from 'shared/models/user';
import { RouterGo } from './router.actions';
import { InterestShowAll } from './interest.actions';
import { FEATURE } from './shared.state';
import { ReducingAction } from './reducingaction.model';
import { TagsLoad } from '../admin/tags/tag.actions';
import { NotificationNewInfo } from '../notification/notification.actions';

@Injectable()
export class SharedEffects {
	@Effect( { dispatch: false } ) ROUTER_NAVIGATION$: Observable<any> = this.actions$.pipe(
		ofType( 'ROUTER_NAVIGATION' ),
		withLatestFrom( this.store ),
		tap( ( [routerAction, appState] ) => {
			if ( routerAction.payload.routerState.url === '/sign-in' && appState.auth.status === AuthStatus.SignedIn ) {
				console.log( 'We are actually logged in, let\'s go to correct location' );
				if ( ( appState as AppState ).auth.user.role === UserRole.Admin ) { this.store.dispatch( new RouterGo( { path: ['/', 'admin'] } ) ); }
				if ( ( appState as AppState ).auth.user.role === UserRole.User ) { this.store.dispatch( new RouterGo( { path: ['/', 'end-user'] } ) ); }
			}
		} )
	);

	@Effect() SHOWINITIALINTEREST$: Observable<any> = this.actions$.pipe(
		ofType( 'ROUTER_NAVIGATION' ),
		withLatestFrom( this.store.pipe( select( 'auth' ) ) ),
		filter( ( [routerAction, authState] ) => authState.user.role === UserRole.Admin ),
		distinctUntilChanged(),
		map( () => ( new InterestShowAll() ) )
	);

	@Effect() DataChange$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Data Change' ),
		map( ( action: ReducingAction ) => {
			if ( action.payload === 'tags' ) return ( new TagsLoad() );
			return ( new NotificationNewInfo( { title: 'No feature', message: 'No feature is yet defined as ' + action.payload } ) );
		} )
	);

	@Effect( { dispatch: false } ) ANYTHING$: Observable<any> = this.actions$.pipe( tap( a => console.log( a.type ) ) );

	constructor( private actions$: Actions, private store: Store<AppState> ) { }
}
