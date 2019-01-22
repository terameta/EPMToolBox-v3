import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { PromptComponent } from './prompt/prompt.component';
import { FormsModule } from '@angular/forms';
import { TagSelectorComponent } from './tag-selector/tag-selector.component';
import { CoderComponent } from './coder/coder.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { HpdbMemberSelectorComponent } from './hpdb-member-selector/hpdb-member-selector.component';

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
		CoderComponent,
		HpdbMemberSelectorComponent
	],
	exports: [
		TagSelectorComponent
	],
	entryComponents: [
		CoderComponent,
		ConfirmComponent,
		HpdbMemberSelectorComponent,
		PromptComponent
	]
} )
export class SharedModule { }
