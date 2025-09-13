import { Routes } from '@angular/router';
import { AuthGuard } from '../../../core/auth/guards/auth.guard';
import { UserRole } from '../../../node/common/user-role';
import { EmployeeKaosComponent } from './employee-kaos.component';
import { state } from '@angular/animations';

export default [
    {
        path: '',
        component: EmployeeKaosComponent,
        canActivate: [AuthGuard],
        data: { role: [UserRole.Admin, UserRole.User, UserRole.Supplier], state:'dashboard' },
    },
] as Routes;
