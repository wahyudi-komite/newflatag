import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { saveAs } from 'file-saver';
import { CountUpModule } from 'ngx-countup';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import * as XLSX from 'xlsx';
import { cleanFilters } from '../../../node/common/cleanFilters';
import { GlobalVariable } from '../../../node/common/global-variable';
import { EmployeeKaos } from '../employee-kaos/employee-kaos';
import { EmployeeKaosService } from '../employee-kaos/employee-kaos.service';

@Component({
    selector: 'app-scan-data',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule,
        TableModule,
        InputTextModule,
        TagModule,
        SelectModule,
        MultiSelectModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        TooltipModule,
        MatIconModule,
        CountUpModule,
    ],
    templateUrl: './scan-data.component.html',
    styleUrl: './scan-data.component.scss',
})
export class ScanDataComponent implements OnInit {
    form!: FormGroup;
    datas: EmployeeKaos[] = [];
    cols!: any[];
    loading: boolean = true;
    globalFilter = '';
    searchValue: string | undefined;
    total: number = 0;
    data: any;
    selectedDatas: any[] = [];
    request: any = {};
    plantData = [
        { label: 'P1', value: 'P1' },
        { label: 'P2', value: 'P2' },
        { label: 'P3', value: 'P3' },
        { label: 'P4', value: 'P4' },
        { label: 'P5', value: 'P5' },
        { label: 'PC', value: 'PC' },
        { label: 'HO', value: 'HO' },
    ];
    scanData = [
        { label: 'Blank', value: '0' },
        { label: 'OK', value: '1' },
        { label: 'PRINT', value: '2' },
    ];

    statusData = [
        { label: 'P', value: 'P' },
        { label: 'C', value: 'C' },
    ];
    terminatedData = [
        { label: 'YES', value: 'YES' },
        { label: 'NO', value: 'NO' },
    ];
    genderData = [
        { label: 'M', value: 'M' },
        { label: 'F', value: 'F' },
    ];

    shiftData = [
        { label: 'NON SHIFT', value: 'NON SHIFT' },
        { label: 'SHIFT A', value: 'SHIFT A' },
        { label: 'SHIFT B', value: 'SHIFT B' },
    ];
    expatriatData = [
        { label: 'Expatriate', value: 'Expatriate' },
        { label: 'Local', value: 'Local' },
    ];
    counts: { [key: string]: number } = {};
    totalCounts = 0;

    @ViewChild('scan', { static: false }) scan!: ElementRef;

    private fb = inject(FormBuilder);
    private toastr = inject(ToastrService);
    private _service = inject(EmployeeKaosService);

    ngOnInit(): void {
        this.form = this.fb.group({
            scan: ['', [Validators.required]],
        });
        this.cols = [
            {
                field: 'scan',
                header: 'Scan STO',
                sortable: true,
                filter: true,
                filterType: 'select',
            },
            {
                field: 'scan_date',
                header: 'Scan STO Date',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'id',
                header: 'NPK',
                sortable: true,
                filter: true,
                filterType: 'numeric',
            },
            {
                field: 'name',
                header: 'Name',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'divisi',
                header: 'Division',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'department',
                header: 'Departement',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'section',
                header: 'Section',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'shift',
                header: 'Shift',
                sortable: true,
                filter: true,
                filterType: 'select',
            },
            {
                field: 'plant',
                header: 'plant',
                sortable: true,
                filter: true,
                filterType: 'select',
            },
            {
                field: 'status',
                header: 'status',
                sortable: true,
                filter: true,
                filterType: 'select',
            },
            {
                field: 'terminated',
                header: 'terminated',
                sortable: true,
                filter: true,
                filterType: 'select',
            },
            {
                field: 'gender',
                header: 'gender',
                sortable: true,
                filter: true,
                filterType: 'select',
            },
            {
                field: 'family_stats',
                header: 'family Status',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'no_wa',
                header: 'whatsapp',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'souvenir',
                header: 'souvenir',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
        ];
        this.getCount();
    }
    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }
    exportExcel() {
        this.request.exportData = true;
        this._service.serverside(this.request).subscribe((data) => {
            // ambil kolom dari PrimeNG
            const exportColumns = this.cols.map((col) => ({
                title: col.header,
                dataKey: col.field,
            }));

            // atur ulang agar sesuai urutan kolom di tabel
            const ordered = data.data.map((row: any) => {
                const newRow: any = {};
                this.cols.forEach((col) => {
                    let value = row[col.field];

                    // jika kolom scan, format pakai displayText
                    if (col.field === 'scan') {
                        value = this.displayText(value);
                    }

                    if (col.field === 'scan_date') {
                        value = value !== '1970-01-01 07:00:00' ? value : '';
                    }

                    newRow[col.header] = value;
                });
                return newRow;
            });

            // convert JSON → worksheet
            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ordered);
            const workbook: XLSX.WorkBook = {
                Sheets: { data: worksheet },
                SheetNames: ['data'],
            };

            // export Excel
            const excelBuffer: any = XLSX.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });

            const file = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            saveAs(file, 'flatag_export.xlsx');
        });
    }

    errorNotif(error: any) {
        const message = error?.error?.message || 'Unknown error';

        if (message.toLowerCase().includes('print')) {
            GlobalVariable.audioInfo.play();
            this.toastr.info(message, 'Info', {
                timeOut: 5000,
                positionClass: 'toast-bottom-center',
            });
        } else {
            GlobalVariable.audioFailed.play();
            this.toastr.error(message, 'Failed', {
                timeOut: 5000,
                positionClass: 'toast-bottom-center',
            });
        }
    }

    setFocus() {
        this.scan.nativeElement.focus();
    }

    resetForm() {
        this.form.reset();
        this.form.markAsUntouched();
        this.form.markAsPristine();
        this.setFocus();
    }
    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this._service.updateScan(this.form.getRawValue()).subscribe(
            (res) => {
                GlobalVariable.audioSuccess.play();
                this.toastr.success('Success', res.id + ' ' + res.name, {
                    timeOut: 2000,
                    positionClass: 'toast-bottom-center',
                });
                this.form.reset();

                this.form.markAsUntouched();
                this.form.markAsPristine();
                this.setFocus();
                this.load();
                this.getCount();
            },
            (error) => {
                this.errorNotif(error);
            }
        );
    }

    getCount(): void {
        const where = { scan: 1 };
        this.plantData.forEach((plant) => {
            this.totalCounts = 0;
            this._service.getCount(plant.value, where).subscribe((res) => {
                this.counts[plant.value] = res.count;
                this.totalCounts += res.count;
            });
        });
    }

    loadLazy($event: TableLazyLoadEvent) {
        this.request.globalFilter = $event.globalFilter || '';
        this.request.sortField = $event.sortField || '';
        this.request.sortOrder = $event.sortOrder || 'DESC';
        this.request.first = $event.first || 0;
        this.request.rows = $event.rows;

        this.request.filters = cleanFilters($event.filters);
        this._service.serverside(this.request).subscribe((res) => {
            this.datas = res.data;
            this.total = res.meta.total;
            this.loading = false;
        });
    }

    load() {
        this._service.serverside(this.request).subscribe((res) => {
            this.datas = res.data;
            this.total = res.meta.total;
            this.loading = false;
        });
    }
    clear(table: Table) {
        table.clear();
        this.searchValue = '';
    }

    onRowSelect(event: any) {
        // console.log('✅ Row selected:', event.data);
        // console.log('📌 All selected rows:', this.selectedDatas);
    }

    onRowUnselect(event: any) {
        // console.log('❌ Row unselected:', event.data);
        // console.log('📌 All selected rows:', this.selectedDatas);
    }

    onHeaderToggle(event: any) {
        // console.log('Header checkbox toggled:', event.checked);
        // console.log('All selected rows:', this.selectedDatas);
    }

    displayLabel(label: string | number | null | undefined): string {
        switch (label) {
            case 'YES':
                return 'danger';

            case 'NO':
                return 'success';

            case 'C':
                return 'info';

            case 'P':
                return 'success';

            case 'M':
                return 'warn';

            case 'F':
                return 'info';
            case 0:
                return 'success';
            case 1:
                return 'success';
            case 2:
                return 'info';
            case 'NON SHIFT':
                return 'secondary';
            case 'SHIFT A':
                return 'warn';
            case 'SHIFT B':
                return 'info';
            case 'Local':
                return 'secondary';
            case 'Expatriate':
                return 'info';

            case '':
                return null;
        }
    }

    displayText(label: string | number | null | undefined): string {
        switch (label) {
            case 0:
                return '';
            case 1:
                return 'OK';
            case 2:
                return 'PRINT';

            case '':
                return null;
        }
    }
}
