import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { SharedService } from './shared.service';
import { Observable } from 'rxjs';
import { FEATURE } from './shared.state';
import { mergeMap, tap } from 'rxjs/operators';
import { InterestShow, InterestLose } from './interest.actions';

@Injectable()
export class InterestEffects {
	@Effect() showall$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Interest Show All' ),
		mergeMap( () => [
			( new InterestShow( 'asyncbr' ) ),
			( new InterestShow( 'credentials' ) ),
			( new InterestShow( 'environments' ) ),
			( new InterestShow( 'maps' ) ),
			( new InterestShow( 'matrices' ) ),
			( new InterestShow( 'processes' ) ),
			( new InterestShow( 'schedules' ) ),
			( new InterestShow( 'secrets' ) ),
			( new InterestShow( 'settings' ) ),
			( new InterestShow( 'streams' ) ),
			( new InterestShow( 'tags' ) ),
			( new InterestShow( 'users' ) )
		] )
	);

	@Effect( { dispatch: false } ) showalllog$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Interest Show All' ),
		tap( ( a ) => console.log( a.type, 'is called', ( new Date() ).toString() ) )
	);

	@Effect() loseall$: Observable<any> = this.actions$.pipe(
		ofType( FEATURE + 'Interest Lose All' ),
		mergeMap( () => [
			( new InterestLose( 'asyncbr' ) ),
			( new InterestLose( 'credentials' ) ),
			( new InterestLose( 'environments' ) ),
			( new InterestLose( 'maps' ) ),
			( new InterestLose( 'matrices' ) ),
			( new InterestLose( 'processes' ) ),
			( new InterestLose( 'schedules' ) ),
			( new InterestLose( 'secrets' ) ),
			( new InterestLose( 'settings' ) ),
			( new InterestLose( 'streams' ) ),
			( new InterestLose( 'tags' ) ),
			( new InterestLose( 'users' ) )
		] )
	);

	constructor( private actions$: Actions, private service: SharedService ) { }
}
