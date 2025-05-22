import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleListComponent } from '../features/roles/role-list/role-list.component';
import { RoleFormComponent } from '../features/roles/role-form/role-form.component';
import { FormBuilderComponent } from '../features/forms/form-builder/form-builder.component';
import { FormListComponent } from '../features/forms/form-list/form-list.component';
import { FormSubmissionComponent } from '../features/forms/form-submission/form-submission.component';
import { FormResponseListComponent } from '../features/forms/form-response-list/form-response-list.component';


const routes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'roles',
        children: [
          { path: '', component: RoleListComponent },
          { path: 'create', component: RoleFormComponent },
          { path: 'edit/:id', component: RoleFormComponent }
        ]
      },
      {
        path: 'forms',
        children: [
          { path: '', component: FormListComponent },
          { path: ':id/edit', component: FormBuilderComponent },
          { path: ':id/submit', component: FormSubmissionComponent },
          { path: 'new', component: FormBuilderComponent },
          { path: ':id/responses', component: FormResponseListComponent },
        ]
      },
      {
        path: 'form-builder',
        component: FormBuilderComponent
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
