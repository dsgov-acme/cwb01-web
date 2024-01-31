import { PlatformLocation } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IAuthenticationConfiguration } from '@dsg/shared/utils/environment';
import { LoggingService } from '@dsg/shared/utils/logging';
import firebase from 'firebase/compat/app';
import { Observable, ReplaySubject, Subject, from, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import {
  ADAPTER_AUTHENTICATION,
  AuthenticationAdapter,
  AuthenticationProviderErrorType,
  FIREBASE_ERROR_MAP,
  IAuthenticatedError,
  IAuthenticatedUser,
  IAuthenticatedUserCredential,
} from '../../models';

export const CONTEXT = 'FirebaseAuthenticationAdapter';

type AuthenticationResult = IAuthenticatedUser | Error | null;

@Injectable()
export class FirebaseAuthenticationAdapter implements AuthenticationAdapter {
  public user$: Observable<IAuthenticatedUser | null>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticated = false;
  public userToken$: Observable<string | null>;
  public sessionExpired$: Observable<boolean>;
  public redirectResult$: Observable<IAuthenticatedUser | Error | null>;

  protected readonly _sessionExpired: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private readonly _tokenData: ReplaySubject<firebase.auth.IdTokenResult> = new ReplaySubject<firebase.auth.IdTokenResult>(1);
  private readonly _redirectResult: Subject<AuthenticationResult> = new ReplaySubject<AuthenticationResult>(1);

  constructor(
    protected readonly _platformLocation: PlatformLocation,
    private readonly _angularFireAuth: AngularFireAuth,
    @Optional() @Inject(ADAPTER_AUTHENTICATION) protected readonly _configuration: IAuthenticationConfiguration,
    private readonly _loggingService: LoggingService,
  ) {
    const authState: Observable<IAuthenticatedUser | null> = this._angularFireAuth.authState.pipe(
      map(user => this._mapToUser(user)),
      shareReplay(1),
    );

    this.isAuthenticated$ = authState.pipe(
      map(user => user !== null && user !== undefined),
      tap(authenticated => (this.isAuthenticated = authenticated)),
    );
    this.user$ = authState;
    this.userToken$ = this._angularFireAuth.idToken;
    this.sessionExpired$ = this._sessionExpired.asObservable();
    this.redirectResult$ = this._redirectResult.asObservable();
  }

  public initialize(): Observable<void> {
    return from(this._initialize());
  }

  public checkUserEmail(email: string): Observable<boolean> {
    return from(this._angularFireAuth.fetchSignInMethodsForEmail(email)).pipe(
      map(methods => !!methods.find(() => 'password')),
      catchError(() => of(false)),
    );
  }

  public errorType(error: IAuthenticatedError): AuthenticationProviderErrorType {
    return FIREBASE_ERROR_MAP[error.code] ? FIREBASE_ERROR_MAP[error.code] : 'generic';
  }

  public signUpWithEmailAndPassword(email: string, password: string): Observable<IAuthenticatedUserCredential> {
    return from(this._angularFireAuth.createUserWithEmailAndPassword(email, password)).pipe(
      map(credential => ({
        additionalUserInfo: credential.additionalUserInfo,
        credential: credential.credential,
        operationType: credential.operationType,
        user: credential.user,
      })),
      catchError((error: firebase.FirebaseError) => {
        return throwError(() => ({
          code: error.code,
          message: error.message,
        }));
      }),
    );
  }

  public signInWithEmailAndPassword(email: string, password: string): Observable<IAuthenticatedUserCredential> {
    return from(this._angularFireAuth.signInWithEmailAndPassword(email, password)).pipe(
      map(credential => ({
        additionalUserInfo: credential.additionalUserInfo,
        credential: credential.credential,
        operationType: credential.operationType,
        user: credential.user,
      })),
      catchError((error: firebase.FirebaseError) => {
        return throwError(() => ({
          code: error.code,
          message: error.message,
        }));
      }),
    );
  }

  public signUpWithEmailLink(email: string): Observable<void> {
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      handleCodeInApp: true,
      url: `${window.location.origin}${this._platformLocation.getBaseHrefFromDOM()}login/complete-sign-in`,
    };

    return from(this._angularFireAuth.sendSignInLinkToEmail(email, actionCodeSettings)).pipe(
      tap(() => {
        window.localStorage.setItem('emailForSignIn', email);
      }),
    );
  }

  public signInWithEmailLink(): Observable<IAuthenticatedUserCredential> {
    if (!this._angularFireAuth.isSignInWithEmailLink(window.location.href)) {
      throw new Error('code: unknown, message: invalid email link');
    }

    const email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      throw new Error('code: unknown, message: email address not found');
    }

    return from(this._angularFireAuth.signInWithEmailLink(email, window.location.href)).pipe(
      tap(() => {
        window.localStorage.removeItem('emailForSignIn');
      }),
      map(credential => ({
        additionalUserInfo: credential.additionalUserInfo,
        credential: credential.credential,
        operationType: credential.operationType,
        user: credential.user,
      })),
      catchError((error: firebase.FirebaseError) => {
        return throwError(() => ({
          code: error.code,
          message: error.message,
        }));
      }),
    );
  }

  public signInWithRedirect$(): Observable<void> {
    const providerId = this._configuration?.firebaseConfiguration?.providerId;

    if (!providerId) {
      throw new Error(`providerId not set`);
    }

    const provider = new firebase.auth.OAuthProvider(providerId);

    return from(this._angularFireAuth.signInWithRedirect(provider));
  }

  public sendPasswordResetEmail(email: string): Observable<void> {
    return from(this._angularFireAuth.sendPasswordResetEmail(email));
  }

  public signOut(): Observable<void> {
    return from(this._angularFireAuth.signOut()).pipe(tap(() => (this.isAuthenticated = false)));
  }

  protected async _initialize(): Promise<void> {
    // getRedirectResult must be called before any other methods that get the user data or it will return null
    await this._angularFireAuth
      .getRedirectResult()
      .then(result => {
        // handle redirect result
        const user = this._mapToUser(result.user);

        this._redirectResult.next(user);
      })
      .catch(error => {
        this._loggingService.error(CONTEXT, error);
        this._redirectResult.next(error);
      });

    this._angularFireAuth.idTokenResult
      .pipe(
        tap(tokenData => {
          if (!tokenData) return;

          this._tokenData.next(tokenData);

          if (!tokenData || !this._configuration?.sessionExpiration?.sessionTimeSeconds) {
            return;
          }

          const tokenAuthTime = new Date(tokenData.authTime).getTime();
          const authExpiryDate = Date.now() - this._configuration.sessionExpiration.sessionTimeSeconds * 1000;

          if (tokenAuthTime < authExpiryDate) {
            this._sessionExpired.next(true);
          }
        }),
      )
      .subscribe();
  }

  private _mapToUser(user: firebase.User | null): IAuthenticatedUser | null {
    return user
      ? {
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          providerId: user.providerId,
          uid: user.uid,
        }
      : null;
  }
}
