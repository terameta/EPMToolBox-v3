import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsComponent } from './tags/tags.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TagGroupListComponent } from './tag-group-list/tag-group-list.component';

const routes: Routes = [
	{ path: '', component: TagGroupListComponent },
	{ path: '0', redirectTo: '' },
	{ path: ':taggroupid', component: TagListComponent }
];

@NgModule( {
	declarations: [TagsComponent, TagListComponent, TagGroupListComponent],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( routes )
	]
} )
export class TagsModule { }
