import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TestComponent } from './test/test.component';

export default [
    {
        path: 'example',
        component: ExampleComponent,
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    // {
    //     path: 'example',
    //     component: ExampleComponent,
    // },
    {
        path: 'test',
        component: TestComponent,
    },
] as Routes;
