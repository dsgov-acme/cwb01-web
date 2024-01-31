/* istanbul ignore file */

import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { FeatureFlagAdapter } from '../feature-flag.adapter';
import { FeatureKeys, FeatureValues } from '../feature-flag.const';
import { FeatureFlagUserModel } from '../models/feature-flag-user.model';

@Injectable()
export class MockFeatureFlagAdapter implements FeatureFlagAdapter {
  public readonly initialLoaded$: Observable<boolean> = EMPTY;

  public getFeatureFlagValue(_featureKey: FeatureKeys): FeatureValues {
    return true;
  }
  public identify(_featureFlagUserModel: FeatureFlagUserModel): void {
    return;
  }
  public getFeatureFlagValue$(_featureKey: FeatureKeys): Observable<FeatureValues> {
    return of(true);
  }
}
