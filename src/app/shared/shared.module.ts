import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { PromptComponent } from './prompt/prompt.component';
import { FormsModule } from '@angular/forms';
import { TagSelectorComponent } from './tag-selector/tag-selector.component';

@NgModule( {
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		ConfirmComponent,
		PromptComponent,
		TagSelectorComponent
	],
	exports: [
		TagSelectorComponent
	],
	entryComponents: [
		ConfirmComponent,
		PromptComponent
	]
} )
export class SharedModule { }
