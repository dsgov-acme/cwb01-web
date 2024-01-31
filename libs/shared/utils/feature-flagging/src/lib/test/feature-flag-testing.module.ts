import { NgModule } from '@angular/core';
import { FeatureFlagAdapter } from '../feature-flag.adapter';
import { DefaultFeatureFlags, DEFAULT_FEATURE_FLAGS } from '../feature-flag.const';
import { FeatureFlagModule } from './../feature-flag.module';
import { MockFeatureFlagAdapter } from './feature-flag.adapter.mock';

@NgModule({
  exports: [FeatureFlagModule],
  imports: [FeatureFlagModule],
  providers: [
    {
      provide: FeatureFlagAdapter,
      useClass: MockFeatureFlagAdapter,
    },
    { provide: DEFAULT_FEATURE_FLAGS, useValue: DefaultFeatureFlags },
  ],
})
export class FeatureFlagTestingModule {}
