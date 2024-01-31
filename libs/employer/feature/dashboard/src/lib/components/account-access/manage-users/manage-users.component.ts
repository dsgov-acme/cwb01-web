import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IUserEmployerProfile } from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { NuverialButtonComponent, NuverialSnackBarService, NuverialTextInputComponent } from '@dsg/shared/ui/nuverial';
import { BehaviorSubject, EMPTY, Observable, catchError, combineLatest, of, switchMap, take, tap } from 'rxjs';
import { InviteService } from '../../../services';
import { InviteListComponent } from '../invite-list/invite-list.component';
import { UserActionModalComponent, UserActionModalModes } from '../user-action-modal/user-action-modal.component';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialTextInputComponent, NuverialButtonComponent, MatTabsModule, MatDialogModule, UserListComponent, InviteListComponent],
  selector: 'dsg-manage-users',
  standalone: true,
  styleUrls: ['./manage-users.component.scss'],
  templateUrl: './manage-users.component.html',
})
export class ManageUsersComponent implements OnInit {
  private readonly _userProfile$: Observable<IUserEmployerProfile | undefined> = this._userStateService.userProfile$;

  public searchInput = new FormControl();
  public searchBoxIcon = 'search';
  private readonly _search$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public search$ = this._search$.asObservable();
  private readonly _reset$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public reset$ = this._reset$.asObservable();

  public selectedIndex = 0;

  public userListCount = 0;
  public inviteListCount = 0;

  constructor(
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _userStateService: UserStateService,
    private readonly _inviteService: InviteService,
  ) {}

  public ngOnInit(): void {
    this._activatedRoute.queryParams
      .pipe(
        tap(params => {
          this.selectedIndex = params['tab'] || 0;
        }),
      )
      .subscribe();
  }

  public inviteUser() {
    this._dialog
      .open(UserActionModalComponent, {
        data: {
          autoFocus: false,
          mode: UserActionModalModes.invite,
        },
      })
      .afterClosed()
      .pipe(
        switchMap(userForm => combineLatest([of(userForm), this._userProfile$])),
        take(1),
        switchMap(([userForm, userProfile]) => {
          if (userForm && !!Object.keys(userForm).length) {
            return this._inviteService.inviteUserEmployerProfile$(userProfile?.id || '', userForm.emailAddress, userForm.role).pipe(
              tap(() => {
                this._nuverialSnackBarService.notifyApplicationSuccess('User Invited!');
                this.clearSearch();
              }),
              catchError((error: HttpErrorResponse) => {
                let msg: string | undefined = undefined;
                if (error?.status === 409) {
                  msg = 'This user has already been invited';
                }
                this._nuverialSnackBarService.notifyApplicationError(msg);

                return EMPTY;
              }),
            );
          }

          return EMPTY;
        }),
        take(1),
      )
      .subscribe();
  }

  public clearSearch() {
    this.searchInput.setValue('');
    this.setSearchBoxIcon();
    this.handleSearch();
  }

  public handleSearch() {
    this._reset$.next(true);
    this._search$.next(this.searchInput.value);
  }

  public setSearchBoxIcon() {
    const searchText = this.searchInput.value ? this.searchInput.value.trim().toLowerCase() : '';
    this.searchBoxIcon = searchText ? 'cancel_outline' : 'search';
  }

  public async setSelectedIndex(index: number) {
    await this._router.navigate([], {
      queryParams: { tab: index } as Params,
      queryParamsHandling: 'merge',
      relativeTo: this._activatedRoute,
    });
    this._reset$.next(true);
  }

  public setUserListCount(count: number) {
    this.userListCount = count;
  }

  public setInviteListCount(count: number) {
    this.inviteListCount = count;
  }
}
