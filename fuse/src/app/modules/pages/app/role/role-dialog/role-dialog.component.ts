import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Permission } from '../../../../../node/app/permission/permission';
import { Role } from '../../../../../node/app/role/role';
import { ExistingValidator } from '../../../../../node/common/existing.validator';

@Component({
    selector: 'app-role-dialog',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogContent,
        MatDialogActions,
        MatIconModule,
    ],
    templateUrl: './role-dialog.component.html',
    styleUrl: './role-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleDialogComponent implements OnInit {
    form!: FormGroup;
    action?: string;
    local_data: any;
    permissions: Permission[] = [];

    readonly dialogRef = inject(MatDialogRef<RoleDialogComponent>);
    readonly data = inject<Role>(MAT_DIALOG_DATA);
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
                            ? this.existingValidator.IsUnique('Role', 'Add')
                            : this.existingValidator.IsUnique('Role', 'Update'),
                },
            ],
            permissions: this.fb.array([]),
        });

        this.dialogRef.keydownEvents().subscribe((event) => {
            if (event.key === 'Escape') {
                this.closeDialog();
            }
        });

        this.dialogRef.backdropClick().subscribe((event) => {
            this.closeDialog();
        });
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
