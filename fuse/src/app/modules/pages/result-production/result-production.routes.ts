import { Routes } from '@angular/router';
import { AuthGuard } from '../../../core/auth/guards/auth.guard';
import { UserRole } from '../../../node/common/user-role';
import { ResultProductionComponent } from './result-production.component';

export default [
    {
        path: '',
        component: ResultProductionComponent,
        canActivate: [AuthGuard],
        data: { role: [UserRole.Admin, UserRole.User] },
    },
] as Routes;
