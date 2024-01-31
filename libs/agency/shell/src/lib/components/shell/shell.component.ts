import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { DashboardService } from '@dsg/agency/feature/dashboard';
import { AgencyFeatureProfileService } from '@dsg/agency/feature/profile';
import { UserModel } from '@dsg/shared/data-access/user-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { AuthenticationService } from '@dsg/shared/feature/authentication';
import {
  INuverialMenuItem,
  INuverialNavBarMenuItem,
  LoadingService,
  NuverialButtonComponent,
  NuverialFooterComponent,
  NuverialHeaderComponent,
  NuverialIconComponent,
  NuverialMenuComponent,
  NuverialMenuOptions,
  NuverialSideNavMenuComponent,
  NuverialSpinnerComponent,
} from '@dsg/shared/ui/nuverial';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    NuverialHeaderComponent,
    NuverialFooterComponent,
    NuverialButtonComponent,
    NuverialIconComponent,
    NuverialMenuComponent,
    NuverialSideNavMenuComponent,
    NuverialSpinnerComponent,
  ],
  selector: 'dsg-shell',
  standalone: true,
  styleUrls: ['./shell.component.scss'],
  templateUrl: './shell.component.html',
})
export class ShellComponent implements OnInit {
  public currentTimestamp = Date.now(); // setting a timestamp using the current date to generate a unique value for the cache buster
  public userAuthenticated$: Observable<boolean> = this._authenticationService.isAuthenticated$;
  public agencySideNavMenuItems$?: Observable<INuverialNavBarMenuItem[]>;
  public loading$ = this._loadingService.loading$;

  public profileMenuItemList: INuverialMenuItem[] = [
    {
      disabled: false,
      icon: 'account_circle-outline',
      key: NuverialMenuOptions.PROFILE,
      label: 'Profile',
      subTitle: '',
    },
    {
      disabled: false,
      icon: 'settings-outline',
      key: NuverialMenuOptions.PREFERENCES,
      label: 'Preferences',
    },
    {
      disabled: false,
      icon: 'logout-outline',
      key: NuverialMenuOptions.LOGOUT,
      label: 'Logout',
    },
  ];

  public readonly adminSideNavMenuItems: INuverialNavBarMenuItem[] = [
    {
      icon: 'filter_tilt_shift',
      label: 'Transaction Definitions',
      navigationRoute: 'admin/transaction-definitions',
    },
    {
      icon: 'schema',
      label: 'Schemas',
      navigationRoute: 'admin/schemas',
    },
  ];

  public portalNavigator?: INuverialNavBarMenuItem;
  public isAdminPortal = false;

  constructor(
    protected readonly _router: Router,
    protected readonly _authenticationService: AuthenticationService,
    protected readonly _profileService: AgencyFeatureProfileService,
    protected readonly _userStateService: UserStateService,
    protected readonly _dashboardService: DashboardService,
    protected readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _loadingService: LoadingService,
  ) {
    this._setPortalByURL();
  }

  public ngOnInit() {
    this.agencySideNavMenuItems$ = this._authenticationService.isAuthenticated$.pipe(
      filter(authenticated => authenticated),
      switchMap(() => combineLatest([this._dashboardService.getDashboards$(), this._userStateService.initializeUsersCache$()])),
      map(([dashboards]) =>
        dashboards.map(({ menuIcon, transactionSet, dashboardLabel }) => ({
          icon: menuIcon,
          label: dashboardLabel,
          navigationParams: { transactionSet },
          navigationRoute: 'dashboard',
        })),
      ),
      untilDestroyed(this),
    );

    this._profileService
      .getProfile$()
      .pipe(
        take(1),
        tap((user: UserModel | null) => {
          if (!user) return;

          this.profileMenuItemList[0].label = user.displayName;
          this.profileMenuItemList[0].subTitle = user.email;
        }),
      )
      .subscribe();

    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(event => event as NavigationEnd),
        tap(_event => {
          this._setPortalByURL();
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  public onMenuItemSelect(event: string) {
    switch (event) {
      case NuverialMenuOptions.LOGOUT:
        this._authenticationService.signOut().pipe(take(1)).subscribe();
        break;
      case NuverialMenuOptions.PREFERENCES:
        break;
      case NuverialMenuOptions.PROFILE:
        break;
    }
  }

  private _setPortalByURL(): void {
    this.isAdminPortal = this._router.url.includes('admin');

    this.portalNavigator = {
      icon: 'admin_panel_settings',
      label: 'Toggle Admin Portal',
      navigationRoute: this.isAdminPortal ? 'dashboard' : 'admin',
    };
  }
}
