import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PartService } from '../../../../node/part/part.service';

@Component({
    selector: 'app-part-dialog-upload',
    imports: [CommonModule, MatIconModule, MatDialogModule, MatButtonModule],
    templateUrl: './part-dialog-upload.component.html',
    styleUrl: './part-dialog-upload.component.scss',
})
export class PartDialogUploadComponent {
    selectedFile: File | null = null;
    uploadProgress: number | null = null;
    insertedCount: number | null = null;
    errorMessage: string | null = null;

    private _service = inject(PartService);

    onFileChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    uploadFile(): void {
        if (!this.selectedFile) return;

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        this.uploadProgress = 0;
        this.insertedCount = null;
        this.errorMessage = null;

        this._service.uploadExcel(formData).subscribe({
            next: (event) => {
                if (event.progress !== undefined) {
                    this.uploadProgress = event.progress; // Update progress
                } else if (event.insertedCount !== undefined) {
                    this.insertedCount = event.insertedCount; // Update jumlah insert
                    this.uploadProgress = null; // Sembunyikan progress setelah selesai
                    alert(
                        `Upload successful! ${this.insertedCount} records inserted.`
                    );
                }
            },
            error: (error) => {
                this.uploadProgress = null;
                this.errorMessage = error.message;
            },
        });
    }

    closeDialog() {
        // this.action = 'Cancel';
        // this.dialogRef.close({ event: 'Cancel' });
    }
}
