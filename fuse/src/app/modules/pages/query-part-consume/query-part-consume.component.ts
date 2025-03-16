import { Component, inject, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.types';
import { GlobalVariable } from '../../../node/common/global-variable';
import { SharedModule } from '../../../node/common/shared.module';

@Component({
    selector: 'app-query-part-consume',
    imports: [SharedModule],
    templateUrl: './query-part-consume.component.html',
    styleUrl: './query-part-consume.component.scss',
})
export class QueryPartConsumeComponent implements OnInit {
    user: User;

    total!: number;
    page!: number;
    pageSize!: number;
    last_page!: number;
    find: string = '';
    limit: number = GlobalVariable.pageTake;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    private _userService = inject(UserService);

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        // this.load();
    }
}
