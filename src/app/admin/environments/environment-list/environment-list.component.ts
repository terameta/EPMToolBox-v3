import { Component, OnInit } from '@angular/core';
import { FEATURE } from '../environments.state';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UtilityService } from 'src/app/shared/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { map } from 'rxjs/operators';
import { EnvironmentType, Environment } from 'shared/models/environments.models';
import { Verify } from '../environments.actions';

@Component( {
	selector: 'app-environment-list',
	templateUrl: './environment-list.component.html',
	styleUrls: ['./environment-list.component.scss']
} )
export class EnvironmentListComponent implements OnInit {
	public feature = FEATURE;
	public state$ = this.store.select( 'environments' );
	public types = EnvironmentType;
	public credentials$ = this.store.select( 'credentials' ).pipe( map( s => s.items ) );

	constructor( private store: Store<AppState>, public us: UtilityService, public ss: SharedService ) { }

	ngOnInit() { }

	public verify = ( payload: Environment ) => {
		this.store.dispatch( new Verify( payload ) );
	}

}
