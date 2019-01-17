import { Component, OnInit } from '@angular/core';
import { StreamType } from 'shared/models/streams.models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { filter, combineLatest, map } from 'rxjs/operators';

@Component( {
	selector: 'app-stream-export-detail',
	templateUrl: './stream-export-detail.component.html',
	styleUrls: ['./stream-export-detail.component.scss']
} )
export class StreamExportDetailComponent implements OnInit {
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
