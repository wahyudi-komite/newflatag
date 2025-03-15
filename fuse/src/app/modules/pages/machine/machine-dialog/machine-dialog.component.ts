import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Area } from '../../../../node/area/area';
import { AreaService } from '../../../../node/area/area.service';
import { ExistingValidator } from '../../../../node/common/existing.validator';
import { ShareDialogModule } from '../../../../node/common/share-dialog.module';
import { StatusEnumService } from '../../../../node/common/status-enum.service';
import { Line } from '../../../../node/line/line';
import { LineService } from '../../../../node/line/line.service';
import { Machine } from '../../../../node/machine/machine';

@Component({
    selector: 'app-machine-dialog',
    imports: [ShareDialogModule],
    templateUrl: './machine-dialog.component.html',
    styleUrl: './machine-dialog.component.scss',
})
export class MachineDialogComponent implements OnInit {
    form!: FormGroup;
    action?: string;
    local_data: any;
    datas: Machine[] = [];
    selectStatus = [];

    area: Area[] = [];
    line: Line[] = [];

    readonly dialogRef = inject(MatDialogRef<MachineDialogComponent>);
    readonly data = inject<Machine>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);
    private existingValidator = inject(ExistingValidator);
    statusEnumService = inject(StatusEnumService);
    areaService = inject(AreaService);
    lineService = inject(LineService);

    ngOnInit(): void {
        this.selectStatus = this.statusEnumService.getselectStatus();

        this.local_data = { ...this.data };
        this.action = this.local_data.action;

        this.areaService.getAll('name', 'ASC').subscribe((res) => {
            this.area = res;
        });

        this.lineService.getAll('name', 'ASC').subscribe((res) => {
            this.line = res;
        });

        const asyncValidator = this.existingValidator.IsUnique(
            'machine',
            this.local_data.action,
            this.local_data.id
        );

        this.form = this.fb.group({
            machine_no: [
                '',
                {
                    validators: [
                        Validators.required,
                        Validators.min(1),
                        Validators.max(1000),
                        Validators.pattern('^[0-9]*$'),
                    ],
                    asyncValidators: asyncValidator ? asyncValidator : [],
                },
            ],
            machine_name: [
                '',
                {
                    validators: [Validators.required, Validators.minLength(4)],
                    asyncValidators: asyncValidator ? asyncValidator : [],
                },
            ],
            area_id: ['', [Validators.required]],
            line_id: ['', [Validators.required]],
            status: ['', [Validators.required]],
        });

        if (this.action != 'Add') {
            this.form.patchValue({
                machine_no: this.local_data.machine_no,
                machine_name: this.local_data.machine_name,
                area_id: this.local_data.area.id,
                line_id: this.local_data.line.id,
                status: this.local_data.status,
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
