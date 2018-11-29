import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TagsService } from './tags.service';
import { Observable, of } from 'rxjs';
import { FEATURE } from './tags.state';
import { switchMap, catchError, tap, filter, mergeMap } from 'rxjs/operators';
import { TagsLoad } from './tag.actions';
import { NotificationNewError, NotificationNewInfo, NotificationNewProgress, NotificationDismissWithTitle } from 'src/app/notification/notification.actions';
import { ReducingAction } from 'src/app/shared/reducingaction.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { actionType2Title } from 'shared/utilities/utility.functions';

@Injectable()
export class TagEffects {

	@Effect() load$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Load' ),
		tap( a => { this.store.dispatch( new NotificationDismissWithTitle( actionType2Title( a.type ) ) ); } ),
		tap( a => { this.store.dispatch( new NotificationNewProgress( { title: actionType2Title( a.type ), message: 'Loading Please Wait' } ) ); } ),
		filter( ( a: ReducingAction ) => !a.payload ),
		switchMap( ( a ) => this.service.load().pipe(
			mergeMap( result => [
				( new NotificationDismissWithTitle( actionType2Title( a.type ) ) ),
				( new TagsLoad( result ) ),
				new NotificationNewInfo( { title: actionType2Title( a.type ), message: 'Successful' } )
			] ),
			catchError( ( e: Error ) => of( new NotificationDismissWithTitle( actionType2Title( a.type ) ), new NotificationNewError( { title: actionType2Title( a.type ), message: 'Load failed.\nDetails:\n' + e.message } ) ) )
		) )
	);

	constructor( private actions$: Actions, private service: TagsService, private store: Store<AppState> ) { }
}
