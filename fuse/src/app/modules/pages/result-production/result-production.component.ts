import {
    Component,
    inject,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
    MatButtonToggleChange,
    MatButtonToggleModule,
} from '@angular/material/button-toggle';
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

@Component({
    selector: 'app-result-production',
    imports: [
        SharedModule,
        ToastrModule,
        MatDatepickerModule,
        MatButtonToggleModule,
    ],
    templateUrl: './result-production.component.html',
    styleUrl: './result-production.component.scss',
    encapsulation: ViewEncapsulation.None,
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
    tanggal = new Date().toISOString().slice(0, 10);
    lineId: string[] = ['5', '4', '3', '2', '1'];

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    private _userService = inject(UserService);
    _service = inject(QueryProductionService);
    _lineService = inject(LineService);
    fb = inject(FormBuilder);

    formFieldHelpers: string[] = [''];

    ngOnInit(): void {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        this._lineService.getAll('name', 'ASC').subscribe((res) => {
            this.line = res;
        });

        this.form = this.fb.group({
            formFieldHelpers: new FormControl(this.lineId),
            uniq: [''],
            start: [sevenDaysAgo.toISOString().slice(0, 10)],
            end: [this.tanggal],
        });

        this.dateRange = this.getDateRange(this.form.value.start, today);

        this.filterParams = {
            start: this.form.value.start,
            end: this.form.value.end,
        };
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
            .consumeResultProduction(
                page,
                this.limit,
                this.sort.active,
                this.sort.direction,
                this.find,
                this.filterParams
            )
            .subscribe((res: Paginate) => {
                console.log('Response:', res.data);

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
            uniq: this.form.value.uniq,
            start: this.form.value.start,
            end: this.form.value.end,
            line: this.lineId,
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
        this._service.exportExcelConsumeResultProduction(
            this.page,
            this.total,
            this.sort?.active,
            this.sort?.direction,
            this.find,
            this.filterParams
        );
    }

    onFilterChange(change: MatButtonToggleChange): void {
        this.lineId = change.value;
    }
}
