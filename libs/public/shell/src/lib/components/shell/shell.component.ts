import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { PublicFeatureProfileService } from '@dsg/public/feature/profile';
import { UserModel } from '@dsg/shared/data-access/user-api';
import { AuthenticationService } from '@dsg/shared/feature/authentication';
import {
  INuverialMenuItem,
  LoadingService,
  NuverialButtonComponent,
  NuverialFooterComponent,
  NuverialHeaderComponent,
  NuverialIconComponent,
  NuverialMenuComponent,
  NuverialMenuOptions,
  NuverialSpinnerComponent,
} from '@dsg/shared/ui/nuverial';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

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

  constructor(
    protected readonly _router: Router,
    protected _authenticationService: AuthenticationService,
    protected readonly _profileService: PublicFeatureProfileService,
    private readonly _loadingService: LoadingService,
  ) {}

  public ngOnInit() {
    this._profileService
      .getProfile$()
      .pipe(
        tap((user: UserModel | null) => {
          if (!user) return;
          this.profileMenuItemList[0].label = user.displayName;
          this.profileMenuItemList[0].subTitle = user.email;
        }),
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
      case this.profileMenuItemList[0].key:
        this._router.navigate(['/profile']);
        break;
      default:
        break;
    }
  }
}
