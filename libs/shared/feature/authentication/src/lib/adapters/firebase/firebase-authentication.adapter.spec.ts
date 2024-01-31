import { PlatformLocation } from '@angular/common';
import { fakeAsync } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoggingService } from '@dsg/shared/utils/logging';
import firebase from 'firebase/compat/app';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { CONTEXT, FirebaseAuthenticationAdapter } from './firebase-authentication.adapter';

describe('FirebaseAuthenticationAdapter ', () => {
  let service: FirebaseAuthenticationAdapter;
  class AngularFireAuthMock {
    // Mock the behavior of the idToken method
    public idToken = jest.fn().mockReturnValue(of('mockToken'));
  }

  // Create an instance of the AngularFireAuthMock
  const angularFireAuthMock = new AngularFireAuthMock();
  beforeEach(() => {
    service = new FirebaseAuthenticationAdapter(
      MockService(PlatformLocation, {
        getBaseHrefFromDOM: () => '/',
      }),
      MockService(AngularFireAuth, {
        authState: of(null),
        createUserWithEmailAndPassword: (_email, _password) =>
          Promise.resolve({
            additionalUserInfo: null,
            credential: null,
            operationType: null,
            user: null,
          }),
        fetchSignInMethodsForEmail: (_email: string) => Promise.resolve(['password']),
        idTokenResult: of(angularFireAuthMock.idToken()),
        isSignInWithEmailLink: (_email: string) => Promise.resolve(true),
        sendPasswordResetEmail: () => Promise.resolve(),
        sendSignInLinkToEmail: () => Promise.resolve(),
        signInWithEmailAndPassword: (_email, _password) =>
          Promise.resolve({
            additionalUserInfo: null,
            credential: null,
            operationType: null,
            user: null,
          }),
        signInWithEmailLink: () => {
          return Promise.resolve({
            additionalUserInfo: null,
            credential: null,
            operationType: null,
            user: null,
          });
        },
        signOut: () => Promise.resolve(),
      }),
      {
        firebaseConfiguration: {
          firebase: {
            apiKey: 'api-key',
            authDomain: 'auth-domain',
          },
          providerId: 'oidc.test',
          tenantId: 'tenant-id',
        },
        sessionExpiration: {
          idleTimeSeconds: 60 * 30,
          sessionTimeSeconds: 60 * 60 * 18,
        },
      },
      MockService(LoggingService),
    );
  });

  it('should  initialized', () => {
    expect(service).toBeTruthy();
  });

  it('should checkUserEmail', fakeAsync(() => {
    const email = 'a@a.com';
    const methods = ['password'];
    jest.spyOn(service['_angularFireAuth'], 'fetchSignInMethodsForEmail').mockReturnValue(Promise.resolve(methods));

    service.checkUserEmail(email).subscribe(result => {
      expect(result).toEqual(true);
      expect(service['_angularFireAuth'].fetchSignInMethodsForEmail).toHaveBeenCalledWith(email);
    });
  }));

  it('should handle error in checkUserEmail', fakeAsync(() => {
    const email = 'a@a.com';
    jest.spyOn(service['_angularFireAuth'], 'fetchSignInMethodsForEmail').mockReturnValue(Promise.reject());

    service.checkUserEmail(email).subscribe(result => {
      expect(result).toEqual(false);
      expect(service['_angularFireAuth'].fetchSignInMethodsForEmail).toHaveBeenCalledWith(email);
    });
  }));

  it('should createUserWithEmailAndPassword', () => {
    service.signUpWithEmailAndPassword('a@a.com', 'pwd').subscribe(result => {
      expect(result).toBeTruthy();
    });
  });

  it('should signUpWithEmailAndPassword', done => {
    const email = 'test@test.com';
    const password = 'password';
    const createUserSpy = jest.spyOn(service['_angularFireAuth'], 'createUserWithEmailAndPassword').mockReturnValue(
      Promise.resolve({
        additionalUserInfo: null,
        credential: null,
        operationType: null,
        user: null,
      }),
    );

    service.signUpWithEmailAndPassword(email, password).subscribe(result => {
      expect(result).toEqual({
        additionalUserInfo: null,
        credential: null,
        operationType: null,
        user: null,
      });
      expect(createUserSpy).toHaveBeenCalledWith(email, password);
      done();
    });
  });

  it('should handle error in signUpWithEmailAndPassword', done => {
    const email = 'test@test.com';
    const password = 'password';
    const error = {
      code: 'error-code',
      message: 'error-message',
    };
    jest.spyOn(service['_angularFireAuth'], 'createUserWithEmailAndPassword').mockReturnValue(Promise.reject(error));

    service.signUpWithEmailAndPassword(email, password).subscribe({
      error: err => {
        expect(err).toEqual(error);
        done();
      },
    });
  });

  it('should createUserWithEmailAndPassword', () => {
    service.signInWithEmailAndPassword('a@a.com', 'pwd').subscribe(result => {
      expect(result).toBeTruthy();
    });
  });

  it('should signUpWithEmailLink', () => {
    service.signUpWithEmailLink('a@a.com').subscribe(result => {
      expect(result).toBeTruthy();
    });
  });

  it('should signInWithEmailLink', () => {
    service.signInWithEmailLink().subscribe(result => {
      expect(result).toBeTruthy();
    });
  });

  it('should sendPasswordResetEmail', () => {
    service.sendPasswordResetEmail('a@a.com').subscribe(result => {
      expect(result).toBeTruthy();
    });
  });

  it('should signOut', () => {
    service.signOut().subscribe(result => {
      expect(result).toBeTruthy();
    });
  });

  it('should emit authenticated', () => {
    service.isAuthenticated$.subscribe(result => {
      expect(result).toBeTruthy();
    });
  });

  it('should return error type', () => {
    expect(service.errorType({ code: 'unknown', message: 'message' })).toEqual('generic');
    expect(service.errorType({ code: 'auth/email-already-in-use', message: 'message' })).toEqual('email-already-in-use');
    expect(service.errorType({ code: 'auth/invalid-email', message: 'message' })).toEqual('invalid-email');
    expect(service.errorType({ code: 'auth/user-disabled', message: 'message' })).toEqual('user-disabled');
    expect(service.errorType({ code: 'auth/user-not-found', message: 'message' })).toEqual('user-not-found');
    expect(service.errorType({ code: 'auth/weak-password', message: 'message' })).toEqual('weak-password');
    expect(service.errorType({ code: 'auth/wrong-password', message: 'message' })).toEqual('wrong-password');
  });

  it('should signInWithRedirect$', () => {
    const providerId = 'oidc.test';
    const provider = new firebase.auth.OAuthProvider(providerId);
    const signInWithRedirectSpy = jest.spyOn(service['_angularFireAuth'], 'signInWithRedirect').mockReturnValue(Promise.resolve());

    service.signInWithRedirect$().subscribe(result => {
      expect(result).toBeUndefined();
      expect(signInWithRedirectSpy).toHaveBeenCalledWith(provider);
    });
  });

  it('should throw error if providerId is not set', () => {
    (service as any)['_configuration'] = null;

    expect(() => {
      service.signInWithRedirect$();
    }).toThrowError('providerId not set');
  });

  describe('_initialize', () => {
    it('should handle error in redirect result', async () => {
      const error = new Error('Redirect error');
      jest.spyOn(service['_angularFireAuth'], 'getRedirectResult').mockRejectedValue(error);
      const loggingServiceErrorSpy = jest.spyOn(service['_loggingService'], 'error');
      const redirectResultNextSpy = jest.spyOn(service['_redirectResult'], 'next');

      await service['_initialize']();

      expect(loggingServiceErrorSpy).toHaveBeenCalledWith(CONTEXT, error);
      expect(redirectResultNextSpy).toHaveBeenCalledWith(error);
    });

    it('should not check session expiration if token data or session time is not available', () => {
      const tokenDataNextSpy = jest.spyOn(service['_tokenData'], 'next');
      const sessionExpiredNextSpy = jest.spyOn(service['_sessionExpired'], 'next');

      service['_initialize']();

      expect(tokenDataNextSpy).not.toHaveBeenCalled();
      expect(sessionExpiredNextSpy).not.toHaveBeenCalled();
    });
  });
});
