import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, RowModelType } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { GlobalVariable } from '../../../node/common/global-variable';
import { ServerSideService } from './server-side.service';

@Component({
    selector: 'app-server-side',
    standalone: true,
    imports: [CommonModule, AgGridModule],
    templateUrl: './server-side.component.html',
    styleUrl: './server-side.component.scss',
})
export class ServerSideComponent implements OnInit {
    private gridApi!: GridApi;
    isLoading = true;
    params: any;
    isRowSelected = false;
    data: any;
    singleData: boolean = true;

    gridOptions: GridOptions;
    serverSideDatasource: ServerSideService;

    public columnDefs: ColDef[] = [
        { field: 'id' },
        { field: 'name' },
        { field: 'divisi' },
        { field: 'department' },
        { field: 'plant' },
        { field: 'dlong', headerName: 'Dewasa Panjang' },
        { field: 'dshort', headerName: 'Dewasa Pendek' },
        { field: 'clong', headerName: 'Anak Panjang' },
        { field: 'cshort', headerName: 'Anak Pendek' },
        { field: 'status' },
        { field: 'gender' },
        { field: 'family_stats' },
        { field: 'no_wa' },
        { field: 'kaos_employee1' },
        { field: 'kaos_spouse1' },
        { field: 'kaos_child1' },
        { field: 'kaos_child2' },
        { field: 'kaos_child3' },
        { field: 'kaos_child4' },
        { field: 'kaos_child5' },
        { field: 'kaos_child6' },
        { field: 'souvenir' },
        {
            field: 'scan',
            cellRenderer: (params: any) => {
                return params.value === 1 ? 'Yes' : '';
            },
        },
        {
            field: 'scan_date',
            cellRenderer: (params: any) => {
                return params.value === '01-01-1970 07:00:00'
                    ? ''
                    : params.value;
            },
        },
        { field: 'created_at' },
        { field: 'updated_at' },
    ];

    public rowData: any[] = [];
    public defaultColDef: ColDef = {
        resizable: true,
        sortable: true,
        filter: true,
    };
    rowModelType: RowModelType = 'serverSide';
    paginationPageSize = 20;
    cacheBlockSize = 10;
    // rowData!: IOlympicDataWithId[];

    readonly dialog = inject(MatDialog);
    private toastr = inject(ToastrService);

    constructor(private myDataService: ServerSideService) {
        this.serverSideDatasource = this.myDataService;
    }

    ngOnInit() {
        this.gridOptions = {
            rowModelType: 'serverSide',
            pagination: true,
            paginationPageSize: 10,
            cacheBlockSize: 10,
            // ... other grid options like column definitions
        };
    }

    // onGridReady(params: GridReadyEvent) {
    //     const datasource: IServerSideDatasource = {
    //         getRows: (dsParams: IServerSideGetRowsParams) => {
    //             const startRow = dsParams.request.startRow;
    //             const endRow = dsParams.request.endRow;

    //             this.http
    //                 .get<any>(
    //                     `http://localhost:3000/employee-kaos/server-side?startRow=${startRow}&endRow=${endRow}`
    //                 )
    //                 .subscribe((data) => {
    //                     dsParams.success({
    //                         rowData: data.rows,
    //                         rowCount: data.lastRow,
    //                     });
    //                 });
    //         },
    //     };
    // }

    errorNotif(error: any) {
        GlobalVariable.audioFailed.play();
        this.toastr.error('Failed', error.error.message, {
            timeOut: 3000,
        });
    }
}
