import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { faCaretDown, faClipboardCheck, faFile, faHome, faList, faSignOutAlt, faUsers, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { NavigationEnd, Router } from '@angular/router';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './core/services/auth.service';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  public forecasts: WeatherForecast[] = [];
  faHome = faHome;
  faUserShield = faUserShield;
  isLargeScreen: boolean = true;
  faUsers = faUsers;
  iconForms = faFile;
  iconFormFeilds = faClipboardCheck;
  iconFormFeildsOptions = faList;
  iconLogout = faSignOutAlt;
  adminMode: boolean = false;

  constructor(breakpointObserver: BreakpointObserver, private router: Router, private dialog: MatDialog, private authService: AuthService) {
    breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall])
      .subscribe(result => {
        this.isLargeScreen = !result.matches;
      });
  }
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.adminMode = this.router.url.startsWith('/admin') || this.router.url.startsWith('/change-password');
      }
    });
  }

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  logout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to logout?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }

  title = 'Dynamic Forms App';
}
