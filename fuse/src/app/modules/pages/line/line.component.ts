import { CommonModule, DatePipe } from '@angular/common';
import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.types';
import { GlobalVariable } from '../../../node/common/global-variable';
import { Paginate } from '../../../node/common/paginate';
import { Line } from '../../../node/line/line';
import { LineService } from '../../../node/line/line.service';
import { PaginateTakeComponent } from '../../shared/paginate-take/paginate-take.component';
import { PaginateComponent } from '../../shared/paginate/paginate.component';
import { LINE_TITLES } from './line-column-title';

@Component({
    selector: 'app-line',
    standalone: true,
    imports: [
        CommonModule,
        MatSortModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        PaginateComponent,
        PaginateTakeComponent,
    ],
    templateUrl: './line.component.html',
    styleUrl: './line.component.scss',
    providers: [DatePipe],
    encapsulation: ViewEncapsulation.None,
})
export class LineComponent implements OnInit {
    user: User;

    datas: Line[] = [];
    total!: number;
    page!: number;
    pageSize!: number;
    last_page!: number;
    find: string = '';
    limit: number = GlobalVariable.pageTake;
    tblName: string = 'line';
    form: FormGroup;

    columnTitles = LINE_TITLES;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    _service = inject(LineService);
    _userService = inject(UserService);
    fb = inject(FormBuilder);

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        this.form = this.fb.group({
            // eg: [''],
            // uniq: [''],
            // start: [this.tanggalMulai],
            // end: [this.tanggalEnd],
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
            .all(
                page,
                this.limit,
                this.sort.active,
                this.sort.direction,
                this.find
            )
            .subscribe((res: Paginate) => {
                console.log(res);

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

    applyFilter(event: Event) {
        this.find = (event.target as HTMLInputElement).value;
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
            this.find
        );
    }

    submit() {
        // this.start = this.form.value.start;
        // this.end = this.form.value.end;
        // this.eg = this.form.value.eg;
        // this.uniq = this.form.value.uniq;
        this.load();
    }
}
