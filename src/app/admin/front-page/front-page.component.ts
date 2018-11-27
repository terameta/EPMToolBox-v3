import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';

@Component( {
	selector: 'app-front-page',
	templateUrl: './front-page.component.html',
	styleUrls: ['./front-page.component.scss']
} )
export class FrontPageComponent implements OnInit {
	public state$;

	constructor( private store: Store<AppState> ) { }

	ngOnInit() {
		this.state$ = this.store;
	}

}
