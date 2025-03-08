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
    }, // Tambahkan rute modul.
] as Routes;
