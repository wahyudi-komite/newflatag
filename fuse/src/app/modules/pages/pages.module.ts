import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogEKComponent } from './employee-kaos/dialog-ek/dialog-ek.component';
import { PrintLabelComponent } from './employee-kaos/print-label/print-label.component';
import { ScanDataComponent } from './scan-data/scan-data.component';
import { ServerSideComponent } from './server-side/server-side.component';



@NgModule({
  declarations: [
    DialogEKComponent,
    PrintLabelComponent,
    ScanDataComponent,
    ServerSideComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PagesModule { }
