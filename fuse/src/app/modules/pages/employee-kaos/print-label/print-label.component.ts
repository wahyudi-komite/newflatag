import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { QrCodeComponent } from 'ng-qrcode';

@Component({
    selector: 'app-print-label',
    standalone: true,
    imports: [QrCodeComponent, CommonModule],
    templateUrl: './print-label.component.html',
    styleUrl: './print-label.component.scss',
})
export class PrintLabelComponent {
    @Input() datas: any;

    data: any;

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnChanges() {
        if (this.datas) {
            this.data = { ...this.datas };
            this.cdr.detectChanges(); // paksa refresh view
        }
    }
}
