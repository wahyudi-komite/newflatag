import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Area } from '../../../../node/area/area';
import { ExistingValidator } from '../../../../node/common/existing.validator';
import { ShareDialogModule } from '../../../../node/common/share-dialog.module';
import { StatusEnumService } from '../../../../node/common/status-enum.service';
import { LineService } from '../../../../node/line/line.service';

@Component({
    selector: 'app-area-dialog',
    imports: [ShareDialogModule],
    templateUrl: './area-dialog.component.html',
    styleUrl: './area-dialog.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class AreaDialogComponent implements OnInit {
    form!: FormGroup;
    action?: string;
    local_data: any;
    datas: Area[] = [];
    selectStatus = [];
    selectLine = [];
    selectArea = [
        { id: 1, name: 'Sub-Assy' },
        { id: 2, name: 'Partial Line' },
        { id: 3, name: 'Main Line' },
    ];

    readonly dialogRef = inject(MatDialogRef<AreaDialogComponent>);
    readonly data = inject<Area>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);
    private existingValidator = inject(ExistingValidator);
    statusEnumService = inject(StatusEnumService);
    private lineService = inject(LineService);

    ngOnInit(): void {
        this.selectStatus = this.statusEnumService.getselectStatus();

        this.local_data = { ...this.data };

        this.action = this.local_data.action;

        this.lineService.getAll('name', 'ASC').subscribe((res) => {
            this.selectLine = res;
            console.log('selectLine', this.selectLine);
        });

        const asyncValidator = this.existingValidator.IsUnique(
            'area',
            this.local_data.action,
            this.local_data.id
        );

        this.form = this.fb.group({
            name: [
                { value: '', disabled: true },
                ,
                { validators: [Validators.required] },
            ],
            line: [
                { value: '', disabled: true },
                { validators: [Validators.required] },
            ],
            alias: [
                { value: '', disabled: true },
                ,
                {
                    validators: [Validators.required, Validators.minLength(2)],
                    asyncValidators: asyncValidator ? asyncValidator : [],
                },
            ],
            status: ['', [Validators.required]],
        });

        if (this.action != 'Add') {
            this.form.patchValue({
                line: this.local_data.line.id,
                alias: this.local_data.alias,
                status: this.local_data.status,
                name: Number(this.local_data.id.toString().slice(-1)),
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
}
