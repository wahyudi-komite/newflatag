import {
    Component,
    inject,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
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
import { StatusEnumService } from '../../../node/common/status-enum.service';
import { Line } from '../../../node/line/line';
import { LineService } from '../../../node/line/line.service';
import { QueryProduction } from '../../../node/query-production/query-production';
import { QueryProductionService } from '../../../node/query-production/query-production.service';
import { SearchInputComponent } from '../../comp/tabel/search-input/search-input.component';

@Component({
    selector: 'app-query-production',
    imports: [
        SharedModule,
        SearchInputComponent,
        ToastrModule,
        MatDatepickerModule,
    ],
    templateUrl: './query-production.component.html',
    styleUrl: './query-production.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class QueryProductionComponent implements OnInit {
    user: User;
    line: Line[] = [];

    datas: QueryProduction[] = [];
    total!: number;
    page!: number;
    pageSize!: number;
    last_page!: number;
    find: string = '';
    limit: number = GlobalVariable.pageTake;
    tblName: string = 'eg_out';
    form: FormGroup;

    shift?: string;
    filterParams: any = {};

    tanggal = new Date().toISOString().slice(0, 10);

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    _service = inject(QueryProductionService);
    _userService = inject(UserService);
    _lineService = inject(LineService);
    statusService = inject(StatusEnumService);
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
            shift: [''],
            line: [''],
            area: [''],
            uniq: [''],
            eg: [''],
            working: [''],
            end: [''],
        });
        this.load();
    }

    load(
        page: number = 1,
        limit: number = 10,
        sort: { active: string; direction: 'asc' | 'desc' } = {
            active: 'create',
            direction: 'asc',
        },
        find?: string
    ): void {
        this._service
            .all(
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

    exportToExcel(): void {
        this._service.exportExcel(
            this.page,
            this.total,
            this.sort?.active,
            this.sort?.direction,
            this.find,
            this.filterParams
        );
    }

    submit() {
        const formValues = {
            eg: this.form.value.eg,
            uniq: this.form.value.uniq,
            line: this.form.value.line,
            shift: this.form.value.shift,

            working: this.form.value.working,
        };
        this.filterParams = formValues;
        this.load();
    }

    getStatus(status: number): { text: string; color: string } {
        return this.statusService.getStatus(status);
    }
}
