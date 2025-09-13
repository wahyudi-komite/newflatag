/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

const menu: FuseNavigationItem[] = [
    {
        id: 'merchandise',
        title: 'Query',
        type: 'basic',
        icon: 'heroicons_outline:queue-list',
        link: '/merchandise',
    },
    {
        id: 'scan',
        title: 'Sto Print',
        type: 'basic',
        icon: 'heroicons_outline:qr-code',
        link: '/scan',
    },
    // {
    //     id: 'scan',
    //     title: 'Sto Vendor',
    //     type: 'basic',
    //     icon: 'heroicons_outline:qr-code',
    //     link: '/scan',
    // },
    // {
    //     id: 'scan',
    //     title: 'Sto Receive',
    //     type: 'basic',
    //     icon: 'heroicons_outline:qr-code',
    //     link: '/scan',
    // },
    {
        id: 'permission',
        title: 'Role',
        type: 'basic',
        icon: 'heroicons_outline:qr-code',
        link: '/permission',
    },
];
export const defaultNavigation: FuseNavigationItem[] = menu;

export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
    {
        id: 'test',
        title: 'Test',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example/test',
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const horizontalNavigation: FuseNavigationItem[] = menu;
