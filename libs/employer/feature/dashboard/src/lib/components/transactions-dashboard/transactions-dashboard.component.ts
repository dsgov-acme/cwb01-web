import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EnumMapType,
  ITransaction,
  ITransactionsPaginationResponse,
  PriorityVisuals,
  TransactionTableData,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService } from '@dsg/shared/feature/app-state';
import {
  IDisplayedColumn,
  IPriorityColumn,
  ITag,
  NuverialButtonComponent,
  NuverialIconComponent,
  NuverialSnackBarService,
  NuverialSpinnerComponent,
  NuverialTableComponent,
  NuverialTextInputComponent,
  SplitCamelCasePipe,
} from '@dsg/shared/ui/nuverial';
import { Filter, IPagingMetadata, PagingRequestModel, PagingResponseModel, SortOrder, pageSizeOptions } from '@dsg/shared/utils/http';
import { BehaviorSubject, Observable, catchError, firstValueFrom, of, switchMap, tap } from 'rxjs';
import { IDashboardCategory } from '../../models';
import { DashboardService } from '../../services';

interface EmployerTransactionTableData extends Omit<TransactionTableData, 'priority' | 'status'> {
  priority: IPriorityColumn;
  status: ITag;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NuverialTextInputComponent,
    MatPaginatorModule,
    NuverialSpinnerComponent,
    SplitCamelCasePipe,
    MatTableModule,
    MatSortModule,
    NuverialButtonComponent,
    NuverialIconComponent,
    NuverialTableComponent,
  ],
  providers: [DatePipe],
  selector: 'dsg-transactions-dashboard',
  standalone: true,
  styleUrls: ['./transactions-dashboard.component.scss'],
  templateUrl: './transactions-dashboard.component.html',
})
export class TransactionsDashboardComponent implements OnInit {
  public displayedColumns: IDisplayedColumn[] = [
    { attributePath: 'priority', label: 'Priority', sortable: true, type: 'priority', width: '10%' },
    { attributePath: 'externalId', label: 'Transaction Id', sortable: false, width: '10%' },
    { attributePath: 'transactionDefinitionName', label: 'Type', sortable: false, width: '20%' },
    { attributePath: 'createdTimestamp', label: 'Date Created', sortable: true, type: 'datetime', width: '10%' },
    { attributePath: 'lastUpdatedTimestamp', label: 'Last Updated', sortable: true, type: 'datetime', width: '10%' },
    { attributePath: 'claimant', label: 'Claimant', sortable: false, width: '10%' },
    { attributePath: 'employer', label: 'Employer', sortable: false, width: '10%' },
    { attributePath: 'status', label: 'Status', sortable: true, type: 'pill', width: '10%' },
    { attributePath: 'isComplete', icon: 'chat', label: 'Complete', sortable: false, type: 'icon', width: '10%' },
  ];
  public priorityVisuals = PriorityVisuals;
  public searchInput = new FormControl();
  public transactionList: ITransaction[] = [];
  public transactionListIsLoading = true;
  public dataSourceTable = new MatTableDataSource<unknown>();
  public sortDirection: SortDirection = 'asc';
  public pagingMetadata: IPagingMetadata | undefined;
  public pageSizeOptions = pageSizeOptions;
  public readonly pagingRequestModel: PagingRequestModel = new PagingRequestModel({}, this._router, this._activatedRoute);
  public searchBoxIcon = 'search';
  public transactionsDashboardTitle = '';
  private _category?: IDashboardCategory;
  private readonly _searchFilter: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @ViewChild(MatSort) public tableSort!: MatSort;

  constructor(
    private readonly _workApiRoutesService: WorkApiRoutesService,
    private readonly _router: Router,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _dashboardService: DashboardService,
    private readonly _enumService: EnumerationsStateService,
  ) {}

  public transactionsList$: Observable<ITransactionsPaginationResponse<ITransaction>> = this._searchFilter.asObservable().pipe(
    switchMap(searchText => {
      const transactionFilterList: Filter[] = [
        {
          field: 'profileType',
          value: 'EMPLOYER',
        },
      ];
      if (searchText) {
        transactionFilterList.push({ field: 'transactionDefinitionKey', value: searchText });
      }

      return this._workApiRoutesService.getTransactionsList$('UnemploymentInsurance', transactionFilterList, this.pagingRequestModel).pipe(
        tap(x => {
          this.transactionListIsLoading = false;
          this.transactionList = x.items;
          this.pagingMetadata = x.pagingMetadata;
          this._buildDataSourceTable();
        }),
      );
    }),
    catchError(_ => {
      this.transactionListIsLoading = false;
      this._cdr.markForCheck();
      this._nuverialSnackBarService.notifyApplicationError();

      return of({
        items: [],
        pagingMetadata: new PagingResponseModel(),
      });
    }),
  );

  public ngOnInit(): void {
    const categoryRoute = this._activatedRoute.parent?.snapshot.paramMap.get('category') ?? '';
    this._category = this._dashboardService.getDashboardCategoryByRoute(categoryRoute);
    this.transactionsDashboardTitle = this._category?.name ?? 'Transactions Dashboard';
  }

  public handleSearch() {
    this.pagingRequestModel.pageNumber = 0;
    this.getTransactionsList();
  }

  public getTransactionsList() {
    this.transactionListIsLoading = true;
    const searchText = this.searchInput.value ? this.searchInput.value.trim() : '';
    this._searchFilter.next(searchText);
  }

  public setSearchBoxIcon() {
    const searchText = this.searchInput.value ? this.searchInput.value.trim().toLowerCase() : '';
    this.searchBoxIcon = searchText ? 'cancel_outline' : 'search';
  }

  public clearSearch() {
    this.searchInput.setValue('');
    this.setSearchBoxIcon();
    this.getTransactionsList();
  }

  public setPage($event: PageEvent): void {
    this.pagingRequestModel.pageSize = $event.pageSize;
    this.pagingRequestModel.pageNumber = $event.pageIndex;
    this.getTransactionsList();
  }

  public sortData($event: Sort): void {
    this.pagingRequestModel.sortBy = $event.active;
    this.pagingRequestModel.sortOrder = $event.direction.toUpperCase() as SortOrder;
    this.getTransactionsList();
  }

  private async _buildDataSourceTable(): Promise<void> {
    const transactionTableData: EmployerTransactionTableData[] = [];
    if (this.transactionList) {
      for (const transaction of this.transactionList) {
        const item: EmployerTransactionTableData = {
          ...transaction,
          claimant: transaction.data.personalInformation?.fullName || '',
          employer: transaction.data.employmentInformation?.employerName || '',
          priority: {
            class: transaction.priority.toLowerCase(),
            icon: this.priorityVisuals[transaction.priority.toLowerCase()].icon,
            value: (await firstValueFrom(this._enumService.getDataFromEnum$(EnumMapType.TransactionPriorities, transaction.priority))).label,
          },
          status: {
            label: transaction.status,
          },
        };

        transactionTableData.push(item);
      }

      this.dataSourceTable = new MatTableDataSource<unknown>(transactionTableData);
      this._cdr.detectChanges();
      this.sortDirection = this.pagingRequestModel.sortOrder.toLowerCase() as SortDirection;
    }
  }

  public navigateToTransactionDetails(transactionID: string) {
    this._router.navigate(['/dashboard', this._category?.route, 'transaction', transactionID, this._category?.subCategories[0].relativeRoute]);
  }

  public trackByFn(index: number): number {
    return index;
  }
}
