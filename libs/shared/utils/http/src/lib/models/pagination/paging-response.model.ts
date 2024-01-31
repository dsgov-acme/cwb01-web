import { SchemaModel } from '../base.model';

export interface IPaginationResponse {
  pagingMetadata: PagingResponseModel;
}

export interface IPagingMetadata {
  nextPage?: string;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export class PagingResponseModel implements SchemaModel<IPagingMetadata> {
  public nextPage = '';
  public pageNumber = 0;
  public pageSize = 10;
  public totalCount = 0;

  constructor(paging?: IPagingMetadata) {
    if (paging) {
      this.fromSchema(paging);
    }
  }
  public fromSchema(pagingMetadata: IPagingMetadata): void {
    this.nextPage = pagingMetadata.nextPage || '';
    this.pageNumber = pagingMetadata.pageNumber;
    this.pageSize = pagingMetadata.pageSize;
    this.totalCount = pagingMetadata.totalCount;
  }
  public toSchema(): IPagingMetadata {
    throw new Error('Method not implemented.');
  }
}
