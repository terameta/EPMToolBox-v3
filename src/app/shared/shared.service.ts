import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PlatformLocation } from '@angular/common';
import { configuration } from 'server/system.conf';
import * as socketio from 'socket.io-client';
import { SharedState, Interest } from './shared.state';
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
	public selectedTags: any = {};

	constructor(
		private store: Store<AppState>,
		private platformLocation: PlatformLocation
	) {
		// console.log( 'Shared service is constructed' );
		this.store.select( 'shared' ).pipe( distinctUntilChanged(), map( s => s.selectedTags ) ).subscribe( st => this.selectedTags = st );
		this.interests$ = this.store.select( 'shared' ).pipe( debounceTime( 100 ), map( ( state: SharedState ) => state.interests ) );
		// this.store.select('auth').pipe(distinctUntilChanged(), )

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

	public shouldListItem = ( tags: any ) => {
		// If All selected for a tag group, that selection is zero
		// If all tag groups are assigned all, the total of the selection values are zero, list everything
		if ( Object.values( this.selectedTags ).reduce( ( a: number, c: string ) => a + parseInt( c, 10 ), 0 ) === 0 ) return true;
		if ( !tags ) return false;
		let shouldShow = true;
		const filterers = Object.values( this.selectedTags ).filter( t => ( t !== undefined && t !== null && t !== 0 && t !== '0' ) );
		filterers.forEach( currentFilter => {
			if ( tags[currentFilter.toString()] !== true ) shouldShow = false;
		} );
		return shouldShow;
	}
}
