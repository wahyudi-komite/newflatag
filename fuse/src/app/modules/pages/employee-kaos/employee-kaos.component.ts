import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { GlobalVariable } from '../../../node/common/global-variable';
import { DialogEKComponent } from './dialog-ek/dialog-ek.component';
import { EditDialogEkComponent } from './edit-dialog-ek/edit-dialog-ek.component';
import { EmployeeKaosService } from './employee-kaos.service';
import { PrintLabelComponent } from './print-label/print-label.component';

@Component({
    selector: 'app-employee-kaos',
    standalone: true,
    imports: [AgGridModule, CommonModule, ToastrModule, PrintLabelComponent],
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
                const isScanned = params.data.scan === 1;
                return `
                    <div class="flex items-center justify-center space-x-1 h-auto ">
                        <button
          class="text-white text-sm px-2 py-1 rounded-md flex items-center justify-center 
                 ${isScanned ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}"
          title="Print"
          ${isScanned ? 'disabled' : `onclick="window.printRow(${params.data.id})"`}
        >
          <span class="material-icons" style="font-size:16px;">print</span>
        </button>
                        <button class="flex items-center justify-center px-2 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600" title="Edit" onclick="window.editRow(${params.data.id})">
                            <span class="material-icons" style="font-size:16px;">edit</span>
                        </button>
                        <button class="flex items-center justify-center px-2 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600" title="Delete" onclick="window.deleteRow(${params.data.id})">
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
            field: 'checkbox',
            headerName: '-',
            headerCheckboxSelection: false, // ✅ Checkbox di header
            checkboxSelection: (params: any) => {
                // disable checkbox kalau sudah scan
                return params.data && params.data.scan !== 1;
            }, // ✅ Checkbox per row
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
    };

    readonly dialog = inject(MatDialog);
    private toastr = inject(ToastrService);

    constructor(
        private _service: EmployeeKaosService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.load();
        // (window as any).editRow = (id: number) => this.onEditRow(id);
        // (window as any).deleteRow = (id: number) => this.onDeleteRow(id);
        (window as any).printRow = (id: number) => this.onPrintRowx(id);

        (window as any).editRow = (id: number) => this.openDialog('Update', id);
        (window as any).deleteRow = (id: number) =>
            this.openDialog('Delete', id);
    }

    load() {
        this._service.getAllx().subscribe((data) => {
            this.rowData = data.data;
        });
    }
    onGridReady(params: GridReadyEvent) {
        this.gridApi = params.api;

        this.gridApi.addEventListener('rowSelected', () => {
            const selected = this.gridApi.getSelectedNodes();

            if (selected.length > 50) {
                // batalkan seleksi terbaru
                const last = selected[selected.length - 1];
                last.setSelected(false);

                alert('Maksimal hanya bisa memilih 50 data.');
            }
        });

        this._service.getAllx().subscribe(
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
        this.data = selectedData;
        this.singleData = false;
        setTimeout(() => window.print(), 100);
    }

    onQuickFilterChanged(event: any) {
        this.gridApi.setGridOption('quickFilterText', event.target.value);
    }

    exportToCSV() {
        if (!this.gridApi) return;

        // ❌ kolom yang tidak ingin diexport
        const excludedFields = ['actions', 'checkbox'];

        // ✅ ambil semua colId yang aktif, lalu filter
        const allColumns = this.gridApi.getAllDisplayedColumns();
        const exportColumns = allColumns
            .map((col) => col.getColDef().field)
            .filter((field) => field && !excludedFields.includes(field));

        this.gridApi.exportDataAsCsv({
            fileName: 'flatag-data-export.csv',
            columnKeys: exportColumns, // hanya export kolom ini
        });
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
        let agGrid = this.rowData.find((row) => row.id === id);
        this.data = [agGrid];
        this.singleData = true;

        this.cdr.detectChanges();

        const logo = document.getElementById('printLogo') as HTMLImageElement;
        if (logo.complete) {
            window.print();
        } else {
            logo.onload = () => window.print();
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
    }

    onSelectAllThisPage() {
        if (!this.gridApi) return;

        const currentPage = this.gridApi.paginationGetCurrentPage();
        const pageSize = this.gridApi.paginationGetPageSize();

        const start = currentPage * pageSize;
        const end = start + pageSize;

        let count = 0;

        this.gridApi.forEachNodeAfterFilterAndSort((node) => {
            // hanya baris di halaman aktif
            if (node.rowIndex >= start && node.rowIndex < end) {
                if (count < 50) {
                    node.setSelected(true);
                    count++;
                } else {
                    node.setSelected(false); // ✅ sisanya tidak bisa select
                }
            }
        });
    }

    onUnselectAllThisPage() {
        if (!this.gridApi) return;

        this.gridApi.forEachNode((node) => {
            node.setSelected(false);
        });
    }

    onSelectionChanged(event: any) {
        const selectedRows = this.gridApi.getSelectedRows();
        this.isRowSelected = selectedRows.length > 0;
    }

    openDialog(action: string, obj: any) {
        obj = this.rowData.find((row) => row.id === obj);

        obj.action = action;
        let dialogBoxSettings = {
            position: { top: '10px' },
            width: '1000px',
            margin: '0 auto',
            disableClose: true,
            hasBackdrop: true,
            data: obj,
        };

        const dialogRef = this.dialog.open(
            EditDialogEkComponent,
            dialogBoxSettings
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result.event == 'Add') {
                // this.redirectToAdd(result.formValue);
            } else if (result.event == 'Update') {
                this.redirectToUpdate(result.data, result.formValue);
            } else if (result.event == 'Delete') {
                this.redirectToDelete(result.data.id);
            } else if (result.event == 'Upload') {
                // this.load();
            }
        });
    }

    redirectToUpdate(data: any, formValue: any): void {
        return;
        // this._service.update(data.id, formValue).subscribe(
        //     (res) => {
        //         GlobalVariable.audioSuccess.play();
        //         this.toastr.success('Success', 'Update data success');
        //         this.load();
        //     },
        //     (error) => {
        //         this.errorNotif(error);
        //     }
        // );
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
}
