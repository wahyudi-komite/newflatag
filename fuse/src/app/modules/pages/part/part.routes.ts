import { Routes } from '@angular/router';
import { AuthGuard } from '../../../core/auth/guards/auth.guard';
import { UserRole } from '../../../node/common/user-role';
import { PartComponent } from './part.component';

export default [
    {
        path: '',
        component: PartComponent,
        canActivate: [AuthGuard],
        data: { role: [UserRole.Admin, UserRole.User] },
    },
] as Routes;
