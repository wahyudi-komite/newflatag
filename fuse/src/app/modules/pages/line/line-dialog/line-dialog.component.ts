import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExistingValidator } from '../../../../node/common/existing.validator';
import { ShareDialogModule } from '../../../../node/common/share-dialog.module';
import { Line } from '../../../../node/line/line';

@Component({
    selector: 'app-line-dialog',
    imports: [ShareDialogModule],
    templateUrl: './line-dialog.component.html',
    styleUrl: './line-dialog.component.scss',
})
export class LineDialogComponent implements OnInit {
    form!: FormGroup;
    action?: string;
    local_data: any;
    datas: Line[] = [];

    readonly dialogRef = inject(MatDialogRef<LineDialogComponent>);
    readonly data = inject<Line>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);
    private existingValidator = inject(ExistingValidator);

    ngOnInit(): void {
        this.local_data = { ...this.data };
        this.action = this.local_data.action;

        this.form = this.fb.group({
            name: [
                '',
                {
                    validators: [Validators.required, Validators.minLength(4)],
                    asyncValidators:
                        this.action == 'Add'
                            ? this.existingValidator.IsUnique('line', 'Add')
                            : this.existingValidator.IsUnique('line', 'Update'),
                },
            ],
            alias: [
                '',
                {
                    validators: [Validators.required, Validators.minLength(2)],
                    asyncValidators:
                        this.action == 'Add'
                            ? this.existingValidator.IsUnique('line', 'Add')
                            : this.existingValidator.IsUnique('line', 'Update'),
                },
            ],
            status: [
                this.local_data.role == 'user' ? 0 : '',
                [Validators.required],
            ],
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
}
