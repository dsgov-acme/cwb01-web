import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockService } from 'ng-mocks';
import { AuthenticationService } from '../services';
import { AuthenticationTokenInterceptor } from './authentication-token.interceptor';

describe('AuthenticationTokenInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          multi: true,
          provide: HTTP_INTERCEPTORS,
          useClass: AuthenticationTokenInterceptor,
        },
        {
          provide: AuthenticationService,
          useValue: MockService(AuthenticationService, {
            userToken$: of('token'),
          }),
        },
      ],
    });
  });

  it('should ...', inject([HTTP_INTERCEPTORS], (service: AuthenticationTokenInterceptor) => {
    expect(service).toBeTruthy();
  }));

  describe('intercept HTTP requests', () => {
    it('should add Bearer token Headers', inject([HttpClient, HttpTestingController], (http: HttpClient, mock: HttpTestingController) => {
      http.get('/api').subscribe(response => expect(response).toBeTruthy());

      const request = mock.expectOne(req => req.headers.has('Authorization'));
      request.flush({ data: 'test' });
      mock.verify();
    }));
  });

  afterEach(inject([HttpTestingController], (mock: HttpTestingController) => {
    mock.verify();
  }));
});
