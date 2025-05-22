import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { RolesModule } from '../features/roles/roles.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RolesModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
