import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { map } from 'rxjs';
import { AccessControlService } from '../services/access-control.service';
import { Capabilities } from './../models/access-control.model';

@Injectable()
export class AccessControlGuardContract {
  constructor(private readonly _router: Router, private readonly _accessControlService: AccessControlService) {}

  public canActivate(route: ActivatedRouteSnapshot) {
    const featureKey = route.data['capability'] as Capabilities;
    const redirectUrl = route.data['redirectUrl'] || '/unauthorized';

    return this._accessControlService.isAuthorized$(featureKey).pipe(map(enabled => (enabled ? true : this._router.parseUrl(redirectUrl))));
  }
}

/**
 * This guard provides an easy way to enable/disable routes in your application
 * Use it like a canActivate guard
 * ```
 *    {
        canActivate: [AccessControlGuard],
        data: {
          capability: 'transaction-management-read',
          redirectUrl: '/some-url', // optional
        },
      },
 * ````
 */
export const AccessControlGuard = (_route: ActivatedRouteSnapshot) => {
  return inject(AccessControlGuardContract).canActivate(_route);
};
