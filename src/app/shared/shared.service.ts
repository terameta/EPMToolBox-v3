import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';

@Injectable( {
	providedIn: 'root'
} )
export class SharedService {

	constructor(
		private store: Store<AppState>
	) {
		this.store.subscribe( console.log );
	}
}
