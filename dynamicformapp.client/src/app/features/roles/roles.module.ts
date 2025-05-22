import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RoleEditDialogComponent } from './role-edit-dialog/role-edit-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RoleCreateDialogComponent } from './role-create-dialog/role-create-dialog.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    RoleListComponent,
    RoleFormComponent,
    RoleEditDialogComponent,
    RoleCreateDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    SharedModule
  ]
})
export class RolesModule { }
