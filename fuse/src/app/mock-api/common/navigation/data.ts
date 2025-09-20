/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

const menu: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:queue-list',
        link: '/dashboard',
        meta: { roles: ['admin'] },
    },
    {
        id: 'scan',
        title: 'Sto Print',
        type: 'basic',
        icon: 'heroicons_outline:qr-code',
        link: '/scan',
        meta: { roles: ['admin'] },
    },
    {
        id: 'scan-vendor',
        title: 'Sto Vendor',
        type: 'basic',
        icon: 'heroicons_outline:qr-code',
        link: '/scan-vendor',
        meta: { roles: ['supplier', 'admin'] },
    },
    {
        id: 'scan-plant',
        title: 'Sto Plant',
        type: 'basic',
        icon: 'heroicons_outline:qr-code',
        link: '/scan-plant',
        meta: { roles: ['user'] },
    },
];
export const defaultNavigation: FuseNavigationItem[] = menu;
export const compactNavigation: FuseNavigationItem[] = menu;
export const futuristicNavigation: FuseNavigationItem[] = menu;
export const horizontalNavigation: FuseNavigationItem[] = menu;
