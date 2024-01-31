import { Injectable } from '@angular/core';
import { AuditEventModel, AuditRoutesService, IEventsPaginationResponse } from '@dsg/shared/data-access/audit-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { FormRendererService } from '@dsg/shared/feature/form-nuv';
import { PagingRequestModel, PagingResponseModel } from '@dsg/shared/utils/http';
import { BehaviorSubject, Observable, ReplaySubject, firstValueFrom, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsLogService {
  private readonly _events: ReplaySubject<AuditEventModel[]> = new ReplaySubject<AuditEventModel[]>(1);
  private readonly _eventsPagination: BehaviorSubject<PagingResponseModel> = new BehaviorSubject<PagingResponseModel>(new PagingResponseModel());
  private readonly _businessObjectType: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly _transactionId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public events$: Observable<AuditEventModel[]> = this._events.asObservable();
  public eventsPagination$: Observable<PagingResponseModel> = this._eventsPagination.asObservable();

  private _getEvents$(pagingRequestModel?: PagingRequestModel): Observable<AuditEventModel[]> {
    const businessObjectType = this._businessObjectType.getValue();
    const transactionId = this._transactionId.getValue();

    return this._auditRoutesService.getEvents$({ businessObjectType, pagingRequestModel, transactionId }).pipe(
      tap(eventsPaginationResp => {
        this._eventsPagination.next(eventsPaginationResp.pagingMetadata);
      }),
      switchMap(async (eventsPaginationResp: IEventsPaginationResponse<AuditEventModel>) => {
        for (const event of eventsPaginationResp.events) {
          event.displayName = await firstValueFrom(this._userStateService.getUserDisplayName$(event.requestContext?.userId || ''));
        }

        return eventsPaginationResp.events;
      }),
      tap(events => this._events.next(events)),
    );
  }

  public get transactionId(): string {
    return this._formRendererService.transactionId;
  }

  public get eventsPagination(): PagingResponseModel {
    return this._eventsPagination.value;
  }

  constructor(
    private readonly _auditRoutesService: AuditRoutesService,
    private readonly _userStateService: UserStateService,
    private readonly _formRendererService: FormRendererService,
  ) {}

  public initialize(businessObjectType: string, transactionId: string): void {
    this._businessObjectType.next(businessObjectType);
    this._transactionId.next(transactionId);
  }

  public loadEvents$(pagingRequestModel?: PagingRequestModel): Observable<AuditEventModel[]> {
    return this._getEvents$(pagingRequestModel);
  }

  public clearEvents() {
    this._events.next([]);
  }

  public cleanUp() {
    this._businessObjectType.next('');
    this._transactionId.next('');
    this._events.next([]);
    this._eventsPagination.next(new PagingResponseModel());
  }
}
