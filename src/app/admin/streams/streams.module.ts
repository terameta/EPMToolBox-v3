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
import { StreamFieldsHpdbComponent } from './stream-fields-hpdb/stream-fields-hpdb.component';
import { StreamFieldsRdbtComponent } from './stream-fields-rdbt/stream-fields-rdbt.component';
import { StreamFielddescriptionsHpdbComponent } from './stream-fielddescriptions-hpdb/stream-fielddescriptions-hpdb.component';
import { StreamFielddescriptionsRdbtComponent } from './stream-fielddescriptions-rdbt/stream-fielddescriptions-rdbt.component';
import { StreamFielddescriptionsRouterComponent } from './stream-fielddescriptions-router/stream-fielddescriptions-router.component';
import { StreamFielddescriptionsRedirectorComponent } from './stream-fielddescriptions-redirector/stream-fielddescriptions-redirector.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

const routes: Routes = [
	{ path: '', component: StreamListComponent },
	{ path: '0', redirectTo: '' },
	{
		path: ':streamid', component: StreamDetailComponent, children: [
			{ path: '', redirectTo: 'definitions', pathMatch: 'prefix' },
			{ path: 'definitions', component: StreamDefinitionsComponent },
			{ path: 'fields', component: StreamFieldsComponent },
			{
				path: 'fielddescriptions', component: StreamFielddescriptionsComponent, children: [
					{ path: '', component: StreamFielddescriptionsRedirectorComponent },
					{ path: ':fieldname', component: StreamFielddescriptionsRouterComponent }
				]
			},
			{ path: 'exports', component: StreamExportsComponent }
		]
	}
];

@NgModule( {
	declarations: [
		StreamsComponent,
		StreamDetailComponent,
		StreamListComponent,
		StreamDefinitionsComponent,
		StreamFieldsComponent,
		StreamFielddescriptionsComponent,
		StreamExportsComponent,
		StreamFieldsHpdbComponent,
		StreamFieldsRdbtComponent,
		StreamFielddescriptionsHpdbComponent,
		StreamFielddescriptionsRdbtComponent,
		StreamFielddescriptionsRouterComponent,
		StreamFielddescriptionsRedirectorComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		TypeaheadModule,
		RouterModule.forChild( routes )
	]
} )
export class StreamsModule { }
