import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { tap } from 'rxjs';
import { UserStateService } from '../services';

@Injectable()
export class UserHasDataGuardContract {
  public bypassRedirect = false;

  constructor(private readonly _router: Router, private readonly _userStateService: UserStateService) {}

  public canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    // bypassRedirect is needed to be able to skip profile creation and redirect to dashboard page
    // This way the guard only works as a redirect one time on creation
    if (!this.bypassRedirect) {
      this._userStateService.user$
        .pipe(
          tap(user => {
            if (user?.firstName) {
              // User profile exists, allow navigation to dashboard page

              return true;
            } else {
              this._router.navigate(['/profile']);

              return false;
            }
          }),
        )
        .subscribe();

      this.bypassRedirect = true;
    }

    return true;
  }
}

/**
 * Use it like a canActivate guard
 * ```
 *    {
        canActivate: [UserHasDataGuard],
        ...
      },
 * ````
 */
export const UserHasDataGuard = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
  return inject(UserHasDataGuardContract).canActivate(_route, _state);
};
