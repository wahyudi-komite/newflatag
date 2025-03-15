import { Routes } from '@angular/router';
import { AuthGuard } from '../../../core/auth/guards/auth.guard';
import { UserRole } from '../../../node/common/user-role';
import { PartPostingComponent } from './part-posting.component';

export default [
    {
        path: '',
        component: PartPostingComponent,
        canActivate: [AuthGuard],
        data: { role: [UserRole.Admin, UserRole.User] },
    },
] as Routes;
