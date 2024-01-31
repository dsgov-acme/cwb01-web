import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { DashboardService } from '@dsg/employer/feature/dashboard';
import { EmployerFeatureProfileService } from '@dsg/employer/feature/profile';
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
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

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
  public userAuthenticated$: Observable<boolean> = this._authenticationService.isAuthenticated$.pipe(map(authenticated => authenticated));
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

  public menuItemList: INuverialNavBarMenuItem[] = [];

  public isDashboard = true;

  constructor(
    protected readonly _router: Router,
    protected _authenticationService: AuthenticationService,
    protected readonly _profileService: EmployerFeatureProfileService,
    protected readonly _dashboardService: DashboardService,
    protected readonly _userState: UserStateService,
    private readonly _loadingService: LoadingService,
  ) {}

  public ngOnInit() {
    this._profileService
      .getProfile$()
      .pipe(
        tap(() => this._userState.initializeUserProfile()),
        tap((user: UserModel | null) => {
          if (!user) return;
          this.profileMenuItemList[0].label = user.displayName;
          this.profileMenuItemList[0].subTitle = user.email;
        }),
      )
      .subscribe();

    this.menuItemList = this._dashboardService.getDashboardCategories().map(category => ({
      icon: category.icon,
      label: category.name,
      navigationRoute: `/dashboard/${category.route}`,
      navigationSubRoute: category.hasTransactionList ? '' : `/${category.subCategories[0].relativeRoute}`,
    }));

    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(event => event as NavigationEnd),
        tap(() => {
          this._hideMenuByURL();
        }),
        untilDestroyed(this),
      )
      .subscribe();

    this._hideMenuByURL();
  }

  public onMenuItemSelect(event: string) {
    switch (event) {
      case NuverialMenuOptions.LOGOUT:
        this._authenticationService.signOut().pipe(take(1)).subscribe();
        break;
      case NuverialMenuOptions.PREFERENCES:
        break;
      case NuverialMenuOptions.PROFILE:
      case this.profileMenuItemList[0].key:
        this._router.navigate(['/profile']);
        break;
      default:
        break;
    }
  }

  private _hideMenuByURL(): void {
    this.isDashboard = this._router.url === '/dashboard';
  }
}
