import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { map, distinctUntilChanged, combineLatest } from 'rxjs/operators';
import { RouterGo } from 'src/app/shared/router.actions';

@Component( {
	selector: 'app-tags-tool-bar',
	templateUrl: './tags-tool-bar.component.html',
	styleUrls: ['./tags-tool-bar.component.scss']
} )
export class TagsToolBarComponent implements OnInit {

	public groupID$ = this.store.select( 'shared' ).pipe(
		map( rs => rs.currentID ),
		distinctUntilChanged(),
		map( id => id ? id : 0 )
	);

	public groups$ = this.store.select( 'taggroups' );

	constructor( private store: Store<AppState> ) { }

	ngOnInit() { }

	public selectionChanged = ( $event ) => this.store.dispatch( new RouterGo( { path: ['admin', 'tags', $event.target.value] } ) );

}
