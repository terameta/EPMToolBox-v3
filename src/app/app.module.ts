import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { DemoModule } from './demo/demo.module';
import { Routes, RouterModule } from '@angular/router';
import { GuestComponent } from './guest/guest/guest.component';

const routes: Routes = [
	{ path: '', pathMatch: 'full', component: GuestComponent, loadChildren: './guest/guest.module#GuestModule' }
];

@NgModule( {
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		BrowserAnimationsModule,
		RouterModule.forRoot( routes ),
		DemoModule
	],
	providers: [],
	bootstrap: [AppComponent]
} )
export class AppModule { }
