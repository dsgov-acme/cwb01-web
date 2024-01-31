import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT_CONFIGURATION, IEnvironment } from '@dsg/shared/utils/environment';
import { HttpBaseService, PagingResponseModel } from '@dsg/shared/utils/http';
import { LoggingService } from '@dsg/shared/utils/logging';
import { Observable, map } from 'rxjs';
import { AuditEventModel, GetEventsParams, IAuditEvent, IEventsPaginationResponse } from '../models/audit-event/audit-event.model';

/**
 * This service is only used to expose endpoints, no logic should go in this service
 */
@Injectable({
  providedIn: 'root',
})
export class AuditRoutesService extends HttpBaseService {
  constructor(
    protected override readonly _http: HttpClient,
    @Inject(ENVIRONMENT_CONFIGURATION) protected readonly _environment: IEnvironment,
    protected override readonly _loggingService: LoggingService,
  ) {
    super(_http, `${_environment.httpConfiguration.baseUrl}/as/api`, _loggingService);
  }

  /**
   * Get all events  with an optional filter
   */
  public getEvents$(params: GetEventsParams): Observable<IEventsPaginationResponse<AuditEventModel>> {
    const { transactionId, businessObjectType, pagingRequestModel, filters } = params;

    let httpParams = new HttpParams();
    filters?.forEach(filter => {
      httpParams = httpParams.append(filter.field, filter.value);
    });

    return this._handleGet$<IEventsPaginationResponse<IAuditEvent>>(
      `/v1/audit-events/${businessObjectType}/${transactionId}/${pagingRequestModel ? pagingRequestModel.toSchema() : ''}`,
      filters
        ? {
            params: httpParams,
          }
        : '',
    ).pipe(
      map(eventsSchema => ({
        events: eventsSchema.events.map(eventSchema => new AuditEventModel(eventSchema)),
        pagingMetadata: new PagingResponseModel(eventsSchema.pagingMetadata),
      })),
    );
  }
}
