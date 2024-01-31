/* istanbul ignore file */
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SchemaModel } from '../base.model';

export enum SortOrderButton {
  ascending = 'arrow_upward',
  descending = 'arrow_downward',
}

export type SortOrder = 'ASC' | 'DESC';

export enum SortType {
  sortBy,
  order,
}

export const pageSizeOptions = [10, 20, 50];

export interface IPagingRequest {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export class PagingRequestModel implements SchemaModel<IPagingRequest, string> {
  private _pageNumber = 0;
  private _pageSize = pageSizeOptions[0];
  private _sortBy = '';
  private _sortOrder: SortOrder = 'ASC';

  constructor(paging?: IPagingRequest, private readonly _router?: Router, private readonly _activatedRoute?: ActivatedRoute) {
    if (paging) {
      this.fromSchema(paging);
    }
  }

  private _navigateQueryParams() {
    const queryParams: Params = {};
    queryParams['pageNumber'] = this._pageNumber || null;
    queryParams['pageSize'] = this._pageSize !== pageSizeOptions[0] ? this._pageSize : null;
    queryParams['sortBy'] = this._sortBy || null;
    queryParams['sortOrder'] = this._sortOrder !== 'ASC' ? this._sortOrder : null;
    this._router?.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this._activatedRoute,
    });
  }
  public get pageNumber(): number {
    return this._pageNumber;
  }

  public set pageNumber(pageNumber: number) {
    this._pageNumber = pageNumber;
    this._navigateQueryParams();
  }

  public get pageSize(): number {
    return this._pageSize;
  }

  public set pageSize(pageSize: number) {
    this._pageSize = pageSize;
    this._navigateQueryParams();
  }

  public get sortBy(): string {
    return this._sortBy;
  }

  public set sortBy(sortBy: string) {
    this._sortBy = sortBy;
    this._navigateQueryParams();
  }

  public get sortOrder(): SortOrder {
    return this._sortOrder;
  }

  public set sortOrder(sortOrder: SortOrder) {
    this._sortOrder = sortOrder;
    this._navigateQueryParams();
  }

  public reset(overrides: Partial<IPagingRequest> = {}) {
    this.pageNumber = overrides.pageNumber ?? 0;
    this.pageSize = overrides.pageSize ?? pageSizeOptions[0];
    this.sortBy = overrides.sortBy ?? '';
    this.sortOrder = overrides.sortOrder ?? 'ASC';
  }

  public fromSchema(paging: IPagingRequest) {
    this._pageNumber = this._activatedRoute?.snapshot.queryParams['pageNumber'] || paging.pageNumber || 0;
    this._pageSize = this._activatedRoute?.snapshot.queryParams['pageSize'] || paging.pageSize || pageSizeOptions[0];
    this._sortBy = this._activatedRoute?.snapshot.queryParams['sortBy'] || paging.sortBy || '';
    this._sortOrder = this._activatedRoute?.snapshot.queryParams['sortOrder'] || paging.sortOrder || 'ASC';
  }

  public toSchema(): string {
    let paging = `?pageNumber=${this._pageNumber}&pageSize=${this._pageSize}&sortOrder=${this._sortOrder}`;

    if (this._sortBy) {
      paging += `&sortBy=${this._sortBy}`;
    }

    return paging;
  }
}
