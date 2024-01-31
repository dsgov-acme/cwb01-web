import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerProfileInvite, EnumMapType, IUserEmployerProfile, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService, UserStateService } from '@dsg/shared/feature/app-state';
import {
  ConfirmationModalComponent,
  ConfirmationModalReponses,
  IDisplayedColumn,
  ITableAction,
  ITableActionEvent,
  ITag,
  LoadingService,
  NuverialSnackBarService,
  NuverialSpinnerComponent,
  NuverialTableComponent,
} from '@dsg/shared/ui/nuverial';
import { Filter, IPagingMetadata, PagingRequestModel, SortOrder } from '@dsg/shared/utils/http';
import { BehaviorSubject, EMPTY, Observable, catchError, combineLatest, filter, firstValueFrom, from, of, switchMap, take, tap } from 'rxjs';
import { InviteService } from '../../../services';

export interface InviteListColumn extends Omit<EmployerProfileInvite, 'fromSchema' | 'toSchema'> {
  actions: ITableAction[];
  role: string;
  status: ITag;
}

export enum InviteListActions {
  Resend = 'resend',
  Delete = 'delete',
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialTableComponent, NuverialSpinnerComponent],
  selector: 'dsg-invite-list',
  standalone: true,
  styleUrls: ['./invite-list.component.scss'],
  templateUrl: './invite-list.component.html',
})
export class InviteListComponent {
  @Input() public search$!: Observable<string>;
  @Input() public reset$!: Observable<boolean>;
  @Output() public readonly count = new EventEmitter<number>();

  private readonly _getInvites$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  public displayedColumns: IDisplayedColumn[] = [
    { attributePath: 'email', label: 'Email', sortable: false, width: '14%' },
    { attributePath: 'role', label: 'Role', sortable: false, width: '14%' },
    { attributePath: 'createdTimestamp', label: 'Invite Sent', sortable: true, type: 'datetime', width: '14%' },
    { attributePath: 'expires', label: 'Expiration', sortable: true, type: 'datetime', width: '14%' },
    { attributePath: 'status', label: 'Status', sortable: false, type: 'pill', width: '8%' },
    { attributePath: 'actions', label: 'Actions', sortable: false, type: 'actions', width: '8%' },
  ];
  public dataSourceTable = new MatTableDataSource<unknown>();
  public pagingMetadata: IPagingMetadata | undefined;
  public readonly pagingRequestModel: PagingRequestModel = new PagingRequestModel({}, this._router, this._activatedRoute);
  public sortDirection: SortDirection = 'asc';
  private readonly _inviteListActions = InviteListActions;
  private readonly _tableActions: ITableAction[] = [
    {
      accessLevel: 'ADMIN',
      icon: 'forward_to_inbox',
      id: this._inviteListActions.Resend,
    },
    {
      accessLevel: 'ADMIN',
      icon: 'delete',
      id: this._inviteListActions.Delete,
    },
  ];

  private _userProfile?: IUserEmployerProfile;

  public readonly invitesList$: Observable<InviteListColumn[]> = this._userStateService.userProfile$.pipe(
    filter(profile => !!profile),
    tap(profile => {
      this._userProfile = profile;
    }),
    switchMap(() => this.reset$),
    tap(reset => reset && this.pagingRequestModel.reset()),
    switchMap(() => this.search$),
    switchMap(search => combineLatest([of(search), this._getInvites$.asObservable()])),
    this._loadingService.switchMapWithLoading(([search, _]) => {
      const invitesFilter: Filter[] = [];
      if (search) {
        invitesFilter.push({ field: 'email', value: search });
      }

      return this._workApiRoutesService.getEmployerProfileInvites$(this._userProfile?.id || '', invitesFilter, this.pagingRequestModel).pipe(
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
      );
    }),
    catchError(_ => {
      this._nuverialSnackBarService.notifyApplicationError();
      this.dataSourceTable = new MatTableDataSource<unknown>([]);
      this._cdr.detectChanges();

      return EMPTY;
    }),
  );

  constructor(
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _workApiRoutesService: WorkApiRoutesService,
    private readonly _userStateService: UserStateService,
    private readonly _enumService: EnumerationsStateService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _dialog: MatDialog,
    private readonly _inviteService: InviteService,
    private readonly _loadingService: LoadingService,
  ) {}

  public setPage($event: PageEvent): void {
    this.pagingRequestModel.pageSize = $event.pageSize;
    this.pagingRequestModel.pageNumber = $event.pageIndex;
    this._getInvites$.next();
  }

  public sortData($event: Sort): void {
    this.pagingRequestModel.sortBy = $event.active;
    this.pagingRequestModel.sortOrder = $event.direction.toUpperCase() as SortOrder;
    this._getInvites$.next();
  }

  private async _buildDataSourceTable(invites: EmployerProfileInvite[]): Promise<InviteListColumn[]> {
    const userList: InviteListColumn[] = [];

    if (invites.length) {
      for (const invite of invites) {
        const expiresDate = new Date(invite.expires);
        const item: InviteListColumn = {
          ...invite,
          actions: this._actions,
          role: (await firstValueFrom(this._enumService.getDataFromEnum$(EnumMapType.ProfileAccessLevels, invite.accessLevel))).label,
          status: {
            backgroundColor: this._getStatusColor(invite.claimed, expiresDate),
            icon: this._getStatusIcon(expiresDate),
            label: this._getStatusLabel(invite.claimed, expiresDate),
          },
        };

        userList.push(item);
      }
    }

    return userList;
  }

  private get _actions() {
    return this._tableActions.filter(action => action.accessLevel === this._userProfile?.level);
  }

  private _getStatusLabel(claimed: boolean, expires: Date): string {
    if (claimed) return 'Claimed';

    return new Date() > expires ? 'Expired' : 'Pending';
  }

  private _getStatusColor(claimed: boolean, expires: Date): `--${string}` {
    if (claimed) return '--theme-color-success';

    return new Date() > expires ? '--theme-color-error' : '--theme-color-primary';
  }

  private _getStatusIcon(expires: Date): string | undefined {
    return new Date() > expires ? 'error' : undefined;
  }

  public handleInviteAction(event: ITableActionEvent) {
    if (event.action === this._inviteListActions.Delete) {
      this._deleteInvite(event.column as InviteListColumn);
    }
    if (event.action === this._inviteListActions.Resend) {
      this._resendInvite(event.column as InviteListColumn);
    }
  }

  private _deleteInvite(invite: InviteListColumn) {
    this._dialog
      .open(ConfirmationModalComponent, {
        autoFocus: false,
        data: {
          contentText: 'This will delete the invite to your Employer Portal',
          primaryAction: 'DO NOT DELETE',
          secondaryAction: 'DELETE',
          title: 'Delete Invite?',
        },
      })
      .afterClosed()
      .pipe(
        switchMap(response => {
          if (response && response === ConfirmationModalReponses.SecondaryAction) {
            return this._inviteService.deleteEmployerProfileInvite$(invite.profileId, invite.id).pipe(
              tap(() => {
                this._nuverialSnackBarService.notifyApplicationSuccess();
                this._getInvites$.next();
              }),
              catchError(() => {
                this._nuverialSnackBarService.notifyApplicationError('Error Deleting Invite');

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

  private _resendInvite(invite: InviteListColumn) {
    this._dialog
      .open(ConfirmationModalComponent, {
        autoFocus: false,
        data: {
          contentText: 'This will resend the invite to the selected user',
          primaryAction: 'DO NOT RESEND',
          secondaryAction: 'RESEND',
          title: 'Resend Invite?',
        },
      })
      .afterClosed()
      .pipe(
        switchMap(response => {
          if (response && response === ConfirmationModalReponses.SecondaryAction) {
            return this._inviteService.resendInvite$(invite.profileId, invite.id, invite.email, invite.accessLevel).pipe(
              tap(() => {
                this._nuverialSnackBarService.notifyApplicationSuccess();
                this._getInvites$.next();
              }),
              catchError(() => {
                this._nuverialSnackBarService.notifyApplicationError('Error Resending Invite');

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
