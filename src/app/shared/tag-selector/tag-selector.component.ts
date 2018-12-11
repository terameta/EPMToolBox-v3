import { Component, OnInit, Input } from '@angular/core';
import { Tag } from 'src/app/admin/tags/tag.models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { map } from 'rxjs/operators';

@Component( {
	selector: 'app-tag-selector',
	templateUrl: './tag-selector.component.html',
	styleUrls: ['./tag-selector.component.scss']
} )
export class TagSelectorComponent implements OnInit {
	@Input() tags: Tag[] = [];
	public availableTags$ = this.store.select( 'tags' ).pipe( map( s => s.ids.map( id => s.items[id] ) ) );
	public availableGroups$ = this.store.select( 'taggroups' ).pipe( map( s => s.ids.map( id => s.items[id] ) ) );

	constructor(
		private store: Store<AppState>
	) { }

	ngOnInit() {
	}

}
