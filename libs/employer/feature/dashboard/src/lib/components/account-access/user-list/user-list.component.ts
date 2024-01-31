import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerProfileLink, EnumMapType, IUserEmployerProfile, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService, UserStateService } from '@dsg/shared/feature/app-state';
import {
  ConfirmationModalComponent,
  ConfirmationModalReponses,
  IDisplayedColumn,
  ITableAction,
  ITableActionEvent,
  LoadingService,
  NuverialSnackBarService,
  NuverialSpinnerComponent,
  NuverialTableComponent,
} from '@dsg/shared/ui/nuverial';
import { Filter, IPagingMetadata, PagingRequestModel, SortOrder } from '@dsg/shared/utils/http';
import { BehaviorSubject, EMPTY, Observable, catchError, combineLatest, filter, firstValueFrom, from, of, switchMap, take, tap } from 'rxjs';
import { UserActionModalComponent, UserActionModalModes } from '../user-action-modal/user-action-modal.component';

export interface UserListColumn extends Omit<EmployerProfileLink, 'fromSchema' | 'toSchema'> {
  actions: ITableAction[];
  displayName: string;
  email: string;
  role: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialTableComponent, NuverialSpinnerComponent, MatDialogModule],
  selector: 'dsg-user-list',
  standalone: true,
  styleUrls: ['./user-list.component.scss'],
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  @Input() public search$!: Observable<string>;
  @Input() public reset$!: Observable<boolean>;
  @Output() public readonly count = new EventEmitter<number>();

  private readonly _getUsers$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  public displayedColumns: IDisplayedColumn[] = [
    { attributePath: 'displayName', label: 'Employee Name', sortable: false, width: '18%' },
    { attributePath: 'email', label: 'Email', sortable: false, width: '18%' },
    { attributePath: 'role', label: 'Role', sortable: false, width: '18%' },
    { attributePath: 'createdTimestamp', label: 'Created On', sortable: true, type: 'datetime', width: '18%' },
    { attributePath: 'actions', label: 'Actions', sortable: false, type: 'actions', width: '10%' },
  ];
  public dataSourceTable = new MatTableDataSource<unknown>();
  public pagingMetadata: IPagingMetadata | undefined;
  public readonly pagingRequestModel: PagingRequestModel = new PagingRequestModel({}, this._router, this._activatedRoute);
  public sortDirection: SortDirection = 'asc';
  private readonly _tableActions: ITableAction[] = [
    {
      accessLevel: 'ADMIN',
      icon: 'edit',
      id: UserActionModalModes.edit,
    },
    {
      accessLevel: 'ADMIN',
      icon: 'delete',
      id: 'delete',
    },
  ];

  private _userProfile?: IUserEmployerProfile;

  public readonly usersList$: Observable<UserListColumn[]> = this._userStateService.userProfile$.pipe(
    filter(profile => !!profile),
    tap(profile => {
      this._userProfile = profile;
    }),
    switchMap(() => this.reset$),
    tap(reset => reset && this.pagingRequestModel.reset()),
    switchMap(() => this.search$),
    switchMap(search => combineLatest([of(search), this._getUsers$.asObservable()])),
    this._loadingService.switchMapWithLoading(([search, _]) => {
      const usersFilter: Filter[] = [];
      if (search) {
        usersFilter.push({ field: 'name', value: search });
      }

      return this._workApiRoutesService.getEmployerProfileLinks$(this._userProfile?.id || '', usersFilter, this.pagingRequestModel).pipe(
        tap(response => {
          this.pagingMetadata = response.pagingMetadata;
          this.count.emit(this.pagingMetadata.totalCount);
          this.sortDirection = this.pagingRequestModel.sortOrder.toLowerCase() as SortDirection;
        }),
        switchMap(response => {
          return from(this._buildDataSourceTable(response.items));
        }),
        tap(userList => {
          this.dataSourceTable = new MatTableDataSource<unknown>(userList);
        }),
        catchError(() => {
          this._nuverialSnackBarService.notifyApplicationError();
          this.dataSourceTable = new MatTableDataSource<unknown>([]);
          this._cdr.detectChanges();

          return EMPTY;
        }),
      );
    }),
  );

  constructor(
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _dialog: MatDialog,
    private readonly _workApiRoutesService: WorkApiRoutesService,
    private readonly _userStateService: UserStateService,
    private readonly _enumService: EnumerationsStateService,
    private readonly _loadingService: LoadingService,
    private readonly _cdr: ChangeDetectorRef,
  ) {}

  public setPage($event: PageEvent): void {
    this.pagingRequestModel.pageSize = $event.pageSize;
    this.pagingRequestModel.pageNumber = $event.pageIndex;
    this._getUsers$.next();
  }

  public sortData($event: Sort): void {
    this.pagingRequestModel.sortBy = $event.active;
    this.pagingRequestModel.sortOrder = $event.direction.toUpperCase() as SortOrder;
    this._getUsers$.next();
  }

  private async _buildDataSourceTable(links: EmployerProfileLink[]): Promise<UserListColumn[]> {
    const userList: UserListColumn[] = [];

    if (links.length) {
      for (const link of links) {
        const item: UserListColumn = {
          ...link,
          actions: this._actions,
          displayName: await firstValueFrom(this._userStateService.getUserDisplayName$(link.userId)),
          email: await firstValueFrom(this._userStateService.getUserEmail$(link.userId)),
          role: (await firstValueFrom(this._enumService.getDataFromEnum$(EnumMapType.ProfileAccessLevels, link.profileAccessLevel))).label,
        };

        userList.push(item);
      }
    }

    return userList;
  }

  private get _actions() {
    return this._tableActions.filter(action => action.accessLevel === this._userProfile?.level);
  }

  public handleUserAction(event: ITableActionEvent) {
    if (event.action === UserActionModalModes.edit) {
      this._editUser(event.column as UserListColumn);
    }
    if (event.action === 'delete') {
      this._deleteUser(event.column as UserListColumn);
    }
  }

  private _editUser(user: UserListColumn) {
    this._dialog
      .open(UserActionModalComponent, {
        autoFocus: false,
        data: {
          mode: UserActionModalModes.edit,
          user,
        },
      })
      .afterClosed()
      .pipe(
        switchMap(userForm => {
          if (userForm && !!Object.keys(userForm).length) {
            return this._workApiRoutesService.updateEmployerProfileLinkAccessLevel$(this._userProfile?.id || '', user.userId, userForm.role).pipe(
              tap(() => {
                this._nuverialSnackBarService.notifyApplicationSuccess();
                this._getUsers$.next();
              }),
              catchError(() => {
                this._nuverialSnackBarService.notifyApplicationError('Error editing user');

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

  private _deleteUser(user: UserListColumn) {
    this._dialog
      .open(ConfirmationModalComponent, {
        autoFocus: false,
        data: {
          contentText: 'This will remove the user from your Employer Portal',
          primaryAction: 'DO NOT DELETE',
          secondaryAction: 'DELETE',
          title: 'Delete User?',
        },
      })
      .afterClosed()
      .pipe(
        switchMap(response => {
          if (response && response === ConfirmationModalReponses.SecondaryAction) {
            return this._workApiRoutesService.deleteEmployerProfileLink$(this._userProfile?.id || '', user.userId).pipe(
              tap(() => {
                this._nuverialSnackBarService.notifyApplicationSuccess();
                this._getUsers$.next();
              }),
              catchError(() => {
                this._nuverialSnackBarService.notifyApplicationError('Error Deleting user');

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
}
