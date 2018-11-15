import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoComponent } from './demo/demo.component';
import { FormsModule } from '@angular/forms';
import { AppMaterialModule } from './demo.app.material.module';

@NgModule( {
	declarations: [DemoComponent],
	imports: [
		CommonModule,
		FormsModule,
		AppMaterialModule
	], exports: [DemoComponent]
} )
export class DemoModule { }
