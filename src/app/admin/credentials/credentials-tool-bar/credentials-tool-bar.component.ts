import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { RouterGo } from 'src/app/shared/router.actions';

@Component( {
	selector: 'app-credentials-tool-bar',
	templateUrl: './credentials-tool-bar.component.html',
	styleUrls: ['./credentials-tool-bar.component.scss']
} )
export class CredentialsToolBarComponent implements OnInit {
	public currentID$ = this.store.select( 'shared' ).pipe(
		map( s => s.currentID ),
		distinctUntilChanged(),
		map( id => id || 0 )
	);

	public state$ = this.store.select( 'credentials' );

	constructor(
		private store: Store<AppState>
	) { }

	ngOnInit() { }

	public selectionChanged = ( $event ) => this.store.dispatch( new RouterGo( { path: ['admin', 'credentials', $event.target.value] } ) );

}
