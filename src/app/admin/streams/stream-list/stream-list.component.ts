import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UtilityService } from 'src/app/shared/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { FEATURE } from '../streams.state';
import { StreamType } from 'shared/models/streams.models';
import { map } from 'rxjs/operators';

@Component( {
	selector: 'app-stream-list',
	templateUrl: './stream-list.component.html',
	styleUrls: ['./stream-list.component.scss']
} )
export class StreamListComponent implements OnInit {
	public feature = FEATURE;
	public state$ = this.store.select( 'streams' );
	public types = StreamType;
	public environments$ = this.store.select( 'environments' ).pipe( map( s => s.items ) );

	constructor( private store: Store<AppState>, public us: UtilityService, public ss: SharedService ) { }

	ngOnInit() {
	}

}
