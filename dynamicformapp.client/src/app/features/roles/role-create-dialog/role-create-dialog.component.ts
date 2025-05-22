import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { RoleService } from '../../../core/api/role.service';

@Component({
  selector: 'app-role-create-dialog',
  templateUrl: './role-create-dialog.component.html'
})
export class RoleCreateDialogComponent {
  form = this.fb.group({
    name: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RoleCreateDialogComponent>,
    private roleService: RoleService
  ) { }

  save() {
    if (this.form.valid) {
      this.roleService.addRole(this.form.value as { name: string }).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
