import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagingMetadata, PagingRequestModel, pageSizeOptions } from '@dsg/shared/utils/http';
import { SplitCamelCasePipe } from '../../pipes';
import { NuverialIconComponent } from '../icon';
import { NuverialSpinnerComponent } from '../spinner';
import { NuverialTagComponent } from '../tag';
import { IDisplayedColumn, ITableActionEvent } from './table.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatPaginatorModule,
    NuverialSpinnerComponent,
    SplitCamelCasePipe,
    MatTableModule,
    MatSortModule,
    NuverialIconComponent,
    NuverialTagComponent,
  ],
  selector: 'nuverial-table',
  standalone: true,
  styleUrls: ['./table.component.scss'],
  templateUrl: './table.component.html',
})
export class NuverialTableComponent {
  public displayedColumnsValues: string[] = [];
  private _displayedColumns: IDisplayedColumn[] = [];
  @Input()
  public get displayedColumns(): IDisplayedColumn[] {
    return this._displayedColumns;
  }
  public set displayedColumns(displayedColumns: IDisplayedColumn[]) {
    this._displayedColumns = displayedColumns;
    this.displayedColumnsValues = displayedColumns.map(x => x.attributePath);
  }

  @Input() public listIsLoading = false;

  @Input() public dataSourceTable = new MatTableDataSource<unknown>();

  @Input() public sortDirection: SortDirection = 'asc';

  @Input() public pagingRequestModel: PagingRequestModel = new PagingRequestModel({}, this._router, this._route);

  @Input() public pagingMetadata?: IPagingMetadata;

  @Input() public ariaLabel?: string = 'Data Table';

  @Output() public readonly sortData = new EventEmitter<Sort>();

  @Output() public readonly setPage = new EventEmitter<PageEvent>();

  @Output() public readonly clickRow = new EventEmitter<{ id: string; key: string }>();

  @Output() public readonly clickAction = new EventEmitter<ITableActionEvent>();

  public readonly pageSizeOptions = pageSizeOptions;

  constructor(private readonly _router: Router, private readonly _route: ActivatedRoute) {}

  public trackByFn(index: number): number {
    return index;
  }
}
