import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvironmentsComponent } from './environments/environments.component';
import { EnvironmentListComponent } from './environment-list/environment-list.component';
import { EnvironmentDetailComponent } from './environment-detail/environment-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
	{ path: '', component: EnvironmentListComponent },
	{ path: '0', redirectTo: '' },
	{ path: ':environmentid', component: EnvironmentDetailComponent }
];

@NgModule( {
	declarations: [EnvironmentsComponent, EnvironmentListComponent, EnvironmentDetailComponent],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		RouterModule.forChild( routes )
	]
} )
export class EnvironmentsModule { }
