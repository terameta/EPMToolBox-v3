import { Component, OnInit } from '@angular/core';
import { FEATURE } from '../credentials.state';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UtilityService } from 'src/app/shared/utility.service';
import { map, distinctUntilChanged, combineLatest, tap, filter } from 'rxjs/operators';
import { JSONDeepCopy } from 'shared/utilities/utility.functions';
import { Conceal, Reveal } from '../credential.actions';
import { Credential } from '../credential.models';

@Component( {
	selector: 'app-credential-detail',
	templateUrl: './credential-detail.component.html',
	styleUrls: ['./credential-detail.component.scss']
} )
export class CredentialDetailComponent implements OnInit {
	public feature = FEATURE;
	public id$ = this.store.select( 'shared' ).pipe(
		map( rs => rs.currentID ),
		distinctUntilChanged()
	);
	public item$ = this.store.select( 'credentials' ).pipe(
		filter( s => s.loaded ),
		combineLatest( this.id$ ),
		filter( ( [s, id] ) => !!id && s.loaded && !!s.items[id] ),
		map( ( [s, id] ) => JSONDeepCopy( s.items[id] ) )
	);

	public isRevealed = false;


	constructor(
		private store: Store<AppState>,
		public us: UtilityService
	) { }

	ngOnInit() {
	}

	public reveal = ( item: Credential ) => {
		if ( this.isRevealed ) this.store.dispatch( new Conceal( item ) );
		if ( !this.isRevealed ) this.store.dispatch( new Reveal( item ) );
		this.isRevealed = !this.isRevealed;
	}

}
