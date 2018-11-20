import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { SignIn } from 'src/app/auth/auth.actions';

@Component( {
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss']
} )
export class SignInComponent implements OnInit {
	public creds = {
		username: '',
		password: ''
	};

	constructor( private store: Store<AppState> ) { }

	ngOnInit() {
	}

	public signin = ( f: NgForm ) => {
		console.log( this.creds );
		this.store.dispatch( new SignIn( this.creds ) );
	}

}
