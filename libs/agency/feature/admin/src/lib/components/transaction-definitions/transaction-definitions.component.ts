import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagingMetadata, PagingRequestModel, PagingResponseModel, SortOrder, pageSizeOptions } from '@dsg/shared/utils/http';
import {
  ITransactionDefinition,
  ITransactionsPaginationResponse,
  TransactionDefinitionsTableData,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import {
  IDisplayedColumn,
  NuverialButtonComponent,
  NuverialIconComponent,
  NuverialSnackBarService,
  NuverialSpinnerComponent,
  NuverialTableComponent,
  NuverialTextInputComponent,
  SplitCamelCasePipe,
} from '@dsg/shared/ui/nuverial';
import { BehaviorSubject, Observable, catchError, of, switchMap, tap } from 'rxjs';

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
  selector: 'dsg-transaction-definitions',
  standalone: true,
  styleUrls: ['./transaction-definitions.component.scss'],
  templateUrl: './transaction-definitions.component.html',
})
export class TransactionDefinitionsComponent {
  public displayedColumns: IDisplayedColumn[] = [
    { attributePath: 'key', label: 'Key', sortable: true, width: '18%' },
    { attributePath: 'name', label: 'Name', sortable: false, width: '20%' },
    { attributePath: 'description', label: 'Description', sortable: false, width: '22%' },
    { attributePath: 'createdTimestamp', label: 'Date Created', sortable: true, type: 'datetime', width: '13%' },
    { attributePath: 'lastUpdatedTimestamp', label: 'Last Updated', sortable: true, type: 'datetime', width: '13%' },
    { attributePath: 'category', label: 'Category', sortable: false, width: '14%' },
  ];
  public searchInput = new FormControl();
  public transactionList: ITransactionDefinition[] = [];
  public transactionListIsLoading = true;
  public dataSourceTable = new MatTableDataSource<unknown>();
  public sortDirection: SortDirection = 'asc';
  public pagingMetadata: IPagingMetadata | undefined;
  public pageSizeOptions = pageSizeOptions;
  public readonly pagingRequestModel: PagingRequestModel = new PagingRequestModel({}, this._router, this._activatedRoute);
  public searchBoxIcon = 'search';
  private readonly _searchFilter: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @ViewChild(MatSort) public tableSort!: MatSort;

  constructor(
    private readonly _workApiRoutesService: WorkApiRoutesService,
    private readonly _router: Router,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
  ) {}

  public transactionDefinitionsList$: Observable<ITransactionsPaginationResponse<ITransactionDefinition>> = this._searchFilter.asObservable().pipe(
    switchMap(searchText =>
      this._workApiRoutesService.getTransactionDefinitionsList$([{ field: 'name', value: searchText }], this.pagingRequestModel).pipe(
        tap(x => {
          this.transactionListIsLoading = false;
          this.transactionList = x.items;
          this.pagingMetadata = x.pagingMetadata;
          this._buildDataSourceTable();
        }),
      ),
    ),
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

  public handleSearch() {
    this.pagingRequestModel.pageNumber = 0;
    this.getTransactionsList();
  }

  public getTransactionsList() {
    this.transactionListIsLoading = true;
    const searchText = this.searchInput.value ? this.searchInput.value.trim().toLowerCase() : '';
    this._searchFilter.next(searchText);
  }

  public navigateToCreateTransactionDefinition() {
    this._router.navigate(['/admin', 'transaction-definitions', 'create']);
  }

  public navigateToTransactionDefinition(transactionDefinitionKey: string) {
    this._router.navigate(['/admin', 'transaction-definitions', transactionDefinitionKey]);
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

  private _buildDataSourceTable(): void {
    const transactionTableData: TransactionDefinitionsTableData[] = [];
    if (this.transactionList) {
      for (const transaction of this.transactionList) {
        const item: TransactionDefinitionsTableData = {
          ...transaction,
        };
        transactionTableData.push(item);
      }

      this.dataSourceTable = new MatTableDataSource<unknown>(transactionTableData);
      this._cdr.detectChanges();
      this.sortDirection = this.pagingRequestModel.sortOrder.toLowerCase() as SortDirection;
    }
  }

  public trackByFn(index: number): number {
    return index;
  }
}
