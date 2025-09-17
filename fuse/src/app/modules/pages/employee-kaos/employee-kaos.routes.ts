import { Routes } from '@angular/router';
import { AuthGuard } from '../../../core/auth/guards/auth.guard';
import { UserRole } from '../../../node/common/user-role';
import { EmployeeKaosComponent } from './employee-kaos.component';

export default [
    {
        path: '',
        component: EmployeeKaosComponent,
        canActivate: [AuthGuard],
        data: {
            stateAccess: 'dashboard',
            role: [UserRole.Admin, UserRole.User],
        },
    },
] as Routes;
