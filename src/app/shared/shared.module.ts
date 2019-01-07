import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { PromptComponent } from './prompt/prompt.component';
import { FormsModule } from '@angular/forms';
import { TagSelectorComponent } from './tag-selector/tag-selector.component';
import { CoderComponent } from './coder/coder.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		MonacoEditorModule
	],
	declarations: [
		ConfirmComponent,
		PromptComponent,
		TagSelectorComponent,
		CoderComponent
	],
	exports: [
		TagSelectorComponent
	],
	entryComponents: [
		CoderComponent,
		ConfirmComponent,
		PromptComponent
	]
} )
export class SharedModule { }
