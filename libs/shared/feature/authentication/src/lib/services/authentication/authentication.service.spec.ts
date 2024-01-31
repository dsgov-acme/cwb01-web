import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, flush } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PortalApiRoutesService } from '@dsg/shared/data-access/portal-api';
import { EnumerationsStateService, UserStateService } from '@dsg/shared/feature/app-state';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { AccessControlService } from '@dsg/shared/utils/access-control';
import { MockService } from 'ng-mocks';
import { of, Subject, take, throwError } from 'rxjs';
import { AuthenticationProviderActions, DEFAULT_ERROR_LANGUAGE } from '../../models';
import { AuthenticationAdapter } from '../../models/authentication.adapter';
import { SessionTimeoutService } from '../session-timeout/session-timeout.service';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let adapter: AuthenticationAdapter;
  let apiService: PortalApiRoutesService;
  let service: AuthenticationService;
  let timeoutService: SessionTimeoutService;
  let router: Router;
  let snackBarService: NuverialSnackBarService;
  let userStateService: UserStateService;
  let enumsService: EnumerationsStateService;
  let accessControlService: AccessControlService;
  const _isAuthenticated = new Subject<boolean>();

  beforeEach(() => {
    adapter = MockService(AuthenticationAdapter, {
      checkUserEmail: jest.fn(),
      errorType: jest.fn().mockImplementation(() => 'invalid-email'),
      initialize: jest.fn().mockImplementation(() => of(undefined)),
      isAuthenticated$: _isAuthenticated.asObservable(),
      redirectResult$: of(null),
      sendPasswordResetEmail: jest.fn(),
      sessionExpired$: of(false),
      signInWithEmailAndPassword: jest.fn(),
      signInWithEmailLink: jest.fn(),
      signInWithRedirect$: jest.fn().mockImplementation(() => of(undefined)),
      signOut: jest.fn().mockImplementation(() => of(undefined)),
      signUpWithEmailAndPassword: jest.fn().mockImplementation(() => of(undefined)),
      signUpWithEmailLink: jest.fn(),
    });
    apiService = MockService(PortalApiRoutesService, {
      postSignOut$: jest.fn().mockImplementation(() => of(undefined)),
    });
    timeoutService = MockService(SessionTimeoutService, {
      reset: jest.fn(),
      watchForIdle: jest.fn().mockImplementation(() => of(false)),
    });
    router = MockService(Router, {
      navigate: jest.fn().mockReturnValue(Promise.resolve(true)),
    });
    snackBarService = MockService(NuverialSnackBarService);
    userStateService = MockService(UserStateService);
    enumsService = MockService(EnumerationsStateService);
    accessControlService = MockService(AccessControlService);
    service = new AuthenticationService(router, adapter, timeoutService, {}, apiService, snackBarService, userStateService, enumsService, accessControlService);
  });

  it('should  initialized', () => {
    expect(service).toBeTruthy();
  });

  it('should provide authentication status', () => {
    expect(service.isAuthenticated).toBeFalsy();
  });

  it('should checkUserEmail', fakeAsync(() => {
    const spy = jest.spyOn(adapter, 'checkUserEmail').mockImplementation();
    service.checkUserEmail('a@a.com');
    expect(spy).toHaveBeenCalledWith('a@a.com');
  }));

  it('should error type', () => {
    const spy = jest.spyOn(adapter, 'errorType').mockImplementation();
    service.errorString({ code: 'abc', message: '123' });
    expect(spy).toHaveBeenCalled();
  });

  it('should createUserWithEmailAndPassword', () => {
    const spy = jest.spyOn(adapter, 'signUpWithEmailAndPassword').mockImplementation();
    service.createUserWithEmailAndPassword('a@a.com', 'pwd');
    expect(spy).toHaveBeenCalledWith('a@a.com', 'pwd');
  });

  it('should createUserWithEmailAndPassword', () => {
    const spy = jest.spyOn(adapter, 'signInWithEmailAndPassword').mockImplementation();
    service.signInWithEmailAndPassword('a@a.com', 'pwd');
    expect(spy).toHaveBeenCalledWith('a@a.com', 'pwd');
  });

  it('should signInWithEmailLink', () => {
    const spy = jest.spyOn(adapter, 'signInWithEmailLink').mockImplementation();
    service.signInWithEmailLink();
    expect(spy).toHaveBeenCalled();
  });

  it('should signUpWithEmailLink', () => {
    const spy = jest.spyOn(adapter, 'signUpWithEmailLink').mockImplementation();
    service.signUpWithEmailLink('a@a.com');
    expect(spy).toHaveBeenCalled();
  });

  it('should sendPasswordResetEmail', () => {
    const spy = jest.spyOn(adapter, 'sendPasswordResetEmail').mockImplementation();
    service.sendPasswordResetEmail('a@a.com');
    expect(spy).toHaveBeenCalledWith('a@a.com');
  });

  it('should sign out', fakeAsync(() => {
    const resetSpy = jest.spyOn(timeoutService, 'reset');
    const postSignOutSpy = jest.spyOn(apiService, 'postSignOut$').mockReturnValue(of(undefined));
    const signOutSpy = jest.spyOn(adapter, 'signOut').mockReturnValue(of(undefined));
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    const clearUserStateSpy = jest.spyOn(userStateService, 'clearUserState');
    const clearEnumsStateSpy = jest.spyOn(enumsService, 'clearEnumsState');

    service.signOut().subscribe(() => {
      expect(resetSpy).toHaveBeenCalled();
      expect(postSignOutSpy).toHaveBeenCalled();
      expect(signOutSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: router.url, status: 'signedOut' } });
      expect(clearUserStateSpy).toHaveBeenCalled();
      expect(clearEnumsStateSpy).toHaveBeenCalled();
    });

    flush();
  }));

  it('should handle sign out error', fakeAsync(() => {
    const resetSpy = jest.spyOn(timeoutService, 'reset');
    const postSignOutSpy = jest
      .spyOn(apiService, 'postSignOut$')
      .mockReturnValue(throwError(() => new HttpErrorResponse({ error: { messages: ['error message'] }, status: 409 })));
    const signOutSpy = jest.spyOn(adapter, 'signOut').mockReturnValue(of(undefined));
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    service.signOut().subscribe(() => {
      expect(resetSpy).toHaveBeenCalled();
      expect(postSignOutSpy).toHaveBeenCalled();
      expect(signOutSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: router.url, status: 'signedOut' } });
    });

    flush();
  }));

  it('should signOut with api error', fakeAsync(() => {
    const spyApi = jest.spyOn(apiService, 'postSignOut$').mockImplementation(() => {
      return throwError(() => ({
        code: '1234',
        message: 'error message',
      }));
    });
    const spyAdapter = jest.spyOn(adapter, 'signOut');
    service
      .signOut()
      .pipe(take(1))
      .subscribe(_ => {
        expect(spyApi).toHaveBeenCalled();
        expect(spyAdapter).toHaveBeenCalled();
      });

    flush();
  }));

  it('should have default error messages', () => {
    expect(service.errorString({ code: 'invalid-email', message: 'message' })).toEqual('This is not a valid email address. Please verify and try again');
  });

  it('should have configured  error messages', () => {
    service = new AuthenticationService(
      router,
      adapter,
      timeoutService,
      {
        providerErrorLanguage: {
          'email-already-in-use': 'provided email-already-in-use',
          'generic': 'provided generic',
          'invalid-email': 'provided invalid-email',
          'user-disabled': 'provided user-disabled',
          'user-not-found': 'provided user-not-found',
          'weak-password': 'provided weak-password',
          'wrong-password': 'provided wrong-password',
        },
      },
      apiService,
      snackBarService,
      userStateService,
      enumsService,
      accessControlService,
    );
    expect(service.errorString({ code: 'invalid-email', message: 'message' })).toEqual('provided invalid-email');
  });

  describe('Initialize', () => {
    it('should clear the idle session cache', () => {
      const spy = jest.spyOn(timeoutService, 'reset');

      service.initialize().subscribe();
      _isAuthenticated.next(false);

      expect(spy).toHaveBeenCalled();
    });

    it('should start watching for idle and initialize user state', () => {
      const timeoutServiceSpy = jest.spyOn(timeoutService, 'watchForIdle');
      const userStateServiceSpy = jest.spyOn(userStateService, 'initializeUser');
      const enumsStateServiceSpy = jest.spyOn(enumsService, 'initializeEnumerations');

      service.initialize().subscribe();
      _isAuthenticated.next(true);

      expect(timeoutServiceSpy).toHaveBeenCalled();
      expect(userStateServiceSpy).toHaveBeenCalled();
      expect(enumsStateServiceSpy).toHaveBeenCalled();
    });

    it('should initialize the service', () => {
      // Arrange
      const resetSpy = jest.spyOn(timeoutService, 'reset');
      const initializeUserSpy = jest.spyOn(userStateService, 'initializeUser');
      const initializeEnumerationsSpy = jest.spyOn(enumsService, 'initializeEnumerations');
      const watchForIdleSpy = jest.spyOn(timeoutService, 'watchForIdle').mockReturnValue(of(true));
      const openConfiguredSpy = jest.spyOn(snackBarService, 'openConfigured');
      const signOutSpy = jest.spyOn(service, 'signOut').mockReturnValue(of(undefined));

      // Act
      service.initialize().subscribe();
      _isAuthenticated.next(true);

      // Assert
      expect(resetSpy).not.toHaveBeenCalled();
      expect(initializeUserSpy).toHaveBeenCalled();
      expect(initializeEnumerationsSpy).toHaveBeenCalled();
      expect(watchForIdleSpy).toHaveBeenCalled();
      expect(openConfiguredSpy).toHaveBeenCalledWith({
        message: service['_defaultSessionLanguage'].sessionInactivityMessage,
        type: 'warn',
        verticalPosition: 'top',
      });
      expect(signOutSpy).toHaveBeenCalled();
    });

    it('should not initialize the service if session is not expired', () => {
      // Arrange
      const resetSpy = jest.spyOn(timeoutService, 'reset');
      const initializeUserSpy = jest.spyOn(userStateService, 'initializeUser');
      const initializeEnumerationsSpy = jest.spyOn(enumsService, 'initializeEnumerations');
      const watchForIdleSpy = jest.spyOn(timeoutService, 'watchForIdle').mockReturnValue(of(true));
      const openConfiguredSpy = jest.spyOn(snackBarService, 'openConfigured');
      const signOutSpy = jest.spyOn(service, 'signOut').mockReturnValue(of(undefined));

      // Act
      service.initialize().subscribe();
      _isAuthenticated.next(false);

      // Assert
      expect(resetSpy).toHaveBeenCalled();
      expect(initializeUserSpy).not.toHaveBeenCalled();
      expect(initializeEnumerationsSpy).not.toHaveBeenCalled();
      expect(watchForIdleSpy).not.toHaveBeenCalled();
      expect(openConfiguredSpy).not.toHaveBeenCalled();
      expect(signOutSpy).not.toHaveBeenCalled();
    });

    it('should not initialize the service if idle is not expired', () => {
      // Arrange
      const resetSpy = jest.spyOn(timeoutService, 'reset');
      const initializeUserSpy = jest.spyOn(userStateService, 'initializeUser');
      const initializeEnumerationsSpy = jest.spyOn(enumsService, 'initializeEnumerations');
      const watchForIdleSpy = jest.spyOn(timeoutService, 'watchForIdle').mockReturnValue(of(false));
      const openConfiguredSpy = jest.spyOn(snackBarService, 'openConfigured');
      const signOutSpy = jest.spyOn(service, 'signOut').mockReturnValue(of(undefined));

      // Act
      service.initialize().subscribe();
      _isAuthenticated.next(true);

      // Assert
      expect(resetSpy).not.toHaveBeenCalled();
      expect(initializeUserSpy).toHaveBeenCalled();
      expect(initializeEnumerationsSpy).toHaveBeenCalled();
      expect(watchForIdleSpy).toHaveBeenCalled();
      expect(openConfiguredSpy).not.toHaveBeenCalled();
      expect(signOutSpy).not.toHaveBeenCalled();
    });
  });

  it('should signInWithRedirect', () => {
    const spy = jest.spyOn(adapter, 'signInWithRedirect$').mockImplementation();

    service.signInWithRedirect$();
    expect(spy).toHaveBeenCalled();
  });

  it('should configure the error and session languages', () => {
    const configuration = {
      language: {
        [AuthenticationProviderActions.SessionExpired]: {
          sessionInactivityMessage: 'provided sessionInactivityMessage',
        },
      },
      providerErrorLanguage: {
        'email-already-in-use': 'provided email-already-in-use',
        'generic': 'provided generic',
        'invalid-email': 'provided invalid-email',
        'user-disabled': 'provided user-disabled',
        'user-not-found': 'provided user-not-found',
        'weak-password': 'provided weak-password',
        'wrong-password': 'provided wrong-password',
      },
    };

    (service as any)['_configuration'] = configuration;
    service['_configure']();

    expect(service['_defaultErrorLanguage']).toEqual({
      ...DEFAULT_ERROR_LANGUAGE,
      ...configuration.providerErrorLanguage,
    });

    expect(service['_defaultSessionLanguage']).toEqual({
      ...service['_defaultSessionLanguage'],
      ...configuration.language[AuthenticationProviderActions.SessionExpired],
    });
  });

  it('should not configure the error and session languages if not provided', () => {
    (service as any)['_configuration'] = {};
    service['_configure']();

    expect(service['_defaultErrorLanguage']).toEqual(DEFAULT_ERROR_LANGUAGE);
    expect(service['_defaultSessionLanguage']).toEqual({ sessionInactivityMessage: 'You have been logged out due to inactivity.' });
  });
});
