import { Routes } from '@angular/router';

export default [
    {
        path: 'merchandise',
        loadChildren: () => import('./employee-kaos/employee-kaos.routes'),
    },
    // admin routes
    {
        path: 'role',
        loadChildren: () => import('./app/role/role.routes'),
    },
    {
        path: 'permission',
        loadChildren: () => import('./app/permission/permission.routes'),
    },
] as Routes;
