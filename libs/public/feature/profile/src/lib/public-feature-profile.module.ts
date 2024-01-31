import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { publicFeatureProfileRoutes } from './public-feature-profile.routes';
import { PublicFeatureProfileService } from './public-feature-profile.service';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(publicFeatureProfileRoutes)],
  providers: [PublicFeatureProfileService],
})
export class PublicFeatureProfileModule {}
