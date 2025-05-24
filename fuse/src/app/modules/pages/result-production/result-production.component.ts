import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrModule } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.types';
import { GlobalVariable } from '../../../node/common/global-variable';
import { Paginate } from '../../../node/common/paginate';
import { SharedModule } from '../../../node/common/shared.module';
import { Line } from '../../../node/line/line';
import { LineService } from '../../../node/line/line.service';
import { QueryProductionService } from '../../../node/query-production/query-production.service';
import { SearchInputComponent } from '../../comp/tabel/search-input/search-input.component';

@Component({
    selector: 'app-result-production',
    imports: [
        SharedModule,
        SearchInputComponent,
        ToastrModule,
        MatDatepickerModule,
    ],
    templateUrl: './result-production.component.html',
    styleUrl: './result-production.component.scss',
})
export class ResultProductionComponent implements OnInit {
    user: User;
    line: Line[] = [];

    datas: any[] = [];

    total!: number;
    page!: number;
    pageSize!: number;
    last_page!: number;
    find: string = '';
    limit: number = GlobalVariable.pageTake;
    tblName: string = 'eg_out';
    form: FormGroup;
    filterParams: any = {};
    dateRange: Date[] = [];

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    private _userService = inject(UserService);
    _service = inject(QueryProductionService);
    _lineService = inject(LineService);
    fb = inject(FormBuilder);

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
        this._lineService.getAll('name', 'ASC').subscribe((res) => {
            this.line = res;
        });

        this.form = this.fb.group({
            working: [],
            line: [5],
            part_no: [''],
            part_name: [''],
            supplier: [''],
            start: [],
            end: [],
        });
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
            .consumeResultProduction(
                page,
                this.limit,
                this.sort.active,
                this.sort.direction,
                this.find,
                this.filterParams
            )
            .subscribe((res: Paginate) => {
                this.datas = res.data;
                this.total = res.meta.total;
                this.page = res.meta.page;
                this.pageSize = res.meta.pageSize;
                this.last_page = res.meta.last_page;
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

    submit() {
        const startD = new Date(this.form.value.start);
        const endD = new Date(this.form.value.end);

        if (!isNaN(startD.getTime()) && !isNaN(endD.getTime())) {
            this.dateRange = this.getDateRange(startD, endD);
        } else {
            console.error('Start or end date is invalid');
            return;
        }

        const formValues = {
            line: this.form.value.line,
            part_no: this.form.value.part_no,
            part_name: this.form.value.part_name,
            supplier: this.form.value.supplier,
            start: this.form.value.start,
            end: this.form.value.end,
        };

        this.filterParams = formValues;
        this.load();
    }

    getDateRange(start: Date, end: Date): Date[] {
        const dateArray: Date[] = [];
        const currentDate = new Date(start);

        while (currentDate <= end) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateArray;
    }

    getDateKey(date: Date, shift: 'day' | 'night'): string {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}_${shift}`;
    }

    exportToExcel(): void {
        this._service.exportExcelConsumeQuery(
            this.page,
            this.total,
            this.sort?.active,
            this.sort?.direction,
            this.find,
            this.filterParams
        );
    }
}
