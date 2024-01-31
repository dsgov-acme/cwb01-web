import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { publicFeatureProfileRoutes } from './lib.routes';
@NgModule({
  imports: [CommonModule, RouterModule.forChild(publicFeatureProfileRoutes)],
})
export class EmployerFeatureProfileModule {}
