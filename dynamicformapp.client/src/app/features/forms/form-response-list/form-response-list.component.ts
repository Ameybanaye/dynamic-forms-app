import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormResponseSummary, FormResponseApiService } from '../../../core/api/form-response-api.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { AllCommunityModule, ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([
  AllCommunityModule,
]);

@Component({
  selector: 'app-form-response-list',
  templateUrl: './form-response-list.component.html',
  styleUrl: './form-response-list.component.css'
})
export class FormResponseListComponent implements OnInit {
  responses: FormResponseSummary[] = [];
  formId!: number;
  columns: string[] = [];
  rows: any[] = [];

  columnDefs: any[] = [];
  defaultColDef = {
    filter: true,
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };

  constructor(
    private route: ActivatedRoute,
    private api: FormResponseApiService
  ) { }

  originalOrder = () => 0;

  ngOnInit(): void {
    this.formId = +this.route.snapshot.paramMap.get('id')!;
    this.api.getResponsesByForm(this.formId).subscribe(responses => {
      this.responses = responses;
      if (responses.length > 0) {
        const firstParsed = JSON.parse(responses[0].responseJson);
        this.rows = responses.map(r => {
          const parsed = JSON.parse(r.responseJson);
          return {
            ...parsed,
            SubmittedOn: new Date(r.createdDate).toLocaleString()
          };
        });

        // Create dynamic columnDefs based on keys
        this.columnDefs = Object.keys(firstParsed).map(key => ({
          field: key,
          filter: typeof firstParsed[key] === 'boolean' ? 'agSetColumnFilter' : 'agTextColumnFilter',
          cellRenderer: (params: any) => {
            const val = params.value;

            if (Array.isArray(val)) {
              return val.map(v => `<span class="badge bg-primary">${v}</span>`).join(' ');
            }

            if (typeof val === 'boolean') {
              return `<input type="checkbox" disabled ${val ? 'checked' : ''}>`;
            }

            return val ?? '';
          }

        }));

        // Add SubmittedOn column
        this.columnDefs.push({
          field: 'SubmittedOn',
          filter: 'agDateColumnFilter'
        });

        console.log('ColumnDefs:', this.columnDefs);
        console.log('Rows:', this.rows);
      }
    });
  }

  parseJson(json: string): any {
    try {
      return JSON.parse(json);
    } catch {
      return {};
    }
  }

  formatValue(val: any): string {
    if (typeof val === 'boolean') {
      return val ? 'Yes' : 'No';
    }
    return val;
  }

  isBoolean(value: any): boolean {

    return typeof value === 'boolean';
  }
  exportToExcel(): void {
    if (this.responses.length === 0) return;

    const exportData = this.responses.map(r => {
      const parsed = this.parseJson(r.responseJson);

      // Flatten array values into comma-separated strings
      const flattened = Object.entries(parsed).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value)
          ? value.join(', ') // ✔️ convert array to comma-separated string
          : value;
        return acc;
      }, {} as any);

      return {
        ...flattened,
        SubmittedOn: new Date(r.createdDate).toLocaleString()
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const fileName = `form-${this.formId}-responses.xlsx`;
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, fileName);
  }



}
