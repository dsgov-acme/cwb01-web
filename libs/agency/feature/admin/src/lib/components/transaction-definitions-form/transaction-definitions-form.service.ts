import { Injectable } from '@angular/core';
import { Filter, PagingRequestModel } from '@dsg/shared/utils/http';
import { ISchemaDefinition, ISchemasPaginationResponse, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionDefinitionsFormService {
  private readonly _schemas: BehaviorSubject<ISchemaDefinition[]> = new BehaviorSubject<ISchemaDefinition[]>([]);
  public schemas$: Observable<ISchemaDefinition[]> = this._schemas.asObservable();

  constructor(private readonly _workApiRoutesService: WorkApiRoutesService) {}

  /**
   * Loads schemas list for selection and caching
   */
  public loadSchemas$(filters?: Filter[], pagingRequestModel?: PagingRequestModel): Observable<ISchemasPaginationResponse<ISchemaDefinition>> {
    return this._getSchemaDefinitionsList$(filters, pagingRequestModel);
  }

  /**
   * Get schemas list for selection and caching
   */
  private _getSchemaDefinitionsList$(filters?: Filter[], pagingRequestModel?: PagingRequestModel): Observable<ISchemasPaginationResponse<ISchemaDefinition>> {
    return this._workApiRoutesService.getSchemaDefinitionsList$(filters, pagingRequestModel).pipe(
      tap(schemaPaginationResponse => {
        const newSchemas = schemaPaginationResponse.items.filter(schema => {
          return !this._schemas.value.some(existingSchema => existingSchema.id === schema.id);
        });

        this._schemas.next([...this._schemas.value, ...newSchemas].sort((a, b) => a.name.localeCompare(b.name)));
      }),
    );
  }
}
