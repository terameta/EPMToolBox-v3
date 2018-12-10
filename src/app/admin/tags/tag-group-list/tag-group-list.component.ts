import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UtilityService } from 'src/app/shared/utility.service';
import { FEATURE } from '../taggroups.state';

@Component( {
	selector: 'app-tag-group-list',
	templateUrl: './tag-group-list.component.html',
	styleUrls: ['./tag-group-list.component.scss']
} )
export class TagGroupListComponent implements OnInit {
	public feature = FEATURE;
	public state$ = this.store.select( 'taggroups' );

	constructor(
		private store: Store<AppState>,
		public us: UtilityService
	) { }

	ngOnInit() { }

}
