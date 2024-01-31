import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { EnvironmentFeatureFlagAdapter } from './adapters/environment-feature-flag.adapter';
import { FeatureFlagDisabledDirective } from './feature-flag-disabled/feature-flag-disabled.directive';
import { FeatureFlagAdapter } from './feature-flag.adapter';
import { DEFAULT_FEATURE_FLAGS, DefaultFeatureFlags } from './feature-flag.const';
import { FeatureFlagGuardContract } from './feature-flag.guard';
import { FeatureFlagService } from './feature-flag.service';
import { FeatureFlagDirective } from './feature-flag/feature-flag.directive';

const FeatureFlagAppInitializer = {
  deps: [FeatureFlagService],
  multi: true,
  provide: APP_INITIALIZER,
  useFactory: (featureFlagService: FeatureFlagService) => () => featureFlagService.initialLoaded$,
};

@NgModule({
  declarations: [FeatureFlagDirective, FeatureFlagDisabledDirective],
  exports: [FeatureFlagDirective, FeatureFlagDisabledDirective],
  imports: [CommonModule],
})
export class FeatureFlagModule {
  public static useEnvironmentAdapter(): ModuleWithProviders<FeatureFlagModule> {
    return {
      ngModule: FeatureFlagModule,
      providers: [
        FeatureFlagAppInitializer,
        FeatureFlagGuardContract,
        {
          provide: FeatureFlagAdapter,
          useClass: EnvironmentFeatureFlagAdapter,
        },
        { provide: DEFAULT_FEATURE_FLAGS, useValue: DefaultFeatureFlags },
      ],
    };
  }
}
