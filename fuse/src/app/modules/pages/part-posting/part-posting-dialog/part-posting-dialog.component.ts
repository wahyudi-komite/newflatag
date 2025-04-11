import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Area } from '../../../../node/area/area';
import { AreaService } from '../../../../node/area/area.service';
import { ExistingValidator } from '../../../../node/common/existing.validator';
import { ShareDialogModule } from '../../../../node/common/share-dialog.module';
import { Line } from '../../../../node/line/line';
import { Part } from '../../../../node/part/part';
import { PartService } from '../../../../node/part/part.service';
import { PartPosting } from '../../../../node/partPosting/part-posting';
import { PartPostingService } from '../../../../node/partPosting/part-posting.service';

@Component({
    selector: 'app-part-posting-dialog',
    imports: [ShareDialogModule],
    templateUrl: './part-posting-dialog.component.html',
    styleUrl: './part-posting-dialog.component.scss',
})
export class PartPostingDialogComponent implements OnInit {
    form!: FormGroup;
    action?: string;
    local_data: any;
    datas: PartPosting[] = [];
    selectStatus = [];

    area: Area[] = [];
    line: Line[] = [];
    part: Part[] = [];

    selectedFile: File | null = null;
    uploadProgress: number | null = null;
    insertedCount: number | null = null;
    errorMessage: string | null = null;
    isLoading: boolean = false;

    private _service = inject(PartPostingService);
    readonly dialogRef = inject(MatDialogRef<PartPostingDialogComponent>);
    readonly data = inject<PartPosting>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);
    private existingValidator = inject(ExistingValidator);
    areaService = inject(AreaService);
    partService = inject(PartService);

    ngOnInit(): void {
        this.local_data = { ...this.data };
        this.action = this.local_data.action;

        this.partService.getAll('part_no', 'ASC').subscribe((res) => {
            this.part = res;
        });

        this.areaService.getAll('alias', 'ASC').subscribe((res) => {
            this.area = res;
        });

        const asyncValidator = this.existingValidator.IsUnique(
            'part_posting',
            this.local_data.action,
            this.local_data.id
        );

        this.form = this.fb.group({
            part: [
                '',
                {
                    validators: [Validators.required],
                },
            ],
            area: [
                '',
                {
                    validators: [Validators.required],
                },
            ],
            uniq: [
                '',
                {
                    validators: [
                        Validators.required,
                        Validators.min(100),
                        Validators.max(999),
                        Validators.pattern('^[0-9]*$'),
                    ],
                },
            ],
            qty: [
                '',
                {
                    validators: [
                        Validators.required,
                        Validators.min(1),
                        Validators.pattern('^[0-9]*$'),
                    ],
                },
            ],
        });

        if (this.action != 'Add') {
            this.form.patchValue({
                part: this.local_data.part.id,
                area: this.local_data.area.id,
                uniq: this.local_data.uniq,
                qty: this.local_data.qty,
            });
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
