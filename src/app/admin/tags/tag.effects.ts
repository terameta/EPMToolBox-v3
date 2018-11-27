import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TagsService } from './tags.service';
import { Observable, of } from 'rxjs';
import { FEATURE } from './tags.state';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { TagsLoadComplete } from './tag.actions';
import { NotificationNewError } from 'src/app/notification/notification.actions';

@Injectable()
export class TagEffects {
	@Effect() load$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Load' ),
		tap( a => console.log( 'We are at Tag Load', a.type ) ),
		switchMap( () => this.service.load().pipe(
			map( result => ( new TagsLoadComplete( result ) ) ),
			catchError( ( e: Error ) => of( new NotificationNewError( e ) ) )
		)
		)
	);

	constructor( private actions$: Actions, private service: TagsService ) { }
}
