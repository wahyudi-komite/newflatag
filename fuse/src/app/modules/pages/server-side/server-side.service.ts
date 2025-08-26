import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from 'ag-grid-community';

@Injectable({
    providedIn: 'root',
})
export class ServerSideService implements IServerSideDatasource {
    constructor(private http: HttpClient) {}

    getRows(params: IServerSideGetRowsParams): void {
        const { startRow, endRow } = params.request;

        // Construct your API request with pagination, sorting, and filtering parameters
        this.http
            .get<any>(
                `http://localhost:3010/employee-kaos/server-side?startRow=${startRow}&endRow=${endRow}`
            )
            .subscribe(
                (response) => {
                    params.success({
                        rowData: response.data,
                        rowCount: response.totalRecords,
                    });
                },
                (error) => {
                    params.fail();
                }
            );
    }
}
