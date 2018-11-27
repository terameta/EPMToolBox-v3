import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { debounceTime, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PlatformLocation } from '@angular/common';
import { configuration } from 'server/system.conf';
import * as socketio from 'socket.io-client';
import { SharedState, Interest } from './shared.state';
import { InterestLose, InterestLoseAll } from './interest.actions';
import { DataChange } from './shared.actions';

@Injectable( {
	providedIn: 'root'
} )
export class SharedService {
	public baseURL = '';
	public socket;
	public isConnected$ = new BehaviorSubject<boolean>( false );
	private interests$: Observable<Interest[]>;
	private interestSubscription: Subscription;

	constructor(
		private store: Store<AppState>,
		private platformLocation: PlatformLocation
	) {
		this.interests$ = this.store.pipe( select( 'shared' ), debounceTime( 100 ), map( ( state: SharedState ) => state.interests ) );

		const protocol = ( platformLocation as any ).location.protocol;
		const hostname = ( platformLocation as any ).location.hostname;
		this.baseURL = protocol + '//' + hostname + ':' + configuration.serverPort;
		this.socket = socketio( this.baseURL );

		this.socket.on( 'connect', () => {
			this.isConnected$.next( true );
			if ( this.interestSubscription ) this.interestSubscription.unsubscribe();
			this.interestSubscription = this.interests$.subscribe( this.sendInterest );
		} );
		this.socket.on( 'disconnect', () => {
			this.isConnected$.next( false );
			if ( this.interestSubscription ) {
				this.interestSubscription.unsubscribe();
				this.interestSubscription = null;
			}
		} );
		this.socket.on( 'datachange', ( response ) => {
			this.store.dispatch( new DataChange( response ) );
		} );
	}

	private sendInterest = ( payload: Interest[] ) => {
		this.socket.emit( 'interest', payload );
	}
}
