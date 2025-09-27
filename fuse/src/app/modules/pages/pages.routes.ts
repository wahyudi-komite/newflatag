import { Routes } from '@angular/router';

export default [
    {
        path: 'dashboard',
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
        path: 'scan-plant',
        loadChildren: () => import('./scan-plant/scan-plant.routes'),
    },
    {
        path: 'scan-vendor',
        loadChildren: () => import('./scan-vendor/scan-vendor.routes'),
    },

    // admin routes
    {
        path: 'role',
        loadChildren: () => import('./app/admin/role/role.routes'),
    },
    {
        path: 'permission',
        loadChildren: () => import('./app/permission/permission.routes'),
    },
    {
        path: 'profile',
        loadChildren: () => import('../pages/app/profile/profile.routes'),
    },
] as Routes;
