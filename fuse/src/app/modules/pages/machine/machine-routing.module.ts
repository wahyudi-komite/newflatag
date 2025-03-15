import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../core/auth/guards/auth.guard';
import { UserRole } from '../../../node/common/user-role';
import { MachineComponent } from './machine.component';

const routes: Routes = [
    {
        path: '',
        component: MachineComponent,
        canActivate: [AuthGuard],
        data: { role: [UserRole.Admin] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MachineRoutingModule {}
