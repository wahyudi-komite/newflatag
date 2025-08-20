import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import {
    AllCommunityModule,
    ColDef,
    GridApi,
    GridReadyEvent,
    ModuleRegistry,
} from 'ag-grid-community';
import { DialogEKComponent } from './dialog-ek/dialog-ek.component';
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

    public colDefs: ColDef[] = [
        {
            field: 'actions',
            headerName: 'Actions',
            cellClass: 'flex justify-center items-center',
            cellRenderer: (params: any) => {
                return `
                    <div class="flex items-center justify-center space-x-1 h-auto ">
                        <button class="bg-green-500 hover:bg-green-600 text-white text-sm px-2 py-1 rounded-md flex items-center justify-center" title="Print" onclick="window.printRow(${params.data.id})">
                            <span class="material-icons" style="font-size:16px;">print</span>
                        </button>
                        <button class="bg-blue-500 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-md flex items-center justify-center" title="Edit" onclick="window.editRow(${params.data.id})">
                            <span class="material-icons" style="font-size:16px;">edit</span>
                        </button>
                        <button class="bg-red-500 hover:bg-red-600 text-white text-sm px-2 py-1 rounded-md flex items-center justify-center" title="Delete" onclick="window.deleteRow(${params.data.id})">
                            <span class="material-icons" style="font-size:16px;">delete</span>
                        </button>
                    </div>
                `;
            },
            sortable: false,
            filter: false,
            pinned: 'left',
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

    public rowData: any[] = [];
    public defaultColDef: ColDef = {
        resizable: true,
        sortable: true,
        filter: true,
    };

    readonly dialog = inject(MatDialog);
    constructor(private _services: EmployeeKaosService) {}

    ngOnInit() {
        this._services.getAllx().subscribe((data) => {
            this.rowData = data.data;
        });

        (window as any).editRow = (id: number) => this.onEditRow(id);
        (window as any).deleteRow = (id: number) => this.onDeleteRow(id);
        (window as any).printRow = (id: number) => this.onPrintRow(id);
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

    onEditRow(id: number): void {
        const data = this.rowData.find((row) => row.id === id);
        if (!data) return;

        console.log('Edit row:', data);

        // Example: Simple prompt edit
        const newName = prompt('Enter new name:', data.name);
        if (newName && newName !== data.name) {
            const rowIndex = this.rowData.findIndex((row) => row.id === id);
            if (rowIndex !== -1) {
                this.rowData[rowIndex].name = newName;

                // Refresh grid data
                if (this.gridApi) {
                    this.gridApi.setGridOption('rowData', this.rowData);
                }
            }
        }
    }

    // Delete row
    onDeleteRow(id: number): void {
        const data = this.rowData.find((row) => row.id === id);
        if (!data) return;

        console.log('Delete row:', data);

        if (confirm(`Are you sure you want to delete ${data.name}?`)) {
            this.rowData = this.rowData.filter((row) => row.id !== id);

            // Refresh grid
            if (this.gridApi) {
                this.gridApi.setGridOption('rowData', this.rowData);
            }

            console.log('Deleted row:', data);
        }
    }

    onPrintRow(id: number): void {
        const data = this.rowData.find((row) => row.id === id);
        if (!data) return;

        let dialogBoxSettings = {
            position: { top: '10px' },
            // width: '400px',
            margin: '0 auto',
            disableClose: true,
            hasBackdrop: true,
            data: data,
        };

        const dialogRef = this.dialog.open(
            DialogEKComponent,
            dialogBoxSettings
        );

        // const printWindow = window.open('', '_blank');
        // if (printWindow) {
        //     printWindow.document.write(`
        //         <html>
        //             <head>
        //                 <title>Print Row</title>
        //                 <style>
        //                     body { font-family: Arial, sans-serif; }
        //                     .row-data { margin: 20px; }
        //                 </style>
        //             </head>
        //             <body>
        //                 <div class="row-data">
        //                     <h2>Row Data</h2>
        //                     <pre>${JSON.stringify(data, null, 2)}</pre>
        //                 </div>
        //             </body>
        //         </html>
        //     `);
        //     printWindow.document.close();
        //     printWindow.print();
        // }
    }
}
