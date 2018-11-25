import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { ReducingAction } from '../shared/reducingaction.model';
import { AuthService } from './auth.service';
import { SignInSuccess, SignInFailure } from './auth.actions';
import { FEATURE } from './auth.state';
import { NotificationNewFatalError, NotificationDismissWithTitle, NotificationNewBlockingProgress } from '../notification/notification.actions';

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
			( new NotificationNewBlockingProgress( { title: 'Signing In', message: 'Please wait...' } ) )
		] )
	);

	@Effect() signinSuccess$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'SignIn Success' ),
		map( () => ( new NotificationDismissWithTitle( 'Signing In' ) ) )
	);

	@Effect() signinfailure$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'SignIn Failure' ),
		mergeMap( ( action: ReducingAction ) => [
			( new NotificationDismissWithTitle( 'Signing In' ) ),
			( new NotificationNewFatalError( { ...action.payload, ...{ title: 'Sign In Error' } } ) )
		] )
	);

	constructor( private actions$: Actions, private service: AuthService ) { }
}
