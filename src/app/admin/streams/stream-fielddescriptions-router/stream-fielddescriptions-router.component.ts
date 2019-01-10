import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { StreamType } from 'shared/models/streams.models';
import { combineLatest, map, filter } from 'rxjs/operators';

@Component( {
	selector: 'app-stream-fielddescriptions-router',
	templateUrl: './stream-fielddescriptions-router.component.html',
	styleUrls: ['./stream-fielddescriptions-router.component.scss']
} )
export class StreamFielddescriptionsRouterComponent implements OnInit {
	public types = StreamType;
	public type$ = this.store.select( 'streams' ).pipe(
		filter( s => s.loaded ),
		combineLatest( this.store.select( 'shared' ) ),
		map( ( [t, h] ) => {
			return t.items[h.currentID].type;
		} )
	);

	constructor( private store: Store<AppState> ) { }
	ngOnInit() {
	}

}
