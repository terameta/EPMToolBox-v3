import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TagsService } from './tags.service';
import { Observable, of } from 'rxjs';
import { FEATURE } from './tags.state';
import { switchMap, catchError, tap, filter, mergeMap } from 'rxjs/operators';
import { Load, Create, Update, Delete } from './tag.actions';
import { NotificationNew, NotificationDismissWithTitle } from 'src/app/notification/notification.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { NotificationType } from 'src/app/notification/notification.models';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TagEffects {

	@Effect() load$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Load' ),
		tap( a => { this.store.dispatch( new NotificationDismissWithTitle( a.type ) ); } ),
		filter( ( a: Load ) => !a.payload ),
		tap( a => { this.store.dispatch( new NotificationNew( { title: a.type, message: 'Loading Please Wait', type: NotificationType.Progress } ) ); } ),
		switchMap( ( a ) => this.service.load().pipe(
			mergeMap( result => [
				( new NotificationDismissWithTitle( a.type ) ),
				( new Load( result ) ),
				new NotificationNew( { title: a.type, message: 'Successful', type: NotificationType.Success } )
			] ),
			catchError( ( e: HttpErrorResponse ) =>
				of(
					new NotificationDismissWithTitle( a.type ),
					new NotificationNew( { title: a.type, message: 'Load failed.\nDetails:\n' + e.error.message, type: NotificationType.Error } )
				)
			)
		) )
	);

	@Effect() create$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Create' ),
		tap( a => { this.store.dispatch( new NotificationDismissWithTitle( a.type ) ); } ),
		filter( ( a: Create ) => !!a.payload ),
		switchMap( a => this.service.create( a.payload ).pipe(
			mergeMap( result => [
				new NotificationDismissWithTitle( a.type ),
				new NotificationNew( { title: a.type, message: a.payload.name + ' is created', type: NotificationType.Success } )
			] ),
			catchError( ( e: HttpErrorResponse ) =>
				of(
					new NotificationDismissWithTitle( a.type ),
					new NotificationNew( { title: a.type, message: 'Create failed for ' + a.payload.name + '\n' + e.error.message, type: NotificationType.Error } )
				)
			)
		)
		)
	);

	@Effect() update$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Update' ),
		tap( a => { this.store.dispatch( new NotificationDismissWithTitle( a.type ) ); } ),
		filter( ( a: Update ) => !!a.payload ),
		switchMap( a => this.service.update( a.payload ).pipe(
			mergeMap( () => [
				new NotificationDismissWithTitle( a.type ),
				new NotificationNew( { title: a.type, message: a.payload.name + ' is updated', type: NotificationType.Success } )
			] ),
			catchError( ( e: HttpErrorResponse ) =>
				of(
					new NotificationDismissWithTitle( a.type ),
					new NotificationNew( { title: a.type, message: 'Update failed for ' + a.payload.name + '\n' + e.error.message, type: NotificationType.Error } )
				)
			)
		) )
	);

	@Effect() delete$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Delete' ),
		tap( a => { this.store.dispatch( new NotificationDismissWithTitle( a.type ) ); } ),
		filter( ( a: Delete ) => !!a.payload ),
		switchMap( a => this.service.delete( a.payload.id ).pipe(
			mergeMap( result => [
				new NotificationDismissWithTitle( a.type ),
				new NotificationNew( { title: a.type, message: a.payload.name + ' is deleted', type: NotificationType.Success } )
			] ),
			catchError( ( e: HttpErrorResponse ) =>
				of(
					new NotificationDismissWithTitle( a.type ),
					new NotificationNew( { title: a.type, message: 'Delete failed for ' + a.payload.name + '\n' + e.error.message, type: NotificationType.Error } )
				)
			)
		) )
	);

	constructor( private actions$: Actions, private service: TagsService, private store: Store<AppState> ) { }
}
