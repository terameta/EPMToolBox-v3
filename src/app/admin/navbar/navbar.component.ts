import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Observable } from 'rxjs';
import { getURL } from 'src/app/shared/router.selectors';


@Component( {
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
} )
export class NavbarComponent implements OnInit {
	public url$: Observable<string>;

	constructor( private store: Store<AppState> ) { }

	ngOnInit() {
		this.url$ = this.store.pipe( select( getURL ) );
	}

}
