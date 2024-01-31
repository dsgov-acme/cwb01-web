import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserModel } from '@dsg/shared/data-access/user-api';
import { EnumMapType, PriorityVisuals } from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService } from '@dsg/shared/feature/app-state';
import { EventsLogComponent } from '@dsg/shared/feature/events';
import { FormRendererComponent, FormRendererService } from '@dsg/shared/feature/form-nuv';
import {
  INavigableTab,
  INuverialBreadCrumb,
  INuverialSelectOption,
  NuverialBreadcrumbComponent,
  NuverialCopyButtonComponent,
  NuverialFooterActionsComponent,
  NuverialIconComponent,
  NuverialNavigableTabsComponent,
  NuverialPillComponent,
  NuverialSelectComponent,
  NuverialSnackBarService,
  NuverialSpinnerComponent,
  NuverialTabKeyDirective,
} from '@dsg/shared/ui/nuverial';
import { Filter, PagingRequestModel } from '@dsg/shared/utils/http';
import { UntilDestroy } from '@ngneat/until-destroy';
import { EMPTY, Observable, catchError, concatMap, finalize, map, of, switchMap, take, tap } from 'rxjs';
import { NotesComponent } from '../notes';
import { ReviewFormComponent } from '../review';
import { TransactionDetailService } from './transaction-detail.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormRendererComponent,
    FormsModule,
    ReactiveFormsModule,
    NotesComponent,
    NuverialCopyButtonComponent,
    NuverialSpinnerComponent,
    NuverialBreadcrumbComponent,
    NuverialIconComponent,
    NuverialTabKeyDirective,
    NuverialSelectComponent,
    NuverialPillComponent,
    ReviewFormComponent,
    RouterModule,
    EventsLogComponent,
    NuverialFooterActionsComponent,
    NuverialNavigableTabsComponent,
  ],
  selector: 'dsg-transaction-detail',
  standalone: true,
  styleUrls: ['./transaction-detail.component.scss'],
  templateUrl: './transaction-detail.component.html',
})
export class TransactionDetailComponent implements OnDestroy {
  public loadingSearchAgent = false;
  private readonly _agentsPagingRequestModel: PagingRequestModel = new PagingRequestModel({
    pageSize: 5,
  });
  public breadCrumbs: INuverialBreadCrumb[] = [{ label: 'Back To Dashboard', navigationPath: `/dashboard` }];
  public transaction$ = this._formRendererService.transaction$.pipe(
    tap(transactionModel => {
      if (this.priorityControl.value !== transactionModel.priority) {
        this.priorityControl.setValue(transactionModel.priority);
      }

      if (this.assignedToControl.value !== transactionModel.assignedTo) {
        this.assignedToControl.setValue(transactionModel.assignedTo);
      }

      this.tabs = [
        { key: 'details', label: 'Detail', relativeRoute: 'detail', useTransactionLabel: true },
        { key: 'notes', label: 'Notes', relativeRoute: 'notes', useTransactionLabel: false },
        { key: 'events', label: 'Activity Log', relativeRoute: 'events', useTransactionLabel: false },
        { key: 'messages', label: 'Messages', relativeRoute: 'messages', useTransactionLabel: false },
      ];
      this.baseRoute = `/dashboard/transaction/${transactionModel.id}`;
    }),
    concatMap(transactionModel => of(transactionModel)),
  );
  public user$ = this._transactionDetailService.user$;
  public priorityControl = new FormControl();
  public prioritySelectOptionsSorted$: Observable<INuverialSelectOption[]> = this._enumService.getEnumMap$(EnumMapType.TransactionPriorities).pipe(
    map(statuses => {
      const reviewStatusSelectOptions: INuverialSelectOption[] = [];

      Array.from(statuses.entries())
        .sort(([, a], [, b]) => {
          if (a.rank !== undefined && b.rank !== undefined) {
            return a.rank - b.rank;
          } else return 0;
        })
        .forEach(([key, value]) => {
          reviewStatusSelectOptions.push({
            color: PriorityVisuals[key.toLowerCase()].color,
            disabled: false,
            displayTextValue: value.label,
            key: key,
            prefixIcon: PriorityVisuals[key.toLowerCase()].icon,
            selected: false,
          });
        });

      return reviewStatusSelectOptions;
    }),
  );

  public assignedToControl = new FormControl();
  public assignedToSelectOptions: INuverialSelectOption[] = [];

  public activeTaskId = '';
  public isTransactionStatusRequestPending = false;

  public agentsSelectOptions$: Observable<INuverialSelectOption[]> = this.getAgents$().pipe(
    switchMap(_ => this._transactionDetailService.agents$),
    map(agents =>
      agents.map(agent => {
        return {
          disabled: false,
          displayTextValue: agent.displayName === agent.email ? agent.email : `${agent.displayName} - ${agent.email}`,
          key: agent.id,
          selected: false,
        };
      }),
    ),
  );

  public transactionActiveTask$ = this._transactionDetailService.transactionActiveTask$.pipe(
    tap(transactionActiveTask => (this.activeTaskId = transactionActiveTask?.key || '')),
  );

  public loadTransactionDetails$ = this._route.paramMap.pipe(
    switchMap(params => {
      const transactionId = params.get('transactionId') ?? '';

      return this._transactionDetailService.initialize$(transactionId).pipe(
        catchError(_error => {
          this._nuverialSnackBarService.notifyApplicationError();

          return EMPTY;
        }),
      );
    }),
  );

  public tabs: INavigableTab[] = [];
  public baseRoute = '';
  public getAgents$(filters?: Filter[]): Observable<UserModel[]> {
    return this._transactionDetailService.loadAgencyUsers$(filters, this._agentsPagingRequestModel);
  }

  public handlePriority(selectedOption: INuverialSelectOption): void {
    this.isTransactionStatusRequestPending = true;
    this._transactionDetailService
      .updateTransactionPriority$(selectedOption.key)
      .pipe(
        take(1),
        catchError(_error => {
          this._nuverialSnackBarService.notifyApplicationError('Error updating priority');
          this.priorityControl.setValue(this._formRendererService.transaction.priority);

          return EMPTY;
        }),
        finalize(() => {
          this.isTransactionStatusRequestPending = false;
          this._changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  public handleSearchAgent(search: string) {
    if (search) {
      this.loadingSearchAgent = true;
      const filters = [{ field: 'name', value: search }];

      this.getAgents$(filters)
        .pipe(
          take(1),
          tap(() => {
            this.loadingSearchAgent = false;
          }),
        )
        .subscribe();
    }
  }

  public handleAssignedTo(agentId: string): void {
    this.isTransactionStatusRequestPending = true;
    this._transactionDetailService
      .updateTransactionAssignedTo$(agentId)
      .pipe(
        take(1),
        catchError(_error => {
          this._nuverialSnackBarService.notifyApplicationError('Error updating assigned agent');
          this.priorityControl.setValue(this._formRendererService.transaction.assignedTo);

          return EMPTY;
        }),
        finalize(() => {
          this.isTransactionStatusRequestPending = false;
          this._changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  public handleUnassign(): void {
    this.handleAssignedTo('');
  }

  constructor(
    private readonly _formRendererService: FormRendererService,
    private readonly _transactionDetailService: TransactionDetailService,
    private readonly _route: ActivatedRoute,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _enumService: EnumerationsStateService,
  ) {}

  public copyId(id: string): void {
    navigator.clipboard.writeText(id);
  }

  public ngOnDestroy(): void {
    this._formRendererService.cleanUp();
    this._transactionDetailService.cleanUp();
  }

  public onActionClick(event: string) {
    this.isTransactionStatusRequestPending = true;

    this._transactionDetailService
      .reviewTransaction$(event, this.activeTaskId)
      .pipe(
        take(1),
        tap(_ => {
          this._nuverialSnackBarService.notifyApplicationSuccess();
        }),
        catchError(_error => {
          this._nuverialSnackBarService.notifyApplicationError('Error updating transaction status');

          return EMPTY;
        }),
        finalize(() => {
          this.isTransactionStatusRequestPending = false;
          this._changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  public trackByFn(index: number): number {
    return index;
  }
}
