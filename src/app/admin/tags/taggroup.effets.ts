import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TagGroupsService } from './taggroups.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Observable, of } from 'rxjs';
import { FEATURE } from './taggroups.state';
import { NotificationDismissWithTitle, NotificationNew } from 'src/app/notification/notification.actions';
import { tap, filter, switchMap, mergeMap, catchError } from 'rxjs/operators';
import { ReducingAction } from 'src/app/shared/reducingaction.model';
import { NotificationType } from 'src/app/notification/notification.models';
import { TagGroupsLoad } from './taggroup.actions';

@Injectable() export class TagGroupEffects {

	@Effect() load$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Load' ),
		tap( a => { this.store.dispatch( new NotificationDismissWithTitle( a.type ) ); } ),
		filter( ( a: ReducingAction ) => !a.payload ),
		switchMap( a => this.service.load().pipe(
			mergeMap( result => [
				new NotificationDismissWithTitle( a.type ),
				new TagGroupsLoad( result ),
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

	constructor( private actions$: Actions, private service: TagGroupsService, private store: Store<AppState> ) { }
}
