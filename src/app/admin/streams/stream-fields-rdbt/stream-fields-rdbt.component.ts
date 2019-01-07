import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { map, distinctUntilChanged, combineLatest, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Stream } from 'shared/models/streams.models';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';
import { UtilityService } from 'src/app/shared/utility.service';

@Component( {
	selector: 'app-stream-fields-rdbt',
	templateUrl: './stream-fields-rdbt.component.html',
	styleUrls: ['./stream-fields-rdbt.component.scss']
} )
export class StreamFieldsRdbtComponent implements OnInit {
	public id$ = this.store.select( 'shared' ).pipe( map( s => s.currentID ), distinctUntilChanged() );
	public item$: Observable<Stream> = this.store.select( 'streams' ).pipe(
		combineLatest( this.id$ ),
		filter( ( [s, id] ) => !!id && s.loaded && !!s.items[id] ),
		map( ( [s, id] ) => JSONDeepCopy( s.items[id] ) ),
	);

	constructor( private store: Store<AppState>, public us: UtilityService ) { }

	ngOnInit() {
	}

}
