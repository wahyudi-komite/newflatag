import { Routes } from '@angular/router';
import { AuthGuard } from '../../../core/auth/guards/auth.guard';
import { UserRole } from '../../../node/common/user-role';
import { ScanDataComponent } from './scan-data.component';

export default [
    {
        path: '',
        component: ScanDataComponent,
        canActivate: [AuthGuard],
        data: { role: [UserRole.Admin, UserRole.User] },
    },
] as Routes;
