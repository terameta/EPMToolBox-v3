import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { NotificationService } from './notification.service';
import { Observable } from 'rxjs';
import { FEATURE } from './notification.state';
import { tap } from 'rxjs/operators';

@Injectable()
export class NotificationEffects {
	@Effect( { dispatch: false } ) new$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'New' ),
		tap( a => console.log( a ) )
	);

	constructor( private actions$: Actions, private service: NotificationService ) { }
}
