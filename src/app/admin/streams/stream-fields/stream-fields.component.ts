import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { StreamType } from 'shared/models/streams.models';
import { combineLatest, map, filter } from 'rxjs/operators';

@Component( {
	selector: 'app-stream-fields',
	templateUrl: './stream-fields.component.html',
	styleUrls: ['./stream-fields.component.scss']
} )
export class StreamFieldsComponent implements OnInit {
	public types = StreamType;
	public type$ = this.store.select( 'streams' ).pipe(
		filter( s => s.loaded ),
		combineLatest( this.store.select( 'shared' ) ),
		map( ( [t, h] ) => {
			return t.items[h.currentID].type;
		} )
	);

	constructor( private store: Store<AppState> ) { }

	ngOnInit() { }

}
