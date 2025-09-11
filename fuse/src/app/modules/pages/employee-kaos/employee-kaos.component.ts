import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { ToastrModule } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import * as XLSX from 'xlsx';
import { cleanFilters } from '../../../node/common/cleanFilters';
import { EmployeeKaos } from './employee-kaos';
import { EmployeeKaosService } from './employee-kaos.service';

interface Column {
    field: string;
    header: string;
    sortable: boolean;
}

@Component({
    selector: 'app-employee-kaos',
    standalone: true,
    imports: [
        CommonModule,
        ToastrModule,
        TableModule,
        InputTextModule,
        TagModule,
        SelectModule,
        MultiSelectModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
    ],
    templateUrl: './employee-kaos.component.html',
    styleUrl: './employee-kaos.component.scss',
})
export class EmployeeKaosComponent implements OnInit {
    datas: EmployeeKaos[] = [];
    cols!: any[];
    loading: boolean = true;
    globalFilter = '';
    searchValue: string | undefined;
    total: number = 0;
    // plantData!: any[];
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
    scanData = [
        { label: 'Blank', value: '0' },
        { label: 'OK', value: '1' },
        { label: 'PRINT', value: '2' },
    ];

    _service = inject(EmployeeKaosService);
    http = inject(HttpClient);

    ngOnInit() {
        this.cols = [
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
            {
                field: 'scan',
                header: 'scan',
                sortable: true,
                filter: true,
                filterType: 'select',
            },
            {
                field: 'scan_date',
                header: 'scan date',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'kaos_employee1',
                header: 'Kaos Employee',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'kaos_spouse1',
                header: 'Kaos Spouse',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'kaos_child1',
                header: 'Kaos Anak 1',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'kaos_child2',
                header: 'Kaos Anak 2',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'kaos_child3',
                header: 'Kaos Anak 3',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'kaos_child4',
                header: 'Kaos Anak 4',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'kaos_child5',
                header: 'Kaos Anak 5',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
            {
                field: 'kaos_child6',
                header: 'Kaos Anak 6',
                sortable: true,
                filter: true,
                filterType: 'text',
            },
        ];
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

    clear(table: Table) {
        table.clear();
        this.searchValue = '';
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

    exportExcel() {
        this.request.exportData = true;
        this._service.serverside(this.request).subscribe((data) => {
            // ambil kolom dari PrimeNG
            const exportColumns = this.cols.map((col) => ({
                title: col.header,
                dataKey: col.field,
            }));

            // mapping data sesuai urutan kolom
            const formatted = data.data.map((emp: any) => {
                return {
                    // ID: emp.id,
                    // Name: emp.name,
                    Scan: emp.scan === 0 ? '' : emp.scan === 1 ? 'OK' : 'Print',
                };
            });

            // atur ulang agar sesuai urutan kolom di tabel
            const ordered = formatted.map((row: any) => {
                const newRow: any = {};
                this.cols.forEach((col) => {
                    newRow[col.header] = row[col.header] ?? row[col.field];
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
}
