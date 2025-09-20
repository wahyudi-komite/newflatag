import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
    map,
    Observable,
    ReplaySubject,
    Subject,
    switchMap,
    take,
    takeUntil,
    tap,
} from 'rxjs';
import { UserService } from '../user/user.service';
import { User } from '../user/user.types';
import { Navigation } from './navigation.types';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    user: User;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private _navigation: ReplaySubject<Navigation> =
        new ReplaySubject<Navigation>(1);
    private _unsubscribeAll: Subject<any> = new Subject<any>();
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
    //     get(): Observable<Navigation> {
    //         return this._httpClient.get<Navigation>('api/common/navigation').pipe(
    //             tap((navigation) => {
    // this._userService.user$..pipe(takeUntil(this._unsubscribeAll))..subscribe((user: User) => {
    //                 this.user = user;

    //             });
    //                 Object.keys(navigation).forEach((layout) => {
    //                     navigation[layout] = navigation[layout].filter((item) =>
    //                         item.meta.roles.includes(this.user.role.name)
    //                     );
    //                 });
    //                 this._navigation.next(navigation);
    //             })
    //         );
    //     }
    //     private _unsubscribeAll(_unsubscribeAll: any): any {
    //         throw new Error('Method not implemented.');
    //     }

    get(): Observable<Navigation> {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            switchMap((navigation) =>
                this._userService.user$.pipe(
                    take(1),
                    map((user: User) => {
                        const filteredNavigation = { ...navigation };
                        Object.keys(filteredNavigation).forEach((layout) => {
                            filteredNavigation[layout] = filteredNavigation[
                                layout
                            ].filter((item) =>
                                item.meta?.roles?.includes(user?.role?.name)
                            );
                        });
                        return filteredNavigation;
                    }),
                    tap((filteredNavigation) => {
                        this._navigation.next(filteredNavigation);
                    })
                )
            ),
            takeUntil(this._unsubscribeAll)
        );
    }
}
