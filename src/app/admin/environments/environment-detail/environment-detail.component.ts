import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UtilityService } from 'src/app/shared/utility.service';
import { FEATURE } from '../environments.state';
import { map, distinctUntilChanged, filter, combineLatest } from 'rxjs/operators';
import { JSONDeepCopy, EnumToArray } from 'shared/utilities/utility.functions';
import { EnvironmentType, getTypeDescription, Environment } from 'shared/models/environments.models';
import { Verify } from '../environments.actions';

@Component( {
	selector: 'app-environment-detail',
	templateUrl: './environment-detail.component.html',
	styleUrls: ['./environment-detail.component.scss']
} )
export class EnvironmentDetailComponent implements OnInit {
	public types = EnumToArray( EnvironmentType );
	public environmentTypes = EnvironmentType;
	public feature = FEATURE;
	public typeDescription = getTypeDescription;
	public id$ = this.store.select( 'shared' ).pipe( map( rs => rs.currentID ), distinctUntilChanged() );
	public item$ = this.store.select( 'environments' ).pipe(
		combineLatest( this.id$ ),
		filter( ( [s, id] ) => !!id && s.loaded && !!s.items[id] ),
		map( ( [s, id] ) => JSONDeepCopy( s.items[id] ) )
	);
	public credentials$ = this.store.select( 'credentials' ).pipe( map( s => s.ids.map( id => s.items[id] ) ) );

	constructor( private store: Store<AppState>, public us: UtilityService ) { }

	ngOnInit() { }

	public verify = ( payload: Environment ) => {
		this.store.dispatch( new Verify( payload ) );
	}

}
