import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalNotificationComponent } from './modal-notification/modal-notification.component';

@NgModule( {
	declarations: [
		ModalNotificationComponent
	],
	imports: [
		CommonModule,
		ModalModule
	],
	exports: [
		ModalNotificationComponent
	]
} )
export class NotificationModule { }
