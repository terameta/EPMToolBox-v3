import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// // import { ATUser, ATUserDefault } from 'shared/models/at.user';
// // import { JSONDeepCopy } from 'shared/utilities/utilityFunctions';
// import { JwtHelperService as JwtHelper } from '@auth0/angular-jwt';
// // import { ATApiPayload } from 'shared/models/at.socketrequest';
// import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable( {
	providedIn: 'root'
} )
export class AuthService {
	constructor( private http: HttpClient ) { }

	public signin = ( payload ) => this.http.post<{ token: string }>( '/api/auth/signin', payload, { reportProgress: true } );

	// public isAuthenticated$ = new BehaviorSubject<boolean>( false );
	// // public user$ = new BehaviorSubject<ATUser>( JSONDeepCopy( ATUserDefault ) );
	// // public isAuthenticating$ = new BehaviorSubject<boolean>( false );
	// // public isReAuthenticating$ = new BehaviorSubject<boolean>( false );
	// // public signInIssue = '';
	// // public encodedToken = '';
	// // public decodedToken: any;
	// // private checkSessionInterval: any = null;

	// constructor(
	// 	private jwtHelper: JwtHelper,
	// 	private router: Router
	// ) {
	// 	this.initiateService();
	// }

	// private initiateService = () => {
	// 	// this.isAuthenticating$.next( false );
	// 	// this.isReAuthenticating$.next( false );
	// 	// this.encodedToken = localStorage.getItem( 'token' );
	// 	// if ( this.encodedToken ) {
	// 	// 	if ( this.jwtHelper.isTokenExpired() ) {
	// 	// 		this.setSignedOut();
	// 	// 	} else {
	// 	// 		this.decodedToken = this.jwtHelper.decodeToken( this.encodedToken );
	// 	// 		this.user$.next( this.decodedToken );
	// 	// 		this.isAuthenticated$.next( true );
	// 	// 	}
	// 	// } else {
	// 	// 	this.user$.next( JSONDeepCopy( ATUserDefault ) );
	// 	// 	this.isAuthenticated$.next( false );
	// 	// }
	// 	// this.checkSession();
	// 	// if ( this.checkSessionInterval ) clearInterval( this.checkSessionInterval );
	// 	// this.checkSessionInterval = setInterval( this.checkSession, 10000 );
	// }

	// private checkSession = () => {
	// 	// if ( this.encodedToken ) {
	// 	// 	if ( this.jwtHelper.isTokenExpired() ) {
	// 	// 		this.setSignedOut();
	// 	// 	} else if ( this.jwtHelper.isTokenExpired( this.encodedToken, 60 * 60 * 24 * 1 ) ) {
	// 	// 		this.isReAuthenticating$.next( true );
	// 	// 	}
	// 	// }
	// }

	// private setSignedIn = ( token ) => {
	// 	// localStorage.setItem( 'token', token );
	// 	// this.initiateService();
	// 	// this.router.navigate( ['/'] );
	// }

	// public setSignedOut = () => {
	// 	// localStorage.removeItem( 'token' );
	// 	// this.initiateService();
	// }

	// public signUserInInitiate = ( username: string, password: string ) => {
	// 	console.log( 'Hede' );
	// 	// this.user$.next( Object.assign( this.user$.getValue(), { email: username, password: password } ) );
	// 	// this.isAuthenticating$.next( true );
	// }

	// public signin = ( /* payload: ATApiPayload */ ) => {
	// 	// this.setSignedIn( payload.data.token );
	// }

	// public reauthenticate = ( /* payload: ATApiPayload */ ) => {
	// 	// this.isReAuthenticating$.next( false );
	// 	// this.setSignedIn( payload.data.token );
	// }
}
