import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpTestingModule } from '@dsg/shared/utils/http';
import { Capabilities } from './../models/access-control.model';
import { AccessControlService } from './access-control.service';

describe('AccessControlService', () => {
  let service: AccessControlService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpTestingModule],
    });
    service = TestBed.inject(AccessControlService);
    httpMock = TestBed.inject(HttpTestingController);

    jest.spyOn<any, any>(service, '_handleGet$');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service['_baseUrl']).toEqual('https://dsgov-test.com');
  });

  it('should initialize the service', () => {
    const mockResponse = ['capability1', 'capability2'];
    const mockCapabilities = new Map<string, boolean>();
    mockCapabilities.set('capability1', true);
    mockCapabilities.set('capability2', true);

    service.initialize();

    const req = httpMock.expectOne(`${service['_baseUrl']}/portal/api/v1/capabilities`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service['_capabilities'].value).toEqual(mockCapabilities);
    expect(service.initialLoaded$).toBeTruthy();
  });

  it('_getCapabilities$', done => {
    const mockResponse = ['capability1', 'capability2'];
    const mockCapabilities = new Map<string, boolean>();
    mockCapabilities.set('capability1', true);
    mockCapabilities.set('capability2', true);

    service['_getCapabilities$']().subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/portal/api/v1/capabilities`);
      expect(service['_capabilities'].value).toEqual(mockCapabilities);
      expect(service.initialLoaded$).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(`${service['_baseUrl']}/portal/api/v1/capabilities`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should check capability that is authorized', done => {
    const capability = 'capability1' as Capabilities;
    const mockCapabilities = new Map<string, boolean>();
    mockCapabilities.set('capability1', true);
    mockCapabilities.set('capability2', true);

    service['_capabilities'].next(mockCapabilities);

    const result$ = service.isAuthorized$(capability);
    service['_initialLoaded'].next(true);
    service['_initialLoaded'].complete();

    result$.subscribe(result => {
      expect(result).toBeTruthy();
      done();
    });
  });

  it('should check capability that is not authorized', done => {
    const capability = 'capability3' as Capabilities;
    const mockCapabilities = new Map<string, boolean>();
    mockCapabilities.set('capability1', true);
    mockCapabilities.set('capability2', true);

    service['_capabilities'].next(mockCapabilities);
    service['_initialLoaded'].next(true);
    service['_initialLoaded'].complete();

    const result$ = service.isAuthorized$(capability);

    result$.subscribe(result => {
      expect(result).toBeFalsy();
      done();
    });
  });

  it('should clean up the service', () => {
    service.cleanup();

    expect(service['_capabilities'].value).toEqual(new Map<string, boolean>());
  });
});
