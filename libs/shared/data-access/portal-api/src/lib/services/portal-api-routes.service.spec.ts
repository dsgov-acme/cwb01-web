import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpTestingModule } from '@dsg/shared/utils/http';
import { PortalApiRoutesService } from './portal-api-routes.service';

/* eslint-disable @typescript-eslint/dot-notation */
describe('PortalApiService', () => {
  let service: PortalApiRoutesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpTestingModule],
    });
    service = TestBed.inject(PortalApiRoutesService);
    httpTestingController = TestBed.inject(HttpTestingController);

    jest.spyOn<any, any>(service, '_handlePost$');
    jest.spyOn<any, any>(service, '_handleGet$');
    jest.spyOn<any, any>(service, '_handlePut$');
    jest.spyOn<any, any>(service, '_handleDelete$');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service['_baseUrl']).toEqual('https://dsgov-test.com/portal/api');
  });

  it('postSignOut$', done => {
    const mockResponse = {};

    service.postSignOut$().subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service['_handlePost$']).toHaveBeenCalledWith(`/v1/signOut`, {});
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/signOut`);
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });
});
