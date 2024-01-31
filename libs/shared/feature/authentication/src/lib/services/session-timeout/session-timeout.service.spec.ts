import { fakeAsync, tick } from '@angular/core/testing';
import { take } from 'rxjs';
import { SessionTimeoutService } from './session-timeout.service';

const getSessionTimeoutService = (idle: number | null) => {
  return new SessionTimeoutService({
    firebaseConfiguration: {
      firebase: {
        apiKey: 'api-key',
        authDomain: 'auth-domain',
      },
      providerId: 'oidc.test',
      tenantId: 'tenant-id',
    },
    sessionExpiration: {
      idleTimeSeconds: idle,
      sessionTimeSeconds: null,
    },
  });
};

describe('AuthenticationService', () => {
  let service: SessionTimeoutService;

  beforeEach(() => {
    localStorage.clear();
  });

  it('should be initialized', () => {
    service = getSessionTimeoutService(null);
    expect(service).toBeTruthy();
  });

  it('should idle default', fakeAsync(() => {
    let result = null;
    service = getSessionTimeoutService(null);
    service.watchForIdle().subscribe(idle => (result = idle));
    expect(result).toEqual(false);
  }));

  it('should be expired', fakeAsync(() => {
    let result = null;
    localStorage.setItem('sessionTimeoutServiceExpiration', '1000');
    service = getSessionTimeoutService(1);
    service.watchForIdle().subscribe(idle => (result = idle));

    expect(result).toEqual(true);
  }));

  it('should be expired after expiration time', fakeAsync(() => {
    let result = null;
    localStorage.setItem('sessionTimeoutServiceExpiration', `${Date.now()}`);
    service = getSessionTimeoutService(1);
    service
      .watchForIdle()
      .pipe(take(1))
      .subscribe(idle => (result = idle));

    tick(2000);

    expect(result).toEqual(true);
  }));

  it('should be expired after current time if there is no expiration time in local storage', fakeAsync(() => {
    let result = null;
    localStorage.setItem('sessionTimeoutServiceExpiration', ``);
    service = getSessionTimeoutService(1);
    service
      .watchForIdle()
      .pipe(take(1))
      .subscribe(idle => (result = idle));

    tick(2000);

    expect(result).toEqual(true);
  }));

  it('should reset time', fakeAsync(() => {
    localStorage.setItem('sessionTimeoutServiceExpiration', '1000');
    service = getSessionTimeoutService(1);
    service.reset();

    expect(localStorage.getItem('sessionTimeoutServiceExpiration')).toBeFalsy();
  }));
});
