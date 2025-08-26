import { Routes } from '@angular/router';
import { AuthGuard } from '../../../core/auth/guards/auth.guard';
import { UserRole } from '../../../node/common/user-role';
import { ServerSideComponent } from './server-side.component';

export default [
    {
        path: '',
        component: ServerSideComponent,
        canActivate: [AuthGuard],
        data: { role: [UserRole.Admin, UserRole.User] },
    },
] as Routes;
