import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService // Assuming you have an AuthService for authentication
  ) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const dialogRef = this.dialog.open(LoadingDialogComponent, {
      disableClose: true
    });

    this.http.post(`${environment.apiUrl}/api/auth/change-password`, this.form.value).subscribe({
      next: () => {
        dialogRef.close();
        this.snackBar.open('Password changed successfully', 'Close', { duration: 3000 });
        this.authService.logout(); // Assuming you have a logout method in your auth service
      },
      error: (err) => {
        dialogRef.close();
        const msg = err?.error?.message || 'Failed to change password';
        this.snackBar.open(msg, 'Close', { duration: 3000 });
      }
    });
  }
}
