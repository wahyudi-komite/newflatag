import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Area } from '../../../../node/area/area';
import { ExistingValidator } from '../../../../node/common/existing.validator';
import { ShareDialogModule } from '../../../../node/common/share-dialog.module';
import { Line } from '../../../../node/line/line';
import { Machine } from '../../../../node/machine/machine';
import { MachineService } from '../../../../node/machine/machine.service';
import { Part } from '../../../../node/part/part';
import { PartService } from '../../../../node/part/part.service';
import { PartPosting } from '../../../../node/partPosting/part-posting';

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
    machine: Machine[] = [];
    part: Part[] = [];

    readonly dialogRef = inject(MatDialogRef<PartPostingDialogComponent>);
    readonly data = inject<PartPosting>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);
    private existingValidator = inject(ExistingValidator);
    machineService = inject(MachineService);
    partService = inject(PartService);

    ngOnInit(): void {
        this.local_data = { ...this.data };
        this.action = this.local_data.action;

        this.partService.getAll('part_no', 'ASC').subscribe((res) => {
            this.part = res;
        });

        this.machineService.getAll('machine_no', 'ASC').subscribe((res) => {
            this.machine = res;
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
            machine: [
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
                machine: Number(this.local_data.machine.id),
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
}
