import { Component } from '@angular/core';

import { Role, RoleService } from '../../../core/api/role.service';
import { MatDialog } from '@angular/material/dialog';
import { RoleEditDialogComponent } from '../role-edit-dialog/role-edit-dialog.component';
import { RoleCreateDialogComponent } from '../role-create-dialog/role-create-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent {
  roles: Role[] = [];

  constructor(private dialog: MatDialog, private roleService: RoleService) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getActiveRoles().subscribe({
      next: res => this.roles = res
    });
  }

  deleteRole(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this role?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.deleteRole(id).subscribe(() => this.loadRoles());
      }
    });
  }

  openEditDialog(role: Role) {
    const dialogRef = this.dialog.open(RoleEditDialogComponent, {
      width: '400px',
      data: { id: role.id, name: role.name }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) this.loadRoles();
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(RoleCreateDialogComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(created => {
      if (created) this.loadRoles();
    });
  }
}
