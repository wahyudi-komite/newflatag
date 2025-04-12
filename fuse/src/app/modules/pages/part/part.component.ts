import {
    Component,
    inject,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { first, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.types';
import { GlobalVariable } from '../../../node/common/global-variable';
import { Paginate } from '../../../node/common/paginate';
import { SharedModule } from '../../../node/common/shared.module';
import { StatusEnumService } from '../../../node/common/status-enum.service';
import { Part } from '../../../node/part/part';
import { PartService } from '../../../node/part/part.service';
import { SearchInputComponent } from '../../comp/tabel/search-input/search-input.component';
import { PartDialogComponent } from './part-dialog/part-dialog.component';

@Component({
    selector: 'app-part',
    imports: [SharedModule, SearchInputComponent, ToastrModule],
    templateUrl: './part.component.html',
    styleUrl: './part.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class PartComponent implements OnInit {
    user: User;

    datas: Part[] = [];
    total!: number;
    page!: number;
    pageSize!: number;
    last_page!: number;
    find: string = '';
    limit: number = GlobalVariable.pageTake;
    tblName: string = 'part';
    form: FormGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    _service = inject(PartService);
    _userService = inject(UserService);
    statusService = inject(StatusEnumService);
    fb = inject(FormBuilder);
    private toastr = inject(ToastrService);
    readonly dialog = inject(MatDialog);

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        this.form = this.fb.group({
            // part_no: [''],
            // part_name: [''],
            // uniq: [''],
            // line: [''],
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

    applyFilter(value: string): void {
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

    getStatus(status: number): { text: string; color: string } {
        return this.statusService.getStatus(status);
    }

    openDialog(action: string, obj: any) {
        obj.action = action;
        let dialogBoxSettings = {
            position: { top: '10px' },
            width: '400px',
            margin: '0 auto',
            disableClose: true,
            hasBackdrop: true,
            data: obj,
        };

        const dialogRef = this.dialog.open(
            PartDialogComponent,
            dialogBoxSettings
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result.event == 'Add') {
                this.redirectToAdd(result.formValue);
            } else if (result.event == 'Update') {
                this.redirectToUpdate(result.data, result.formValue);
            } else if (result.event == 'Delete') {
                this.redirectToDelete(result.data.id);
            } else if (result.event == 'Upload') {
                this.load();
            }
        });
    }

    redirectToAdd(row_obj: any) {
        this._service
            .create(row_obj)
            .pipe(first())
            .subscribe(
                (res) => {
                    GlobalVariable.audioSuccess.play();
                    this.toastr.success('Updated', 'Store data success');
                    this.load();
                },
                (error) => {
                    this.errorNotif(error);
                }
            );
    }

    redirectToUpdate(data: any, formValue: any): void {
        this._service.update(data.id, formValue).subscribe(
            (res) => {
                GlobalVariable.audioSuccess.play();
                this.toastr.success('Success', 'Update data success');
                this.load();
            },
            (error) => {
                this.errorNotif(error);
            }
        );
    }

    redirectToDelete(row_obj: number) {
        this._service
            .delete(row_obj)
            .pipe(first())
            .subscribe(
                (res) => {
                    GlobalVariable.audioSuccess.play();
                    this.toastr.success('Deleted', 'Success remove data');
                    this.load();
                },
                (error) => {
                    this.errorNotif(error);
                }
            );
    }

    errorNotif(error: any) {
        GlobalVariable.audioFailed.play();
        this.toastr.error('Failed', error.error.message, {
            timeOut: 3000,
        });
    }

    // openDialogUpload(action: string, obj: any) {
    //     obj.action = action;
    //     let dialogBoxSettings = {
    //         position: { top: '10px' },
    //         width: '400px',
    //         margin: '0 auto',
    //         disableClose: true,
    //         hasBackdrop: true,
    //         data: obj,
    //     };

    //     const dialogRef = this.dialog.open(
    //         PartDialogUploadComponent,
    //         dialogBoxSettings
    //     );

    //     dialogRef.afterClosed().subscribe((result) => {
    //         console.log('upload');
    //     });
    // }
}
