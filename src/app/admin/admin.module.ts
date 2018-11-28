import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontPageComponent } from './front-page/front-page.component';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

const routes: Routes = [
	{ path: '', component: FrontPageComponent }
];

@NgModule( {
	declarations: [FrontPageComponent, AdminComponent, NavbarComponent],
	imports: [
		CommonModule,
		FormsModule,
		BsDropdownModule,
		RouterModule.forChild( routes )
	]
} )
export class AdminModule { }
