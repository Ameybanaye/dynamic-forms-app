import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  returnUrl: string = '/admin/forms';
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/forms';
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const dialogRef = this.dialog.open(LoadingDialogComponent, {
      disableClose: true
    });


    // Replace this check with real API call
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.snackBar.open('Login Successful!', 'Close', { duration: 3000 });
        this.router.navigateByUrl(this.returnUrl);
        dialogRef.close();
      },
      error: (err) => {

        this.errorMessage = err?.error?.message || 'Login failed.';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
        this.isLoading = false;
        dialogRef.close();
      }
    });
  }
}
