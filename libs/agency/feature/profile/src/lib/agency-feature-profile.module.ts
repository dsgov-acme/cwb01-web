import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgencyFeatureProfileService } from './agency-feature-profile.service';

@NgModule({
  imports: [CommonModule],
  providers: [AgencyFeatureProfileService],
})
export class AgencyFeatureProfileModule {}
