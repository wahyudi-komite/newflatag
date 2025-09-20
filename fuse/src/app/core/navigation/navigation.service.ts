import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { UserService } from '../user/user.service';
import { Navigation } from './navigation.types';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private _navigation: ReplaySubject<Navigation> =
        new ReplaySubject<Navigation>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            })
        );
    }

    // get(): Observable<Navigation> {
    //     return combineLatest([
    //         this._httpClient.get<Navigation>('api/common/navigation'),
    //         this._userService.user$,
    //     ]).pipe(
    //         map(([navigation, user]) => {
    //             // Kalau user belum ada, tampilkan navigation apa adanya
    //             if (!user) {
    //                 return navigation;
    //             }

    //             const role = user.role.name;

    //             const filterByRole = (items: FuseNavigationItem[] = []) =>
    //                 items.filter(
    //                     (item) =>
    //                         !item.meta?.roles ||
    //                         item.meta.roles.includes('admin')
    //                 );

    //             return {
    //                 compact: filterByRole(navigation.compact),
    //                 default: filterByRole(navigation.default),
    //                 futuristic: filterByRole(navigation.futuristic),
    //                 horizontal: filterByRole(navigation.horizontal),
    //             };
    //         }),
    //         tap((filtered) => this._navigation.next(filtered))
    //     );
    // }
}
