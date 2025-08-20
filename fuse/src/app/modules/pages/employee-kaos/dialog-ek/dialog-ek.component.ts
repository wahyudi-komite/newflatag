import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
    selector: 'app-dialog-ek',
    standalone: true,
    imports: [QRCodeComponent],
    templateUrl: './dialog-ek.component.html',
    styleUrl: './dialog-ek.component.scss',
})
export class DialogEKComponent implements OnInit {
    local_data: any;

    readonly data = inject<any>(MAT_DIALOG_DATA);

    ngOnInit(): void {
        this.local_data = { ...this.data };
    }
}
