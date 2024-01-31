import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { map } from 'rxjs';
import { FeatureKeys } from './feature-flag.const';
import { FeatureFlagService } from './feature-flag.service';

@Injectable()
export class FeatureFlagGuardContract {
  constructor(private readonly _router: Router, private readonly _featureFlagService: FeatureFlagService) {}

  public canActivate(route: ActivatedRouteSnapshot) {
    const featureFlag = route.data['featureFlag'] as FeatureKeys;
    const redirectUrl = route.data['redirectUrl'] || '/';

    return this._featureFlagService.isFeatureFlagEnabled$(featureFlag).pipe(map(enabled => (enabled ? true : this._router.parseUrl(redirectUrl))));
  }
}

/**
 * This guard provides an easy way to enable/disable routes in your application
 * Use it like a canActivate guard
 * ```
 *    {
        canActivate: [FeatureFlagGuard],
        data: {
          featureFlag: 'transaction-management-read',
          redirectUrl: '/some-url', // optional
        },
      },
 * ````
 */
export const FeatureFlagGuard = (_route: ActivatedRouteSnapshot) => {
  return inject(FeatureFlagGuardContract).canActivate(_route);
};
