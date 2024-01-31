import { HttpParams } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpTestingModule, PagingRequestModel } from '@dsg/shared/utils/http';
import { AuditEventMock } from '../models/audit-event/audit-event.mock';
import { AuditEventModel } from '../models/audit-event/audit-event.model';
import { AuditRoutesService } from './audit-api-routes-service';

/* eslint-disable @typescript-eslint/dot-notation */
describe('AuditRoutesService', () => {
  let service: AuditRoutesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpTestingModule],
    });
    service = TestBed.inject(AuditRoutesService);
    httpTestingController = TestBed.inject(HttpTestingController);

    jest.spyOn<any, any>(service, '_handlePost$');
    jest.spyOn<any, any>(service, '_handleGet$');
    jest.spyOn<any, any>(service, '_handlePut$');
    jest.spyOn<any, any>(service, '_handleDelete$');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service['_baseUrl']).toEqual('https://dsgov-test.com/as/api');
  });

  describe('getEvents$', () => {
    it('getEvents$', done => {
      const mockEventModel = new AuditEventModel(AuditEventMock);
      const pagingRequestModel = new PagingRequestModel();
      service.getEvents$({ businessObjectType: 'transaction', transactionId: '123' }).subscribe(eventModel => {
        expect(eventModel.events).toEqual([mockEventModel]);
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/audit-events/transaction/123/`, '');
        done();
      });
      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/audit-events/transaction/123/`);
      expect(req.request.method).toEqual('GET');
      req.flush({ events: [AuditEventMock], pagingMetadata: pagingRequestModel });
    });

    it('getEvents$ with filters', done => {
      const mockEventModel = new AuditEventModel(AuditEventMock);
      const pagingRequestModel = new PagingRequestModel();

      const filters = [
        {
          field: 'field',
          value: 'value',
        },
      ];
      let httpParams = new HttpParams();
      filters.forEach(filter => {
        httpParams = httpParams.append(filter.field, filter.value);
      });

      service.getEvents$({ businessObjectType: 'transaction', filters, transactionId: '123' }).subscribe(eventModel => {
        expect(eventModel.events).toEqual([mockEventModel]);
        done();
      });
      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/audit-events/transaction/123/?field=value`);
      expect(req.request.method).toEqual('GET');
      req.flush({ events: [AuditEventMock], pagingMetadata: pagingRequestModel });
    });

    it('getEvents$ - should return empty array when response has no events', done => {
      const pagingRequestModel = new PagingRequestModel();

      service.getEvents$({ businessObjectType: 'transaction', transactionId: '123' }).subscribe(eventModel => {
        expect(eventModel.events).toEqual([]);
        done();
      });
      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/audit-events/transaction/123/`);
      expect(req.request.method).toEqual('GET');
      req.flush({ events: [], pagingMetadata: pagingRequestModel });
    });
  });
});
