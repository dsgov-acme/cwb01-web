import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuditEventModelMock, AuditEventsSchemaMock, AuditRoutesService } from '@dsg/shared/data-access/audit-api';
import { DocumentApiRoutesService, ProcessingResultsMock } from '@dsg/shared/data-access/document-api';
import { DocumentRejectionReasonsMock } from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService, UserStateService } from '@dsg/shared/feature/app-state';
import { FormRendererService } from '@dsg/shared/feature/form-nuv';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { PagingRequestModel } from '@dsg/shared/utils/http';
import { cloneDeep } from 'lodash';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { EventsLogService } from './events-log.service';

global.structuredClone = jest.fn(obj => cloneDeep(obj));

describe('EventsLogService', () => {
  let service: EventsLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(HttpClient),
        MockProvider(NuverialSnackBarService),
        MockProvider(DocumentApiRoutesService, {
          getDocumentFileData$: jest.fn().mockImplementation(() => of('123')),
          getProcessingResults$: jest.fn().mockReturnValue(of(ProcessingResultsMock)),
        }),
        MockProvider(UserStateService, {
          getUserDisplayName$: jest.fn().mockImplementation(() => of('')),
        }),
        MockProvider(AuditRoutesService, {
          getEvents$: jest.fn().mockImplementation(() => of(AuditEventsSchemaMock)),
        }),
        MockProvider(EnumerationsStateService, {
          getEnumMap$: jest.fn().mockReturnValue(of(DocumentRejectionReasonsMock)),
        }),
        MockProvider(FormRendererService, {
          transactionId: 'testId',
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'transactionId' }),
            snapshot: {
              paramMap: {
                get: () => 'mockValue',
              },
              params: { transactionId: 'mockValue' },
            },
          },
        },
      ],
    });
    service = TestBed.inject(EventsLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize', () => {
    const testReferenceType = 'TEST';
    const testReferenceId = '123';

    service.initialize(testReferenceType, testReferenceId);

    expect(service['_businessObjectType'].getValue()).toBe(testReferenceType);
    expect(service['_transactionId'].getValue()).toBe(testReferenceId);
  });

  it('should get transaction id', () => {
    expect(service.transactionId).toEqual('testId');
  });

  describe('_getEvents$', () => {
    it('should get the eventsModel and pagingResponseModel for events', done => {
      const auditRoutesService = TestBed.inject(AuditRoutesService);
      const getEvents$Spy = jest.spyOn(auditRoutesService, 'getEvents$');
      const _eventsSpy = jest.spyOn(service['_events'], 'next');
      const _eventsPaginationSpy = jest.spyOn(service['_eventsPagination'], 'next');

      const pagingRequestModel: PagingRequestModel = new PagingRequestModel();

      service['_getEvents$'](pagingRequestModel).subscribe(events => {
        expect(events).toEqual([AuditEventModelMock]);
        expect(getEvents$Spy).toHaveBeenCalled();
        expect(_eventsSpy).toBeCalledWith(AuditEventsSchemaMock.events);
        expect(_eventsPaginationSpy).toBeCalledWith(AuditEventsSchemaMock.pagingMetadata);

        expect(service.eventsPagination).toEqual(service['_eventsPagination'].value);
        done();
      });
    });

    it('should have events display name as empty when user not found', done => {
      const userStateService = TestBed.inject(UserStateService);

      jest.spyOn(userStateService, 'getUserById$').mockReturnValue(of(undefined));

      const pagingRequestModel: PagingRequestModel = new PagingRequestModel();

      service['_getEvents$'](pagingRequestModel).subscribe(events => {
        expect(events[0].displayName).toEqual('');
        done();
      });
    });
  });

  describe('loadEvents', () => {
    it('should load user details', done => {
      service.loadEvents$().subscribe();

      service.events$.subscribe(eventsModel => {
        expect(eventsModel).toEqual(AuditEventsSchemaMock.events);

        done();
      });
    });
  });

  describe('clear', () => {
    it('should clear events', () => {
      const _eventsSpy = jest.spyOn(service['_events'], 'next');
      service.clearEvents();
      expect(_eventsSpy).toBeCalledWith([]);
    });
  });

  it('should cleanup service state', async () => {
    const testBusinessObjectType = 'TEST';
    const testtransactionId = '123';

    service.initialize(testBusinessObjectType, testtransactionId);

    expect(service['_businessObjectType'].getValue()).toBeTruthy();
    expect(service['_transactionId'].getValue()).toBeTruthy();

    service.cleanUp();

    expect(service['_businessObjectType'].getValue()).toBe('');
    expect(service['_transactionId'].getValue()).toBe('');
  });
});
