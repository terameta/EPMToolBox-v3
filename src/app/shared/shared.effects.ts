import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { AuthStatus } from '../auth/auth.models';
import { UserRole } from 'shared/models/user';
import { RouterGo } from './router.actions';

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

	@Effect( { dispatch: false } ) ANYTHING$: Observable<any> = this.actions$.pipe( tap( a => console.log( a.type ) ) );

	constructor( private actions$: Actions, private store: Store<AppState> ) { }
}
