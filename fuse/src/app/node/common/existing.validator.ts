import { inject, Injectable } from '@angular/core';
import {
    AbstractControl,
    AsyncValidatorFn,
    FormGroup,
    ValidationErrors,
} from '@angular/forms';
import { debounceTime, map, Observable, of } from 'rxjs';
import { PermissionService } from '../app/permission/permission.service';
import { RoleService } from '../app/role/role.service';
import { LineService } from '../line/line.service';

@Injectable({
    providedIn: 'root',
})
export class ExistingValidator {
    private roleService = inject(RoleService);
    private permissionService = inject(PermissionService);
    private lineService = inject(LineService);

    IsUnique(table: string, method: string) {
        switch (table) {
            case 'Permission':
                return this.ValidatePermission(method);
                break;
            case 'Role':
                return this.ValidateRole(method);
                break;
                // case 'User':
                //     return this.ValidateUser(method);
                break;
            case 'line':
                return this.ValidateLine(method);
                break;
            // case 'Plant':
            //   return this.ValidatePlant(method);
            //   break;
            // case 'Division':
            //   return this.ValidateDivision(method);
            //   break;

            // case 'Position':
            //   return this.ValidatePosition(method);
            //   break;
            default:
                return false;
        }
    }

    // Database Table Permission
    ValidatePermission(method: string): AsyncValidatorFn {
        const oldValue: any[] = [];
        return (
            control: AbstractControl
        ): Observable<ValidationErrors | null> => {
            const inputValue: string = control.value.toString();
            const key: any = this.getName(control);
            oldValue.push(inputValue);
            if (!control.dirty || !control.value || control.value.length === 0)
                return of(null);

            return this.permissionService
                .findOne({ [key]: control.value })
                .pipe(
                    debounceTime(500),
                    map((res) => {
                        if (res && method === 'Update') {
                            var field = res[key];
                            if (field != oldValue[0]) {
                                return { alreadyExists: true };
                            } else {
                                return null;
                            }
                        } else if (res && method === 'Add') {
                            return { alreadyExists: true };
                        } else {
                            return null;
                        }
                    })
                );
        };
    }

    // Database Table Role
    ValidateRole(method: string): AsyncValidatorFn {
        const oldValue: any[] = [];
        return (
            control: AbstractControl
        ): Observable<ValidationErrors | null> => {
            const inputValue: string = control.value.toString();
            const key: any = this.getName(control);
            oldValue.push(inputValue);
            if (!control.dirty || !control.value || control.value.length === 0)
                return of(null);

            return this.roleService.findOne({ [key]: control.value }).pipe(
                debounceTime(500),
                map((res) => {
                    if (res && method === 'Update') {
                        var field = res[key];
                        if (field != oldValue[0]) {
                            return { alreadyExists: true };
                        } else {
                            return null;
                        }
                    } else if (res && method === 'Add') {
                        return { alreadyExists: true };
                    } else {
                        return null;
                    }
                })
            );
        };
    }

    // Database Table line
    ValidateLine(method: string): AsyncValidatorFn {
        const oldValue: any[] = [];
        return (
            control: AbstractControl
        ): Observable<ValidationErrors | null> => {
            const inputValue: string = control.value.toString();
            const key: any = this.getName(control);
            oldValue.push(inputValue);
            if (!control.dirty || !control.value || control.value.length === 0)
                return of(null);

            return this.lineService.findOne({ [key]: control.value }).pipe(
                debounceTime(500),
                map((res) => {
                    if (res && method === 'Update') {
                        var field = res[key];
                        if (field != oldValue[0]) {
                            return { alreadyExists: true };
                        } else {
                            return null;
                        }
                    } else if (res && method === 'Add') {
                        return { alreadyExists: true };
                    } else {
                        return null;
                    }
                })
            );
        };
    }

    // Database Table User
    // ValidateUser(method: string): AsyncValidatorFn {
    //     const oldValue: any[] = [];
    //     return (
    //         control: AbstractControl
    //     ): Observable<ValidationErrors | null> => {
    //         const inputValue: string = control.value.toString();
    //         const key: any = this.getName(control);
    //         oldValue.push(inputValue);
    //         if (!control.dirty || !control.value || control.value.length === 0)
    //             return of(null);

    //         return this.userService.findOne({ [key]: control.value }).pipe(
    //             debounceTime(500),
    //             map((res) => {
    //                 if (res && method === 'Update') {
    //                     var field = res[key];
    //                     console.log(oldValue[0]);
    //                     if (field != oldValue[0]) {
    //                         return { alreadyExists: true };
    //                     } else {
    //                         return null;
    //                     }
    //                 } else if (res && method === 'Add') {
    //                     return { alreadyExists: true };
    //                 } else {
    //                     return null;
    //                 }
    //             })
    //         );
    //     };
    // }

    private getName(control: AbstractControl): string | null {
        let group = <FormGroup>control.parent;

        if (!group) {
            return null;
        }

        let name: string = '';

        Object.keys(group.controls).forEach((key) => {
            let childControl = group.get(key);

            if (childControl !== control) {
                return;
            }

            name = key;
        });

        return name;
    }
}
