import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { ReplaySubject } from 'rxjs';
import { IAuthenticatedUser } from '../../models';
import { AuthenticationService } from '../../services';

import { AuthenticationRedirectComponent } from './authentication-redirect.component';

describe('AuthenticationRedirectComponent', () => {
  let component: AuthenticationRedirectComponent;
  let fixture: ComponentFixture<AuthenticationRedirectComponent>;
  const redirectResult = new ReplaySubject<IAuthenticatedUser | Error | null>(1);

  redirectResult.next(null);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticationRedirectComponent],
      providers: [
        MockProvider(AuthenticationService, {
          redirectResult$: redirectResult.asObservable(),
        }),
        MockProvider(LoggingService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticationRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call signInWithRedirect when redirect result is null', done => {
    const service = ngMocks.findInstance(AuthenticationService);

    jest.spyOn(component, 'signInWithRedirect');
    jest.spyOn(service, 'signInWithRedirect$');

    component.redirectResult$.subscribe(result => {
      expect(result).toBeNull();
      expect(component.signInWithRedirect).toHaveBeenCalled();
      expect(service.signInWithRedirect$).toHaveBeenCalled();
      done();
    });
  });

  it('should not call signInWithRedirect when redirect result is an authenticatedUser', done => {
    const service = ngMocks.findInstance(AuthenticationService);

    redirectResult.next({} as IAuthenticatedUser);

    jest.spyOn(component, 'signInWithRedirect');
    jest.spyOn(service, 'signInWithRedirect$');

    component.redirectResult$.subscribe(result => {
      expect(result).not.toBeNull();
      expect(component.signInWithRedirect).not.toHaveBeenCalled();
      expect(service.signInWithRedirect$).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not call signInWithRedirect when redirect result is an errorr', done => {
    const service = ngMocks.findInstance(AuthenticationService);

    redirectResult.next(new Error());

    jest.spyOn(component, 'signInWithRedirect');
    jest.spyOn(service, 'signInWithRedirect$');

    component.redirectResult$.subscribe(result => {
      expect(result).not.toBeNull();
      expect(component.signInWithRedirect).not.toHaveBeenCalled();
      expect(service.signInWithRedirect$).not.toHaveBeenCalled();
      done();
    });
  });

  it('should call signInWithRedirect method of AuthenticationService', () => {
    const authenticationService = ngMocks.findInstance(AuthenticationService);

    jest.spyOn(authenticationService, 'signInWithRedirect$');

    component.signInWithRedirect();

    expect(authenticationService.signInWithRedirect$).toHaveBeenCalled();
  });
});
