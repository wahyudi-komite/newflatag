import { Component } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import {
    AllCommunityModule,
    ColDef,
    GridApi,
    GridReadyEvent,
    ModuleRegistry,
} from 'ag-grid-community';
import { EmployeeKaosService } from './employee-kaos.service';
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
    selector: 'app-employee-kaos',
    imports: [AgGridModule],
    templateUrl: './employee-kaos.component.html',
    styleUrl: './employee-kaos.component.scss',
})
export class EmployeeKaosComponent {
    private gridApi!: GridApi;
    isLoading = true;
    params: any;

    agInit(params: any): void {
        this.params = params;
    }

    public colDefs: ColDef[] = [
        {
            field: 'print',
            headerName: 'Action',
            cellRenderer: (params: any) => {
                return `
                    <div style="display: flex; gap: 6px; class="my-auto">
                        <button class="bg-green-500 hover:bg-green-600 text-white text-sm p-2 rounded-md flex items-center justify-center" title="Print" data-action="print">
                            <span class="material-icons" style="font-size:16px;">print</span>
                        </button>
                        <button class="bg-blue-500 hover:bg-blue-600 text-white text-sm p-2 rounded-md flex items-center justify-center" title="Edit" data-action="edit">
                            <span class="material-icons" style="font-size:16px;">edit</span>
                        </button>
                        <button class="bg-red-500 hover:bg-red-600 text-white text-sm p-2 rounded-md flex items-center justify-center" title="Delete" data-action="delete">
                            <span class="material-icons" style="font-size:16px;">delete</span>
                        </button>
                    </div>
                `;
            },
            onCellClicked: (params: any) => {
                const event = params.event as MouseEvent;
                const target = event.target as HTMLElement;
                const action = target.getAttribute('data-action');
                if (!action) return;

                switch (action) {
                    case 'print':
                        console.log('Print:', params.data);
                        break;
                    case 'edit':
                        console.log('Edit:', params.data);
                        break;
                }
            },
        },
        { field: 'id' },
        { field: 'name' },
        { field: 'divisi' },
        { field: 'department' },
        { field: 'lokasiKerja' },
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
        { field: 'created_at' },
        { field: 'updated_at' },
    ];

    onPrint(row: any) {
        // Implement print logic here
        console.log('Print', row);
    }

    onEdit(row: any) {
        // Implement edit logic here
        console.log('Edit', row);
    }

    onDelete(row: any) {
        // Implement delete logic here
        console.log('Delete', row);
    }
    public rowData: any[] = [];
    public defaultColDef: ColDef = {
        resizable: true,
        sortable: true,
        filter: true,
    };

    constructor(private _services: EmployeeKaosService) {}

    ngOnInit() {
        this._services.getAllx().subscribe((data) => {
            this.rowData = data.data;
        });
    }

    onGridReady(params: GridReadyEvent) {
        this.gridApi = params.api;

        this._services.getAllx().subscribe(
            (data) => {
                this.rowData = data.data;
                this.isLoading = false;
                setTimeout(() => this.doAutoSize(false), 50);
            },
            (err) => {
                this.isLoading = false;
            }
        );
    }

    onQuickFilterChanged(event: any) {
        this.gridApi.setGridOption('quickFilterText', event.target.value);
    }

    exportToCSV() {
        if (!this.gridApi) return;
        this.gridApi.exportDataAsCsv({ fileName: 'oilleak.csv' });
    }

    doAutoSize(skipHeader: boolean) {
        const colIds: string[] = [];
        this.gridApi!.getColumns()!.forEach((column) => {
            colIds.push(column.getId());
        });

        this.gridApi!.autoSizeColumns({
            colIds,
            skipHeader,
            // defaultMaxWidth: 150,
            // defaultMinWidth: 80,
        });
    }
}
