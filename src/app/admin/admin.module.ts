import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontPageComponent } from './front-page/front-page.component';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TagsComponent } from './tags/tags/tags.component';
import { TagsToolBarComponent } from './tags/tags-tool-bar/tags-tool-bar.component';

const routes: Routes = [
	{ path: '', component: FrontPageComponent },
	{ path: 'tags', component: TagsComponent, loadChildren: './tags/tags.module#TagsModule' }
];

@NgModule( {
	declarations: [FrontPageComponent, AdminComponent, NavbarComponent, TagsToolBarComponent],
	imports: [
		CommonModule,
		FormsModule,
		BsDropdownModule,
		ProgressbarModule,
		RouterModule.forChild( routes )
	]
} )
export class AdminModule { }
