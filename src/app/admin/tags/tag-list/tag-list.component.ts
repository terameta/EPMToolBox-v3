import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';

@Component( {
	selector: 'app-tag-list',
	templateUrl: './tag-list.component.html',
	styleUrls: ['./tag-list.component.scss']
} )
export class TagListComponent implements OnInit {
	public tagState$ = this.store.select( 'tags' );

	constructor( private store: Store<AppState> ) { }

	ngOnInit() {
	}

}
