import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Role, RoleService } from '../../../core/api/role.service';

@Component({
  selector: 'app-role-edit-dialog',
  templateUrl: './role-edit-dialog.component.html'
})
export class RoleEditDialogComponent {
  form = this.fb.group({
    name: [this.data.name, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RoleEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, name: string },
    private roleService: RoleService
  ) { }

  save() {
    if (this.form.valid) {
      this.roleService.updateRole(this.data.id, this.form.value as Partial<Role>)
        .subscribe(() => this.dialogRef.close(true));

    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
