import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap, mergeMap, map } from 'rxjs/operators';
import { ReducingAction } from '../shared/reducingaction.model';
import { Action } from '@ngrx/store';

@Injectable()
export class AuthEffects {
	@Effect( { dispatch: false } )
	login$: Observable<any> = this.actions$.pipe(
		ofType( '[AUTH] LOGIN' ),
		map( action => {
			console.log( action );
		} )
	);

	constructor( private actions$: Actions ) { }
}
