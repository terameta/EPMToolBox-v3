import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ArtifactsService } from './artifacts.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { Observable, of } from 'rxjs';
import { FEATURE } from './artifacts.state';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { Load, LoadComplete } from './artifacts.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationNew } from '../notification/notification.actions';
import { NotificationType } from '../notification/notification.models';

@Injectable()
export class ArtifactEffects {

	@Effect() load$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Load' ),
		mergeMap( ( a: Load ) => this.service.load( a.payload ).pipe(
			map( result => new LoadComplete( result ) ),
			catchError( ( e: HttpErrorResponse ) => of(
				new NotificationNew( { title: a.type, message: 'Load failed.\nDetails:\n' + e.error.message, type: NotificationType.Error } )
			) )
		) )
	);

	constructor( private actions$: Actions, private service: ArtifactsService, private store: Store<AppState> ) { }
}
