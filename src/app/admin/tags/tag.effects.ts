import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TagsService } from './tags.service';
import { Observable, of } from 'rxjs';
import { FEATURE } from './tags.state';
import { switchMap, catchError, tap, filter, mergeMap } from 'rxjs/operators';
import { TagsLoad } from './tag.actions';
import { NotificationNew, NotificationDismissWithTitle } from 'src/app/notification/notification.actions';
import { ReducingAction } from 'src/app/shared/reducingaction.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { NotificationType } from 'src/app/notification/notification.models';

@Injectable()
export class TagEffects {

	@Effect() load$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Load' ),
		tap( a => { this.store.dispatch( new NotificationDismissWithTitle( a.type ) ); } ),
		filter( ( a: ReducingAction ) => !a.payload ),
		tap( a => { this.store.dispatch( new NotificationNew( { title: a.type, message: 'Loading Please Wait', type: NotificationType.Progress } ) ); } ),
		switchMap( ( a ) => this.service.load().pipe(
			mergeMap( result => [
				( new NotificationDismissWithTitle( a.type ) ),
				( new TagsLoad( result ) ),
				new NotificationNew( { title: a.type, message: 'Successful', type: NotificationType.Success } )
			] ),
			catchError( ( e: Error ) =>
				of(
					new NotificationDismissWithTitle( a.type ),
					new NotificationNew( { title: a.type, message: 'Load failed.\nDetails:\n' + e.message, type: NotificationType.Error } )
				)
			)
		) )
	);

	constructor( private actions$: Actions, private service: TagsService, private store: Store<AppState> ) { }
}
