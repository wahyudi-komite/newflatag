import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StatusEnumService {
    getStatus(status: number): { text: string; color: string } {
        switch (status) {
            case 0:
                return { text: 'OK', color: 'bg-teal-800' };
            case 1:
                return { text: 'DISABLE', color: 'bg-yellow-500' };
            case 2:
                return { text: 'DELETE', color: 'bg-red-500' };
            default:
                return { text: 'Unknown', color: 'bg-gray-500' };
        }
    }
}
