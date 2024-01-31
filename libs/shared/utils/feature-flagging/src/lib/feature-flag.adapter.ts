import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeatureKeys, FeatureValues } from './feature-flag.const';
import { FeatureFlagUserModel } from './models/feature-flag-user.model';

@Injectable()
export abstract class FeatureFlagAdapter {
  /**
   * This is used to ensure that the feature flags are loaded from the provider returning a response
   *
   * This can be used as follow
   *
   * ```
   * this.featureFlagService.initialLoaded$.pipe(
   * last()
   * ).subscribe(do something);
   * ```
   *
   * This observable will complete even if adapter is blocked from an add-blocker
   */
  public abstract initialLoaded$: Observable<boolean>;

  /**
   * Used to Identify the user with the feature flag provider
   * and to control flag values by user
   */
  public abstract identify(featureFlagUserModel: FeatureFlagUserModel): void;

  public abstract getFeatureFlagValue$(featureKey: FeatureKeys): Observable<FeatureValues>;

  public abstract getFeatureFlagValue(featureKey: FeatureKeys): FeatureValues;
}
