import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormApiService, FormModel } from '../../../core/api/form-api.service.ts.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormActionCellComponent } from '../../../shared/form-action-cell/form-action-cell.component';

ModuleRegistry.registerModules([
  AllCommunityModule,
]);

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html'
})
export class FormListComponent implements OnInit {
  forms: FormModel[] = [];
  context = { componentParent: this };
  displayedColumns: string[] = ['title', 'description', 'createdDate', 'actions'];
  columnDefs: any[] = [
    { field: 'title', headerName: 'Title', flex: 1, filter: true },
    { field: 'description', headerName: 'Description', flex: 2 },
    {
      field: 'createdDate',
      headerName: 'Created',
      flex: 1,
      filter: 'agDateColumnFilter', // ✅ Use AG Grid's date filter
      valueFormatter: ({ value }: any) =>
        new Date(value).toLocaleString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
      filterParams: {
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
          const cellDate = new Date(cellValue);

          // Set both dates to midnight for accurate comparison
          const cellMidnight = new Date(
            cellDate.getFullYear(),
            cellDate.getMonth(),
            cellDate.getDate()
          );

          const filterMidnight = new Date(
            filterLocalDateAtMidnight.getFullYear(),
            filterLocalDateAtMidnight.getMonth(),
            filterLocalDateAtMidnight.getDate()
          );

          if (cellMidnight < filterMidnight) return -1;
          if (cellMidnight > filterMidnight) return 1;
          return 0;
        }
      }
    },
    {
      field: 'responseCount',
      headerName: 'Responses',
      flex: 1,
      cellClass: 'text-center', // ✅ center the content
      cellRenderer: (params: any) => {
        const count = params.value || 0;

        return count > 0
          ? `<span class="badge bg-success">${count}</span>`     // ✔️ green badge for non-zero
          : `<span class="text-muted">0</span>`;                 // ❌ muted gray for 0
      },
      sortable: true,
      filter: 'agNumberColumnFilter'
    },
    // {
    //   headerName: 'Actions',
    //   cellRenderer: this.actionCellRenderer.bind(this),
    //   flex: 2,
    //   suppressMovable: true,
    //   sortable: false,
    //   filter: false
    // },
    {
      headerName: 'Actions',
      cellRenderer: FormActionCellComponent,
      suppressMovable: true,
      sortable: false,
      filter: false,
      flex: 2
    }
  ];

  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
  };

  constructor(private formApi: FormApiService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar, private clipboard: Clipboard, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadForms();
  }

  loadForms() {
    this.formApi.getAllForms().subscribe({
      next: res => this.forms = res,
      error: err => console.error('Error loading forms', err)
    });
  }

  viewForm(publicId: string) {
    const tree = this.router.createUrlTree(['/forms', publicId, 'fill']);
    const url = this.router.serializeUrl(tree);
    window.open(url, '_blank');
  }

  editForm(id: number) {
    this.router.navigate(['/admin/forms', id, 'edit']);
  }

  viewResponses(id: number) {
    this.router.navigate(['/admin/forms', id, 'responses']);
  }

  confirmDelete(id: number) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this form?' }
    });

    this.cd.detectChanges();
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.formApi.deleteForm(id).subscribe({
          next: () => {
            this.forms = this.forms.filter(f => f.id !== id);
            this.snackBar.open('Form deleted', 'Close', { duration: 3000 });
          },
          error: () => this.snackBar.open('Delete failed', 'Close', { duration: 3000 })
        });
      }
    });
  }


  copyPublicLink(publicId: string) {
    const publicUrl = `${location.origin}/forms/${publicId}/fill`;
    this.clipboard.copy(publicUrl);

    this.snackBar.open('Link copied to clipboard', 'Close', { duration: 3000 });
    this.cd.detectChanges();
  }

  actionCellRenderer(params: any): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('d-flex', 'gap-2');

    const buttons = [
      { icon: 'content_copy', tooltip: 'Copy Public Link', click: () => this.copyPublicLink(params.data.publicId) },
      { icon: 'visibility', tooltip: 'View', click: () => this.viewForm(params.data.publicId) },
      { icon: 'edit', tooltip: 'Edit', click: () => this.editForm(params.data.id) },
      { icon: 'list_alt', tooltip: `Responses (${params.data.responseCount || 0})`, click: () => this.viewResponses(params.data.id) },
      { icon: 'delete', tooltip: 'Delete', click: () => this.confirmDelete(params.data.id) }
    ];

    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.className = 'btn btn-sm btn-outline-primary';
      button.title = btn.tooltip;
      button.innerHTML = `<span class="material-icons">${btn.icon}</span>`;
      button.onclick = btn.click;
      container.appendChild(button);
    });

    return container;
  }


  exportToExcel(): void {
    const exportData = this.forms.map(f => ({
      Title: f.title,
      Description: f.description,
      'Created Date': new Date(f.createdDate).toLocaleString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }),
      Responses: f.responseCount || 0
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'form-list.xlsx');
  }

}
