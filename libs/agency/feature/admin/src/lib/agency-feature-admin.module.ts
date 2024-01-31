import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { agencyAdminRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(agencyAdminRoutes)],
})
export class AgencyFeatureAdminModule {}
