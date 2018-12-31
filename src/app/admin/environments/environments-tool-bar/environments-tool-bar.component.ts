import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { RouterGo } from 'src/app/shared/router.actions';

@Component( {
	selector: 'app-environments-tool-bar',
	templateUrl: './environments-tool-bar.component.html',
	styleUrls: ['./environments-tool-bar.component.scss']
} )
export class EnvironmentsToolBarComponent implements OnInit {
	public currentID$ = this.store.select( 'shared' ).pipe(
		map( s => s.currentID ),
		distinctUntilChanged(),
		map( id => id || 0 )
	);

	public state$ = this.store.select( 'environments' );

	constructor( private store: Store<AppState> ) { }

	ngOnInit() { }

	public selectionChanged = ( $event ) => this.store.dispatch( new RouterGo( { path: ['admin', 'environments', $event.target.value] } ) );

}
