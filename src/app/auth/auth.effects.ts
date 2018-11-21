import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ReducingAction } from '../shared/reducingaction.model';
import { AuthService } from './auth.service';
import { SignInSuccess } from './auth.actions';

@Injectable()
export class AuthEffects {
	@Effect() signin$: Observable<any> = this.actions$.pipe(
		ofType( '[AUTH] SignIn' ),
		switchMap( ( action: ReducingAction ) => this.service.signin( action.payload ) ),
		map( result => ( new SignInSuccess( result ) ) ),
		catchError( e => of( console.error( e ) ) )
	);

	constructor( private actions$: Actions, private service: AuthService ) { }
}
