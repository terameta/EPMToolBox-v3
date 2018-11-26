import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';

@Injectable( {
	providedIn: 'root'
} )
export class SharedService {

	constructor(
		private store: Store<AppState>
	) {
		this.store.pipe( select( 'interest' ) ).subscribe( console.log );
		console.log( 'Shared service constructed' );
	}
}
