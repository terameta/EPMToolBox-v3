import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { SignIn } from 'src/app/auth/auth.actions';
import { Observable } from 'rxjs';
import { AuthState } from 'src/app/auth/auth.state';
import { AuthStatus } from 'src/app/auth/auth.models';
import { AuthService } from 'src/app/auth/auth.service';

@Component( {
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss']
} )
export class SignInComponent implements OnInit {
	public auth$: Observable<AuthState>;
	public authStatus = AuthStatus;

	public creds = {
		username: '',
		password: ''
	};

	constructor( private store: Store<AppState>, private authService: AuthService ) { }

	ngOnInit() {
		this.auth$ = this.store.pipe( select( 'auth' ) );
	}

	public signin = ( f: NgForm ) => {
		this.store.dispatch( new SignIn( this.creds ) );
	}

}
