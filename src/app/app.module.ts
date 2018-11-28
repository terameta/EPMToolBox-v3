import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { GuestComponent } from './guest/guest/guest.component';
import { StoreModule } from '@ngrx/store';
import { AppReducer } from './app.reducer';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/auth.effects';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NotificationModule } from './notification/notification.module';
import { SharedEffects } from './shared/shared.effects';
import { RouterEffects } from './shared/router.effects';
import { AdminComponent } from './admin/admin/admin.component';
import { InterestEffects } from './shared/interest.effects';
import { TagEffects } from './admin/tags/tag.effects';

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
		StoreModule.forRoot( AppReducer ),
		EffectsModule.forRoot( [AuthEffects, InterestEffects, RouterEffects, SharedEffects, TagEffects] ),
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
