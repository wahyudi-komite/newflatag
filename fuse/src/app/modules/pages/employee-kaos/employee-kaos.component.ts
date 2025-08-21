import { CommonModule } from '@angular/common';
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
import { PrintLabelComponent } from './print-label/print-label.component';
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
    selector: 'app-employee-kaos',
    standalone: true,
    imports: [AgGridModule, CommonModule, PrintLabelComponent],
    templateUrl: './employee-kaos.component.html',
    styleUrl: './employee-kaos.component.scss',
})
export class EmployeeKaosComponent {
    private gridApi!: GridApi;
    isLoading = true;
    params: any;
    isRowSelected = false;
    data: any;
    singleData: boolean = true;

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
        {
            headerCheckboxSelection: false, // ✅ Checkbox di header
            checkboxSelection: true, // ✅ Checkbox per row
            width: 10,
            pinned: 'left',
            sortable: false,
            filter: false,
        },
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
        (window as any).printRow = (id: number) => this.onPrintRowx(id);
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

    // ✅ Ambil semua row terpilih
    getSelectedRows() {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        console.log('Selected Rows:', selectedData);
        this.data = selectedData;
        this.singleData = false;
        setTimeout(() => window.print(), 100);
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

    onPrintRowx(id: number): void {
        this.data = this.rowData.find((row) => row.id === id);
        this.singleData = true;

        setTimeout(() => window.print(), 100);
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
    }

    onSelectAllThisPage() {
        let count = 0;
        this.gridApi.forEachNodeAfterFilterAndSort((node) => {
            if (count < 50) {
                // batas hanya 50 row (1 halaman)
                node.setSelected(true);
                count++;
            }
        });
    }

    onUnselectAllThisPage() {
        let count = 0;
        this.gridApi.forEachNodeAfterFilterAndSort((node) => {
            if (count < 50) {
                node.setSelected(false);
                count++;
            }
        });
    }

    onSelectionChanged(event: any) {
        const selectedRows = this.gridApi.getSelectedRows();
        this.isRowSelected = selectedRows.length > 0;
    }
}
