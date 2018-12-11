import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { map, distinctUntilChanged, combineLatest } from 'rxjs/operators';
import { FEATURE as GFEATURE } from '../taggroups.state';
import { FEATURE as TFEATURE } from '../tags.state';
import { UtilityService } from 'src/app/shared/utility.service';

@Component( {
	selector: 'app-tag-list',
	templateUrl: './tag-list.component.html',
	styleUrls: ['./tag-list.component.scss']
} )
export class TagListComponent implements OnInit {
	public groupFeature = GFEATURE;
	public tagFeature = TFEATURE;

	public id$ = this.store.select( 'shared' ).pipe(
		map( rs => rs.currentID ),
		distinctUntilChanged()
	);
	public item$ = this.store.select( 'taggroups' ).pipe(
		combineLatest( this.id$ ),
		map( ( [tg, id] ) => ( { ...tg.items[id] } ) )
	);
	public tags$ = this.store.select( 'tags' ).pipe(
		combineLatest( this.id$ ),
		map( ( [ts, gid] ) => ts.ids.map( tid => ( { ...ts.items[tid] } ) ).filter( i => i.taggroup === gid ) )
	);

	constructor( private store: Store<AppState>, public us: UtilityService ) { }

	ngOnInit() { }

}
