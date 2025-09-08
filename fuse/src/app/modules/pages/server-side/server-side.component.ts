import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
    ColDef,
    GridReadyEvent,
    IDatasource,
    IGetRowsParams,
} from 'ag-grid-community';

@Component({
    selector: 'app-server-side',
    standalone: true,
    imports: [AgGridAngular],
    templateUrl: './server-side.component.html',
    styleUrl: './server-side.component.scss',
})
export class ServerSideComponent {
    public colDefs: ColDef[] = [
        { field: 'id', sort: 'desc' },
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
            filter: true,
            cellRenderer: (params: any) => {
                if (params.value === 1) {
                    return 'OK';
                } else if (params.value === 2) {
                    return 'Print';
                }
                return '';
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
        { field: 'dlong_old', headerName: 'Dewasa Panjang_Old' },
        { field: 'dshort_old', headerName: 'Dewasa Pendek_Old' },
        { field: 'clong_old', headerName: 'Anak Panjang_Old' },
        { field: 'cshort_old', headerName: 'Anak Pendek_Old' },
    ];

    public rowData: any[] = [];
    public defaultColDef: ColDef = {
        resizable: true,
        sortable: true,
        filter: true,
        floatingFilter: true,
        filterParams: {
            suppressAndOrCondition: true, // 🔥 semua kolom hanya punya 1 filter
        },
    };

    constructor(private http: HttpClient) {}

    onGridReady(params: GridReadyEvent) {
        console.log(params);

        const dataSource: IDatasource = {
            getRows: (request: IGetRowsParams) => {
                console.log('🔹 Sort model:', request.sortModel);
                console.log('🔹 Filter model:', request.filterModel);

                const page = request.startRow / 50 + 1;

                let httpParams = new HttpParams()
                    .set('page', page)
                    .set('limit', 50);

                if (request.sortModel.length > 0) {
                    const sort = request.sortModel[0];
                    httpParams = httpParams
                        .set('sortField', sort.colId)
                        .set('sortOrder', sort.sort); // asc / desc
                }
                // kirim filter ke backend
                Object.keys(request.filterModel).forEach((col) => {
                    const filter = request.filterModel[col];

                    if (filter.operator && filter.conditions) {
                        // advanced filter (AND/OR dengan conditions array)
                        httpParams = httpParams.set(
                            `filter_${col}_op`,
                            filter.operator
                        );

                        filter.conditions.forEach((cond: any, idx: number) => {
                            httpParams = httpParams
                                .set(
                                    `filter_${col}_${idx + 1}_type`,
                                    cond.type || ''
                                )
                                .set(
                                    `filter_${col}_${idx + 1}_val`,
                                    cond.filter || ''
                                );
                        });
                    } else {
                        // simple filter
                        httpParams = httpParams
                            .set(`filter_${col}_type`, filter.type || '')
                            .set(`filter_${col}_val`, filter.filter || '');
                    }
                });
                console.log(httpParams);

                this.http
                    .get<any>(
                        'http://localhost:3010/api-flatag/v1/employee-kaos/server-side',
                        {
                            params: httpParams,
                        }
                    )
                    .subscribe((res) => {
                        request.successCallback(res.data, res.total);
                    });
            },
        };

        // ✅ cara baru di AG Grid v30+
        params.api.setGridOption('datasource', dataSource);
    }
}
