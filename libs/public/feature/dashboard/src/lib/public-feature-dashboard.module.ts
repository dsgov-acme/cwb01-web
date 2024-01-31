import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { publicFeatureDashboardRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(publicFeatureDashboardRoutes)],
})
export class PublicFeatureDashboardModule {}
