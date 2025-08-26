import { Routes } from '@angular/router';

export default [
    {
        path: 'merchandise',
        loadChildren: () => import('./employee-kaos/employee-kaos.routes'),
    },
    {
        path: 'merchandise-print',
        loadChildren: () =>
            import('./employee-kaos/dialog-ek/dialog-ek.routes'),
    },
    {
        path: 'scan',
        loadChildren: () => import('./scan-data/scan-data.routes'),
    },
    {
        path: 'server-side',
        loadChildren: () => import('./server-side/serverSide.routes'),
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
