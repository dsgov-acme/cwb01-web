import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationProviderErrorType, IAuthenticatedError, IAuthenticatedUser, IAuthenticatedUserCredential } from './authentication.model';

@Injectable()
export abstract class AuthenticationAdapter {
  public abstract readonly isAuthenticated$: Observable<boolean>;
  public abstract readonly redirectResult$: Observable<IAuthenticatedUser | Error | null>;
  public abstract readonly sessionExpired$: Observable<boolean>;
  public abstract readonly user$: Observable<IAuthenticatedUser | null>;
  public abstract readonly userToken$: Observable<string | null>;
  public abstract get isAuthenticated(): boolean;
  public abstract checkUserEmail(email: string): Observable<boolean>;
  public abstract errorType(error: IAuthenticatedError): AuthenticationProviderErrorType;
  public abstract initialize(): Observable<void>;
  public abstract sendPasswordResetEmail(email: string): Observable<void>;
  public abstract signUpWithEmailLink(email: string): Observable<void>;
  public abstract signUpWithEmailAndPassword(email: string, password: string): Observable<IAuthenticatedUserCredential>;
  public abstract signInWithEmailAndPassword(email: string, password: string): Observable<IAuthenticatedUserCredential>;
  public abstract signInWithEmailLink(): Observable<IAuthenticatedUserCredential>;
  public abstract signInWithRedirect$(): Observable<void>;
  public abstract signOut(): Observable<void>;
}
