import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../core/auth/guards/auth.guard';
import { LineComponent } from './line.component';

const routes: Routes = [
    {
        path: '',
        component: LineComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LineRoutingModule {}
