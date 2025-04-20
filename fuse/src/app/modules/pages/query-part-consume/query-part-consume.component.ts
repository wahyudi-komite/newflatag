import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.types';
import { GlobalVariable } from '../../../node/common/global-variable';
import { Paginate } from '../../../node/common/paginate';
import { SharedModule } from '../../../node/common/shared.module';
import { PartPostingService } from '../../../node/partPosting/part-posting.service';
import { SearchInputComponent } from '../../comp/tabel/search-input/search-input.component';

@Component({
    selector: 'app-query-part-consume',
    imports: [SharedModule, SearchInputComponent],
    templateUrl: './query-part-consume.component.html',
    styleUrl: './query-part-consume.component.scss',
})
export class QueryPartConsumeComponent implements OnInit {
    user: User;

    datas: any[] = [];

    total!: number;
    page!: number;
    pageSize!: number;
    last_page!: number;
    find: string = '';
    limit: number = GlobalVariable.pageTake;
    tblName: string = 'part_posting';
    form: FormGroup;

    filterParams: any = {};

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    private _userService = inject(UserService);
    _service = inject(PartPostingService);

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        this.load();
    }

    load(
        page: number = 1,
        limit: number = 10,
        sort: { active: string; direction: 'asc' | 'desc' } = {
            active: 'created_at',
            direction: 'asc',
        },
        find?: string
    ): void {
        this._service
            .consumeQuery(
                page,
                this.limit,
                this.sort.active,
                this.sort.direction,
                this.find,
                this.filterParams
            )
            .subscribe((res: Paginate) => {
                this.datas = res.data;
                console.log(res.data);

                // this.total = res.meta.total;
                // this.page = res.meta.page;
                // this.pageSize = res.meta.pageSize;
                // this.last_page = res.meta.last_page;
            });
    }

    sortData(sort: Sort) {
        this.load();
    }

    applyFilter(value: string) {
        this.find = value;
        this.load();
    }

    changeLimit(limit: number): void {
        this.limit = limit;
        this.load();
    }
}
