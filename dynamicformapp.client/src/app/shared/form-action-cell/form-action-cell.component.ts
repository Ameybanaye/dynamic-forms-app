import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-action-cell',
  templateUrl: './form-action-cell.component.html',
  styleUrls: ['./form-action-cell.component.css']
})
export class FormActionCellComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  copyLink() {
    this.params.context.componentParent.copyPublicLink(this.params.data.publicId);
  }

  view() {
    this.params.context.componentParent.viewForm(this.params.data.publicId);
  }

  edit() {
    this.params.context.componentParent.editForm(this.params.data.id);
  }

  responses() {
    this.params.context.componentParent.viewResponses(this.params.data.id);
  }

  delete() {
    this.params.context.componentParent.confirmDelete(this.params.data.id);
  }
}
