import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogEKComponent } from './employee-kaos/dialog-ek/dialog-ek.component';
import { PrintLabelComponent } from './employee-kaos/print-label/print-label.component';



@NgModule({
  declarations: [
    DialogEKComponent,
    PrintLabelComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PagesModule { }
