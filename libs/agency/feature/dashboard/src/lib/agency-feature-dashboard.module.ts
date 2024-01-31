import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { agencyFeatureDashboardRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(agencyFeatureDashboardRoutes)],
})
export class AgencyFeatureDashboardModule {}
