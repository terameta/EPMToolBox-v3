import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TagsService } from './tags.service';
import { Observable, of } from 'rxjs';
import { FEATURE } from './tags.state';
import { switchMap, map, catchError, tap, filter, mergeMap, concat, merge } from 'rxjs/operators';
import { TagsLoad } from './tag.actions';
import { NotificationNewError, NotificationNewInfo, NotificationNewProgress, NotificationDismissWithTitle } from 'src/app/notification/notification.actions';
import { ReducingAction } from 'src/app/shared/reducingaction.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { actionType2Title } from 'shared/utilities/utility.functions';

@Injectable()
export class TagEffects {

	// @Effect() load$: Observable<any> = this.actions$.pipe(
	// 	ofType( FEATURE + 'Load' ),
	// 	filter( ( a: ReducingAction ) => !a.payload ),
	// 	switchMap( () => this.service.load().pipe(
	// 		map( result => ( new TagsLoad( result ) ) ),
	// 		catchError( ( e: Error ) => of( new NotificationNewError( e ) ) )
	// 	)
	// 	)
	// );

	// @Effect() load$: Observable<any> = this.actions$.pipe(
	// 	ofType( FEATURE + 'Load' ),
	// 	filter( ( a: ReducingAction ) => !a.payload ),
	// 	concat( of( new NotificationNewInfo( { title: 'Tags Loading', message: 'Tags areaaa loading' } ) ) ),
	// 	switchMap( () => [
	// 		( new NotificationNewInfo( { title: 'Tags Loading', message: 'Tags are loading' } ) ),
	// 		( new TagsLoad( [{ id: 1, name: 'Dummy', description: '', taggroup: 0 }, { id: 2, name: 'ABC', description: '', taggroup: 0 }] ) )
	// 		// this.service.load().pipe( tap( r => console.log( 'TL:', r ) ), map( r => new TagsLoad( r ) ) )
	// 		// ( this.service.load().pipe(
	// 		// 	map( result => ( new TagsLoad( result ) ) ),
	// 		// 	catchError( e => of( new NotificationNewError( e ) ) )
	// 		// ) )
	// 	] )
	// );

	@Effect() load$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Load' ),
		tap( a => { this.store.dispatch( new NotificationDismissWithTitle( actionType2Title( a.type ) ) ); } ),
		tap( a => { this.store.dispatch( new NotificationNewProgress( { title: actionType2Title( a.type ), message: 'Loading Please Wait' } ) ); } ),
		filter( ( a: ReducingAction ) => !a.payload ),
		switchMap( ( a ) => this.service.load().pipe(
			mergeMap( result => [
				( new NotificationDismissWithTitle( actionType2Title( a.type ) ) ),
				( new TagsLoad( result ) )
			] ),
			catchError( ( e: Error ) => of( new NotificationNewError( e ) ) )
		) )
	);

	constructor( private actions$: Actions, private service: TagsService, private store: Store<AppState> ) { }
}
