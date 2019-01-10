import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { combineLatest, map, filter } from 'rxjs/operators';
import { RouterGo } from 'src/app/shared/router.actions';

@Component( {
	selector: 'app-stream-fielddescriptions-redirector',
	templateUrl: './stream-fielddescriptions-redirector.component.html',
	styleUrls: ['./stream-fielddescriptions-redirector.component.scss']
} )
export class StreamFielddescriptionsRedirectorComponent implements OnInit, OnDestroy {

	public state$ = this.store.select( 'streams' ).pipe(
		filter( s => s.loaded ),
		combineLatest( this.store.select( 'shared' ) ),
		map( ( [t, h] ) => t.items[h.currentID] )
	);
	private sub = this.state$.subscribe( ( item ) => {
		if ( item.fieldList ) {
			if ( Array.isArray( item.fieldList ) ) {
				if ( item.fieldList.filter( f => f.isDescribed )[0] ) {
					this.store.dispatch( new RouterGo( { path: ['admin', 'streams', item.id.toString(), 'fielddescriptions', item.fieldList.filter( f => f.isDescribed )[0].name] } ) );
					return true;
				}
			}
		}
		this.store.dispatch( new RouterGo( { path: ['admin', 'streams', item.id.toString(), 'fields'] } ) );
	} );

	constructor( private store: Store<AppState> ) { }

	ngOnInit() { }
	ngOnDestroy() { this.sub.unsubscribe(); this.sub = null; }

}
