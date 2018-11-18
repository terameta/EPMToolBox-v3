import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { DemoModule } from './demo/demo.module';
import { Routes, RouterModule } from '@angular/router';
import { GuestComponent } from './guest/guest/guest.component';
import { StoreModule } from '@ngrx/store';
import { AppReducer } from './app.reducer';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { MatButtonModule } from '@angular/material';

const routes: Routes = [
	{ path: '', component: GuestComponent, loadChildren: './guest/guest.module#GuestModule' }
];

@NgModule( {
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		BrowserAnimationsModule,
		StoreModule.forRoot( AppReducer ),
		RouterModule.forRoot( routes ),
		StoreRouterConnectingModule.forRoot(),
		MatButtonModule,
		DemoModule
	],
	providers: [],
	bootstrap: [AppComponent]
} )
export class AppModule { }
