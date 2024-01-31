import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Inject, Injectable } from '@angular/core';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockBuilder, MockService, ngMocks } from 'ng-mocks';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';

@Injectable()
class TestService extends HttpBaseService {
  constructor(
    protected override readonly _http: HttpClient,
    @Inject('baseUrl') protected override readonly _baseUrl: string,
    protected override readonly _loggingService: LoggingService,
  ) {
    super(_http, _baseUrl, _loggingService);
  }

  public delete$(): Observable<string> {
    return this._handleDelete$<string>(`delete-test`);
  }

  public get$(): Observable<string> {
    return this._handleGet$<string>(`get-test`);
  }

  public post$(body = {}, options = {}): Observable<string> {
    return this._handlePost$<string>(`post-test`, body, options);
  }

  public postEmpty$(): Observable<string> {
    return this._handlePost$<string>(`post-test`);
  }

  public put$(body = {}): Observable<string> {
    return this._handlePut$<string>(`put-test`, body);
  }

  public putEmpty$(): Observable<string> {
    return this._handlePut$<string>(`put-test`);
  }
}

describe('HTTPBaseServiceFail', () => {
  it('should not create service', () => {
    expect(() => new HttpBaseService(MockService(HttpClient), '', MockService(LoggingService))).toThrow();
  });
});

describe('HTTPBaseService', () => {
  let service!: TestService | null;
  let loggingService: LoggingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    return MockBuilder(TestService)
      .provide({ provide: 'baseUrl', useValue: 'api.fakeUrl.com/' })
      .provide({
        provide: LoggingService,
        useValue: MockService(LoggingService, {
          error: jest.fn(),
        }),
      })
      .provide(TestService)
      .replace(HttpClientModule, HttpClientTestingModule);
  });

  beforeEach(() => {
    ngMocks.autoSpy('jest');
    service = ngMocks.findInstance(TestService);
    loggingService = ngMocks.findInstance(LoggingService);
    httpMock = ngMocks.findInstance(HttpTestingController);
  });

  afterEach(() => {
    ngMocks.autoSpy('reset');
    httpMock.verify();
    service = null;
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should perform http delete', () => {
    let response: unknown;
    service?.delete$().subscribe(value => (response = value));

    const req = httpMock.expectOne('api.fakeUrl.com/delete-test');
    const data = { test: 'delete' };
    expect(req.request.method).toEqual('DELETE');
    req.flush(data);

    expect(response).toEqual(data);
    expect(loggingService.error).not.toHaveBeenCalled();
  });

  it('should perform http delete error', () => {
    let response: unknown = null;
    let error!: HttpErrorResponse;
    service?.delete$().subscribe(
      value => (response = value),
      value => (error = value as HttpErrorResponse),
    );

    const req = httpMock.expectOne('api.fakeUrl.com/delete-test');
    const data = { status: 400, statusText: 'Bad Request' };
    req.flush('400 error', data);

    expect(loggingService.error).toHaveBeenCalled();
    expect(error.status).toEqual(data.status);
    expect(response).toEqual(null);
  });

  it('should perform http get', () => {
    let response: unknown;
    service?.get$().subscribe(value => (response = value));

    const req = httpMock.expectOne('api.fakeUrl.com/get-test');
    const data = { test: 'get' };
    expect(req.request.method).toEqual('GET');
    req.flush(data);

    expect(response).toEqual(data);
    expect(loggingService.error).not.toHaveBeenCalled();
  });

  it('should perform http get error', () => {
    let response: unknown = null;
    let error!: HttpErrorResponse;
    service?.get$().subscribe(
      value => (response = value),
      value => (error = value as HttpErrorResponse),
    );

    const req = httpMock.expectOne('api.fakeUrl.com/get-test');
    const data = { status: 400, statusText: 'Bad Request' };
    req.flush('400 error', data);

    expect(loggingService.error).toHaveBeenCalled();
    expect(error.status).toEqual(data.status);
    expect(response).toEqual(null);
  });

  it('should perform http post', () => {
    let response: unknown;
    service?.post$({ data: 'post-test' }, {}).subscribe(value => (response = value));

    const req = httpMock.expectOne('api.fakeUrl.com/post-test');
    const data = { test: 'post' };
    expect(req.request.method).toEqual('POST');
    req.flush(data);

    expect(response).toEqual(data);
    expect(loggingService.error).not.toHaveBeenCalled();
  });

  it('should perform http post no body', () => {
    let response: unknown;
    service?.postEmpty$().subscribe(value => (response = value));

    const req = httpMock.expectOne('api.fakeUrl.com/post-test');
    const data = { test: 'post' };
    expect(req.request.method).toEqual('POST');
    req.flush(data);

    expect(response).toEqual(data);
    expect(loggingService.error).not.toHaveBeenCalled();
  });

  it('should perform http post error', () => {
    let response: unknown = null;
    let error!: HttpErrorResponse;
    service?.post$({ data: 'post-test' }, {}).subscribe(
      value => (response = value),
      value => (error = value as HttpErrorResponse),
    );

    const req = httpMock.expectOne('api.fakeUrl.com/post-test');
    const data = { status: 400, statusText: 'Bad Request' };
    req.flush('400 error', data);

    expect(loggingService.error).toHaveBeenCalled();
    expect(error.status).toEqual(data.status);
    expect(response).toEqual(null);
  });

  it('should perform http put', () => {
    let response: unknown;
    service?.put$({ data: 'put-test' }).subscribe(value => (response = value));

    const req = httpMock.expectOne('api.fakeUrl.com/put-test');
    const data = { test: 'put' };
    expect(req.request.method).toEqual('PUT');
    req.flush(data);

    expect(response).toEqual(data);
    expect(loggingService.error).not.toHaveBeenCalled();
  });

  it('should perform http put empty', () => {
    let response: unknown;
    service?.putEmpty$().subscribe(value => (response = value));

    const req = httpMock.expectOne('api.fakeUrl.com/put-test');
    const data = { test: 'put' };
    expect(req.request.method).toEqual('PUT');
    req.flush(data);

    expect(response).toEqual(data);
    expect(loggingService.error).not.toHaveBeenCalled();
  });

  it('should perform http put error', () => {
    let response: unknown = null;
    let error!: HttpErrorResponse;
    service?.put$({ data: 'put-test' }).subscribe(
      value => (response = value),
      value => (error = value as HttpErrorResponse),
    );

    const req = httpMock.expectOne('api.fakeUrl.com/put-test');
    const data = { status: 400, statusText: 'Bad Request' };
    req.flush('400 error', data);

    expect(loggingService.error).toHaveBeenCalled();
    expect(error.status).toEqual(data.status);
    expect(response).toEqual(null);
  });
});
