import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Area } from '../../../../node/area/area';
import { ExistingValidator } from '../../../../node/common/existing.validator';
import { ShareDialogModule } from '../../../../node/common/share-dialog.module';
import { StatusEnumService } from '../../../../node/common/status-enum.service';

@Component({
    selector: 'app-area-dialog',
    imports: [ShareDialogModule],
    templateUrl: './area-dialog.component.html',
    styleUrl: './area-dialog.component.scss',
})
export class AreaDialogComponent implements OnInit {
    form!: FormGroup;
    action?: string;
    local_data: any;
    datas: Area[] = [];
    selectStatus = [];

    readonly dialogRef = inject(MatDialogRef<AreaDialogComponent>);
    readonly data = inject<Area>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);
    private existingValidator = inject(ExistingValidator);
    statusEnumService = inject(StatusEnumService);

    ngOnInit(): void {
        this.selectStatus = this.statusEnumService.getselectStatus();

        this.local_data = { ...this.data };
        this.action = this.local_data.action;

        this.form = this.fb.group({
            name: [
                '',
                {
                    validators: [Validators.required, Validators.minLength(4)],
                    asyncValidators:
                        this.action == 'Add'
                            ? this.existingValidator.IsUnique('area', 'Add')
                            : this.existingValidator.IsUnique('area', 'Update'),
                },
            ],
            alias: [
                '',
                {
                    validators: [Validators.required, Validators.minLength(2)],
                    asyncValidators:
                        this.action == 'Add'
                            ? this.existingValidator.IsUnique('area', 'Add')
                            : this.existingValidator.IsUnique('area', 'Update'),
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
}
