import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    NgZone,
    OnInit,
} from '@angular/core';
import {
    FormArray,
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
import { PermissionService } from '../../../../../node/app/permission/permission.service';
import { Role } from '../../../../../node/app/role/role';
import { RoleService } from '../../../../../node/app/role/role.service';
import { ExistingValidator } from '../../../../../node/common/existing.validator';

@Component({
    selector: 'app-role-dialog',
    imports: [
        CommonModule,
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
    permissionService = inject(PermissionService);
    roleService = inject(RoleService);
    private ngZone = inject(NgZone);

    constructor(private cdr: ChangeDetectorRef) {}

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

        this.permissionService
            .getAll('name', 'ASC')
            .subscribe((permissions: any) => {
                this.permissions = permissions;
                this.permissions.forEach((p) => {
                    this.permissionArray.push(
                        this.fb.group({
                            value: false,
                            id: p.id,
                        })
                    );
                });
            });

        this.cdr.detectChanges();

        if (this.action != 'Add') {
            this.roleService.get(this.local_data.id).subscribe((role: Role) => {
                const values = this.permissions.map((p: any) => {
                    return {
                        value: this.local_data.permissions.some(
                            (r: any) => r.id === p.id
                        ),
                        id: p.id,
                    };
                });

                this.form.patchValue({
                    name: this.local_data.name,
                    // permissions: values,
                });
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

    get permissionArray(): FormArray {
        return this.form.get('permissions') as FormArray;
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
