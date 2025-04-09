import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExistingValidator } from '../../../../node/common/existing.validator';
import { ShareDialogModule } from '../../../../node/common/share-dialog.module';
import { StatusEnumService } from '../../../../node/common/status-enum.service';
import { Part } from '../../../../node/part/part';
import { PartService } from '../../../../node/part/part.service';

@Component({
    selector: 'app-part-dialog',
    imports: [ShareDialogModule, MatProgressBarModule],
    templateUrl: './part-dialog.component.html',
    styleUrl: './part-dialog.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class PartDialogComponent implements OnInit {
    form!: FormGroup;
    action?: string;
    local_data: any;
    datas: Part[] = [];
    selectStatus = [];

    selectedFile: File | null = null;
    uploadProgress: number | null = null;
    insertedCount: number | null = null;
    errorMessage: string | null = null;
    isLoading: boolean = false;

    private _service = inject(PartService);
    readonly dialogRef = inject(MatDialogRef<PartDialogComponent>);
    readonly data = inject<Part>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);
    private existingValidator = inject(ExistingValidator);
    statusEnumService = inject(StatusEnumService);

    ngOnInit(): void {
        this.selectStatus = this.statusEnumService.getselectStatus();

        this.local_data = { ...this.data };
        this.action = this.local_data.action;

        const asyncValidator = this.existingValidator.IsUnique(
            'part',
            this.local_data.action,
            this.local_data.id
        );

        this.form = this.fb.group({
            part_no: [
                '',
                {
                    validators: [Validators.required, Validators.minLength(11)],
                    asyncValidators: asyncValidator ? asyncValidator : [],
                },
            ],
            part_name: [
                '',
                {
                    validators: [Validators.required, Validators.minLength(4)],
                },
            ],
            supplier: [
                '',
                {
                    validators: [Validators.required, Validators.minLength(4)],
                },
            ],
            status: ['', [Validators.required]],
        });

        if (this.action != 'Add') {
            this.form.patchValue(this.local_data);
        }

        this.dialogRef.keydownEvents().subscribe((event) => {
            if (event.key === 'Escape') {
                this.closeDialog();
            }
        });

        this.dialogRef.backdropClick().subscribe((event) => {
            this.closeDialog();
        });
    }

    get f() {
        return this.form.controls;
    }

    doAction() {
        if (this.form.invalid) {
            return;
        }

        this.dialogRef.close({
            event: this.action,
            data: this.local_data,
            formValue: this.form.value,
        });
    }

    closeDialog() {
        this.action = 'Cancel';
        this.dialogRef.close({ event: 'Cancel' });
    }

    uploadClosedDialog() {
        this.action = 'Upload';
        this.dialogRef.close({ event: 'Upload' });
    }

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
        this.isLoading = true;

        this._service.uploadExcel(formData).subscribe({
            next: (event) => {
                if (event.progress !== undefined) {
                    this.uploadProgress = event.progress; // Update progress
                } else if (event.insertedCount !== undefined) {
                    this.insertedCount = event.insertedCount; // Update jumlah insert
                    this.uploadProgress = null;
                    this.isLoading = false;
                    this.selectedFile = null;
                    (
                        document.getElementById('fileInput') as HTMLInputElement
                    ).value = '';
                }
            },
            error: (error) => {
                this.uploadProgress = null;
                this.isLoading = false;
                this.errorMessage = error.message;
            },
        });
    }

    downloadTemplate() {
        this._service.downloadTemplate();
    }
}
