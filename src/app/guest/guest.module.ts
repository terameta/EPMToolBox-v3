import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestComponent } from './guest/guest.component';
import { Routes, RouterModule } from '@angular/router';
import { FrontPageComponent } from './front-page/front-page.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
	{ path: '', component: FrontPageComponent, pathMatch: 'full' },
	{ path: 'sign-in', component: SignInComponent },
	{ path: 'sign-up', component: SignUpComponent }
];

@NgModule( {
	declarations: [
		GuestComponent,
		FrontPageComponent,
		SignInComponent,
		SignUpComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild( routes )
	]
} )
export class GuestModule { }
