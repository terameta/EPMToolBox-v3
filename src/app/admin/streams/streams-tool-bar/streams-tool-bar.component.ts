import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { RouterGo } from 'src/app/shared/router.actions';

@Component( {
	selector: 'app-streams-tool-bar',
	templateUrl: './streams-tool-bar.component.html',
	styleUrls: ['./streams-tool-bar.component.scss']
} )
export class StreamsToolBarComponent implements OnInit {
	public currentID$ = this.store.select( 'shared' ).pipe(
		map( s => s.currentID ),
		distinctUntilChanged(),
		map( id => id || 0 ),
	);

	public state$ = this.store.select( 'streams' );

	constructor( private store: Store<AppState> ) { }

	ngOnInit() { }

	public selectionChanged = ( $event ) => this.store.dispatch( new RouterGo( { path: ['admin', 'streams', $event.target.value] } ) );

}
