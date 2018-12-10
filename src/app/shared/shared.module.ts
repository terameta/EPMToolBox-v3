import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { PromptComponent } from './prompt/prompt.component';
import { FormsModule } from '@angular/forms';

@NgModule( {
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		ConfirmComponent,
		PromptComponent
	],
	entryComponents: [
		ConfirmComponent,
		PromptComponent
	]
} )
export class SharedModule { }
