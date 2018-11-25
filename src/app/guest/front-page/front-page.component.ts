import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthState } from 'src/app/auth/auth.state';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UserRole } from 'shared/models/user';

@Component( {
	selector: 'app-front-page',
	templateUrl: './front-page.component.html',
	styleUrls: ['./front-page.component.scss']
} )
export class FrontPageComponent implements OnInit {
	public auth$: Observable<AuthState>;
	public userRole = UserRole;

	constructor( private store: Store<AppState> ) {
		this.auth$ = this.store.pipe( select( 'auth' ) );
	}

	ngOnInit() {
	}

}
