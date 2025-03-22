import { Routes } from '@angular/router';

export default [
    {
        path: 'line',
        loadChildren: () =>
            import('./line/line.module').then((m) => m.LineModule),
    },
    {
        path: 'area',
        loadChildren: () =>
            import('./area/area.module').then((m) => m.AreaModule),
    },
    // {
    //     path: 'machine',
    //     loadChildren: () =>
    //         import('./machine/machine.module').then((m) => m.MachineModule),
    // },
    {
        path: 'part',
        loadChildren: () => import('./part/part.routes'),
    },
    {
        path: 'part-posting',
        loadChildren: () => import('./part-posting/part-posting.routes'),
    },
    {
        path: 'query-production',
        loadChildren: () =>
            import('./query-production/query-production.routes'),
    },
    {
        path: 'part-consume',
        loadChildren: () =>
            import('./query-part-consume/query-part-consume.routes'),
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
