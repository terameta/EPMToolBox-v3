// import { Injectable } from '@angular/core';
// import { AuthService } from './auth/auth.service';
// import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
// import { JwtHelperService as JwtHelper } from '@auth0/angular-jwt';

// @Injectable( {
// 	providedIn: 'root'
// } )
// export class AuthGuardService implements CanActivate {

// 	constructor(
// 		private auth: AuthService,
// 		private router: Router,
// 		private jwtHelper: JwtHelper
// 	) { }

// 	public canActivate( route: ActivatedRouteSnapshot ): boolean {
// 		if ( !this.auth.isAuthenticated$.getValue() ) {
// 			// this.router.navigate( ['signin'] );
// 			console.log( 'Is not authenticated' );
// 			return false;
// 		}
// 		if ( route.data.expectedRole && route.data.expectedRole !== this.jwtHelper.decodeToken().role ) {
// 			console.log( 'We should dispatch an error here' );
// 			return false;
// 		}
// 		return true;
// 	}
// }
