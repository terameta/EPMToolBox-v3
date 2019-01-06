import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamsComponent } from './streams/streams.component';
import { StreamDetailComponent } from './stream-detail/stream-detail.component';
import { StreamListComponent } from './stream-list/stream-list.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { StreamDefinitionsComponent } from './stream-definitions/stream-definitions.component';
import { StreamFieldsComponent } from './stream-fields/stream-fields.component';
import { StreamFielddescriptionsComponent } from './stream-fielddescriptions/stream-fielddescriptions.component';
import { StreamExportsComponent } from './stream-exports/stream-exports.component';

const routes: Routes = [
	{ path: '', component: StreamListComponent },
	{ path: '0', redirectTo: '' },
	{
		path: ':streamid', component: StreamDetailComponent, children: [
			{ path: '', redirectTo: 'definitions', pathMatch: 'prefix' },
			{ path: 'definitions', component: StreamDefinitionsComponent },
			{ path: 'fields', component: StreamFieldsComponent },
			{ path: 'fielddescriptions', component: StreamFielddescriptionsComponent },
			{ path: 'exports', component: StreamExportsComponent }
		]
	}
];

@NgModule( {
	declarations: [StreamsComponent, StreamDetailComponent, StreamListComponent, StreamDefinitionsComponent, StreamFieldsComponent, StreamFielddescriptionsComponent, StreamExportsComponent],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		RouterModule.forChild( routes )
	]
} )
export class StreamsModule { }
