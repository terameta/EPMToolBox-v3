import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { FEATURE } from './notification.state';
import { tap, filter, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { NotificationCountDown, NotificationDismissWithUUID } from './notification.actions';
import { ReducingAction } from '../shared/reducingaction.model';

@Injectable()
export class NotificationEffects {
	@Effect( { dispatch: false } ) new$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'New' ),
		tap( ( a: ReducingAction ) => {
			setTimeout( () => {
				this.store.dispatch( new NotificationCountDown( a.payload.uuid ) );
			}, 500 );
		} )
	);

	@Effect( { dispatch: false } ) countDown$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Count Down' ),
		withLatestFrom( this.store.select( 'notification' ) ),
		tap( ( [a, state] ) => {
			state.notifications.forEach( n => {
				if ( n.uuid === a.payload ) {
					if ( n.countDown > 0 ) setTimeout( () => { this.store.dispatch( new NotificationCountDown( a.payload ) ); }, 500 );
					if ( n.countDown <= 0 ) this.store.dispatch( new NotificationDismissWithUUID( a.payload ) );
				}
			} );
		} )
	);


	constructor( private actions$: Actions, private store: Store<AppState> ) { }
}
