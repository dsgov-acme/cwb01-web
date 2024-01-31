import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { UserStateService } from '../../services';
import { ProfileInterceptor } from './profile.interceptor';

describe('ProfileInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  const mockUserStateService = {
    getCurrentEmployerId: jest.fn().mockReturnValue('123123123-123-1'),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          multi: true,
          provide: HTTP_INTERCEPTORS,
          useClass: ProfileInterceptor,
        },
        { provide: UserStateService, useValue: mockUserStateService },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should ...', inject([HTTP_INTERCEPTORS], (service: ProfileInterceptor) => {
    expect(service).toBeTruthy();
  }));
  it('should add X-Application-Profile-ID header when currentEmployerId is present', () => {
    http.get('/test').subscribe(response => expect(response).toBeTruthy());
    const request = httpMock.expectOne(req => req.headers.has('X-Application-Profile-ID'));
    request.flush({ data: 'test' });
    expect(request.request.headers.get('X-Application-Profile-ID')).toEqual('123123123-123-1');
  });

  it('should not add X-Application-Profile-ID header when currentEmployerId is not present', () => {
    mockUserStateService.getCurrentEmployerId.mockReturnValue(null);
    http.get('/test').subscribe();

    const httpRequest = httpMock.expectOne(req => !req.headers.has('X-Application-Profile-ID'));
    httpRequest.flush({});
    httpMock.verify();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
