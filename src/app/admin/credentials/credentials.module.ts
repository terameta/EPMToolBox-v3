import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialsComponent } from './credentials/credentials.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CredentialListComponent } from './credential-list/credential-list.component';
import { CredentialDetailComponent } from './credential-detail/credential-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
	{ path: '', component: CredentialListComponent },
	{ path: ':credentialid', component: CredentialDetailComponent }
];

@NgModule( {
	declarations: [CredentialsComponent, CredentialListComponent, CredentialDetailComponent],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		RouterModule.forChild( routes )
	]
} )
export class CredentialsModule { }
