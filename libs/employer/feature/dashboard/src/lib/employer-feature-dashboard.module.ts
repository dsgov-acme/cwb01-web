import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { employerFeatureDashboardRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(employerFeatureDashboardRoutes)],
})
export class EmployerFeatureDashboardModule {}
