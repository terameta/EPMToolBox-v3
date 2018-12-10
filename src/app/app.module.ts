import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { GuestComponent } from './guest/guest/guest.component';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NotificationModule } from './notification/notification.module';
import { AdminComponent } from './admin/admin/admin.component';
import { AppReducer, AppMetaReducer } from './app.reducer';
import { AppEffects } from './app.effects';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
	{ path: '', component: GuestComponent, loadChildren: './guest/guest.module#GuestModule' },
	{ path: 'admin', component: AdminComponent, loadChildren: './admin/admin.module#AdminModule' }
];

export function tokenGetter() {
	return localStorage.getItem( 'token' );
}

@NgModule( {
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		SharedModule,
		StoreModule.forRoot( AppReducer, { metaReducers: AppMetaReducer } ),
		EffectsModule.forRoot( AppEffects ),
		RouterModule.forRoot( routes ),
		StoreRouterConnectingModule.forRoot(),
		JwtModule.forRoot( { config: { tokenGetter } } ),
		ModalModule.forRoot(),
		ProgressbarModule.forRoot(),
		BsDropdownModule.forRoot(),
		NotificationModule
	],
	providers: [],
	bootstrap: [AppComponent]
} )
export class AppModule { }
