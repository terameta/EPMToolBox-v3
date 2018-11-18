import { Component, OnInit } from '@angular/core';
import { AuthState } from 'src/app/auth/auth.state';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';

@Component( {
	selector: 'app-guest',
	templateUrl: './guest.component.html',
	styleUrls: ['./guest.component.scss']
} )
export class GuestComponent implements OnInit {
	public auth$: Observable<AuthState>;
	public router$: Observable<any>;

	constructor( private store: Store<AppState> ) {
		this.auth$ = this.store.pipe( select( 'auth' ) );
		this.router$ = this.store.pipe( select( 'router' ) );
	}

	ngOnInit() {
	}

}
