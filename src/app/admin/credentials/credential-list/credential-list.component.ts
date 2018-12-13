import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UtilityService } from 'src/app/shared/utility.service';
import { FEATURE } from '../credentials.state';
import { SharedService } from 'src/app/shared/shared.service';

@Component( {
	selector: 'app-credential-list',
	templateUrl: './credential-list.component.html',
	styleUrls: ['./credential-list.component.scss']
} )
export class CredentialListComponent implements OnInit {
	public feature = FEATURE;
	public state$ = this.store.select( 'credentials' );

	constructor( private store: Store<AppState>, public us: UtilityService, public ss: SharedService ) { }

	ngOnInit() { }

}
