import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AdminModule } from './admin/admin.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilderComponent } from './features/forms/form-builder/form-builder.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilderEditorComponent } from './features/forms/form-builder-editor/form-builder-editor.component';
import { FormBuilderPreviewComponent } from './features/forms/form-builder-preview/form-builder-preview.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormListComponent } from './features/forms/form-list/form-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { FormSubmissionComponent } from './features/forms/form-submission/form-submission.component';
import { FormResponseListComponent } from './features/forms/form-response-list/form-response-list.component';
import { MatBadgeModule } from '@angular/material/badge';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE, MatOption, MatOptionModule } from '@angular/material/core';
import { AgGridModule } from 'ag-grid-angular';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    FormBuilderComponent,
    FormBuilderEditorComponent,
    FormBuilderPreviewComponent,
    FormListComponent,
    FormSubmissionComponent,
    FormResponseListComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    CoreModule,
    AdminModule,
    NgbModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    FontAwesomeModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    DragDropModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    MatCardModule,
    MatBadgeModule,
    AgGridModule,
    AuthModule,
    MatOptionModule,
    MatSelectModule

  ],
  providers: [
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'en-IN' }, // or 'en-GB', etc.
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
