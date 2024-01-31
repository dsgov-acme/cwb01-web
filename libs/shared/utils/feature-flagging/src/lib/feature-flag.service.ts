import { Injectable } from '@angular/core';
import { last, map, Observable, switchMap } from 'rxjs';
import { FeatureFlagAdapter } from './feature-flag.adapter';
import { FeatureKeys, FeatureValues } from './feature-flag.const';
import { FeatureFlagUserModel } from './models/feature-flag-user.model';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  constructor(private readonly _featureFlagAdapter: FeatureFlagAdapter) {}

  /**
   *
   * Used for feature flags that are values other than boolean
   */
  public getFeatureFlagValue$(featureKey: FeatureKeys): Observable<FeatureValues> {
    return this._featureFlagAdapter.initialLoaded$.pipe(
      last(),
      switchMap(() => this._featureFlagAdapter.getFeatureFlagValue$(featureKey)),
    );
  }

  /**
   * The default/preferred method for checking if a feature flag is enabled
   */
  public isFeatureFlagEnabled$(featureKey: FeatureKeys): Observable<boolean> {
    return this.getFeatureFlagValue$(featureKey).pipe(map(value => !!value));
  }

  /**
   * Is the feature flag currently enabled, this should only be used on f.e. callbacks.
   * When the current value is needed at that moment.
   * Generally isFeatureFlagEnabled$ is preferred.
   */
  public isFeatureFlagEnabled(featureKey: FeatureKeys): boolean {
    return !!this._featureFlagAdapter.getFeatureFlagValue(featureKey);
  }

  /**
   * Used to Identify the user with the feature flag provider
   * and to control flag values by user
   */
  public identify(featureFlagUserModel: FeatureFlagUserModel) {
    this._featureFlagAdapter.identify(featureFlagUserModel);
  }

  /**
   * Used for Initializing the Application
   */
  public get initialLoaded$(): Observable<boolean> {
    return this._featureFlagAdapter.initialLoaded$.pipe(last());
  }
}
