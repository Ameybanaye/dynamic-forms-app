import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatListItem } from '@angular/material/list';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormActionCellComponent } from './form-action-cell/form-action-cell.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltip } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    ConfirmDialogComponent,
    LoadingDialogComponent,
    FormActionCellComponent,
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatListItem,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatTooltip
  ]
})
export class SharedModule { }
