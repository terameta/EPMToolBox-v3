import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { combineLatest, map, filter } from 'rxjs/operators';

@Component( {
	selector: 'app-stream-fielddescriptions',
	templateUrl: './stream-fielddescriptions.component.html',
	styleUrls: ['./stream-fielddescriptions.component.scss']
} )
export class StreamFielddescriptionsComponent implements OnInit {
	public state$ = this.store.select( 'streams' ).pipe(
		filter( s => s.loaded ),
		combineLatest( this.store.select( 'shared' ) ),
		map( ( [t, h] ) => {
			// return t.items[h.currentID];
			return {
				item: t.items[h.currentID],
				doWeHaveDescribedFields: t.items[h.currentID].fieldList.filter( f => f.isDescribed ).length
			};
		} )
	);

	constructor( private store: Store<AppState> ) { }

	ngOnInit() {
	}

}
