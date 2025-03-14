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
import { AreaService } from '../area/area.service';
import { LineService } from '../line/line.service';

interface BaseService {
    findOne(query: any): Observable<any>;
}

@Injectable({
    providedIn: 'root',
})
export class ExistingValidator {
    private roleService = inject(RoleService);
    private permissionService = inject(PermissionService);
    private lineService = inject(LineService);
    private areaService = inject(AreaService);

    IsUnique(table: string, method: string) {
        switch (table) {
            case 'Permission':
                return this.ValidateEntity(this.permissionService, method);
                break;
            case 'Role':
                return this.ValidateEntity(this.roleService, method);
                break;
                // case 'User':
                //     return this.ValidateUser(method);
                break;
            case 'line':
                return this.ValidateEntity(this.lineService, method);
                break;
            case 'area':
                return this.ValidateEntity(this.areaService, method);
                break;
            default:
                return false;
        }
    }

    ValidateEntity<T extends BaseService>(
        service: T,
        method: string
    ): AsyncValidatorFn {
        return (
            control: AbstractControl
        ): Observable<ValidationErrors | null> => {
            const oldValue: string[] = [];
            const inputValue: string = control.value?.toString();
            const key: string = this.getName(control);

            oldValue.push(inputValue);
            if (!control.dirty || !control.value || control.value.length === 0)
                return of(null);

            return service.findOne({ [key]: control.value }).pipe(
                debounceTime(500),
                map((res) => {
                    if (res && method === 'Update') {
                        console.log(res[key].trim().toLowerCase());
                        console.log(oldValue[0].trim().toLowerCase());
                        console.log(
                            res[key].trim().toLowerCase() !==
                                oldValue[0].trim().toLowerCase()
                        );

                        console.log(res[key] !== oldValue[0]);

                        return res[key] !== oldValue[0]
                            ? { alreadyExists: true }
                            : null;
                    }
                    return res && method === 'Add'
                        ? { alreadyExists: true }
                        : null;
                })
            );
        };
    }

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
