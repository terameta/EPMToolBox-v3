import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, mergeMap, withLatestFrom, filter } from 'rxjs/operators';
import { ReducingAction } from '../shared/reducingaction.model';
import { AuthService } from './auth.service';
import { SignInSuccess, SignInFailure } from './auth.actions';
import { FEATURE } from './auth.state';
import { NotificationNew, NotificationDismissWithTitle } from '../notification/notification.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { AuthStatus } from './auth.models';
import { UserRole } from 'shared/models/user';
import { RouterGo } from '../shared/router.actions';
import { NotificationType } from '../notification/notification.models';

@Injectable()
export class AuthEffects {
	@Effect() signin$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'SignIn' ),
		switchMap( ( action: ReducingAction ) => this.service.signin( action.payload ).pipe(
			map( result => ( new SignInSuccess( result ) ) ),
			catchError( e => of( new SignInFailure( e.error ) ) )
		) )
	);

	@Effect() signinProgress$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'SignIn' ),
		mergeMap( () => [
			( new NotificationDismissWithTitle( 'Signing In' ) ),
			( new NotificationNew( { title: 'Signing In', message: 'Please wait...', type: NotificationType.BlockingProgress } ) )
		] )
	);

	@Effect() signinSuccess$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'SignIn Success' ),
		map( () => ( new NotificationDismissWithTitle( 'Signing In' ) ) )
	);

	@Effect() signInSuccessRedirect$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'SignIn Success' ),
		withLatestFrom( this.store ),
		filter( ( [result, appState] ) => appState.auth.status === AuthStatus.SignedIn ),
		map( ( [result, appState] ) => {
			console.log( 'We are now logged in, let\'s go to correct location' );
			if ( appState.auth.user.role === UserRole.Admin ) return new RouterGo( { path: ['/', 'admin'] } );
			if ( appState.auth.user.role === UserRole.User ) return new RouterGo( { path: ['/', 'end-user'] } );
			return new NotificationNew( { title: 'User Issue', message: 'User type is not determined. Please contact system admin.', type: NotificationType.FatalError } );
		} )
	);

	@Effect() signinfailure$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'SignIn Failure' ),
		mergeMap( ( action: ReducingAction ) => [
			( new NotificationDismissWithTitle( 'Signing In' ) ),
			( new NotificationNew( { ...action.payload, title: 'Sign In Error', type: NotificationType.FatalError } ) )
		] )
	);

	constructor( private actions$: Actions, private service: AuthService, private store: Store<AppState> ) { }
}
