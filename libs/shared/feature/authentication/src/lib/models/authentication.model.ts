import { InjectionToken } from '@angular/core';
import { IAuthenticationConfiguration } from '@dsg/shared/utils/environment';

export const ADAPTER_AUTHENTICATION = new InjectionToken<IAuthenticationConfiguration>('ADAPTER_AUTHENTICATION');
export const CLIENT_AUTHENTICATION = new InjectionToken<IClientAuthenticationConfiguration>('CLIENT_AUTHENTICATION');
export const PROVIDER_FLOW = new InjectionToken<string>('PROVIDER_FLOW');

export enum AuthenticationProviderActions {
  PasswordResetEmail,
  SessionExpired,
  SignInWithEmailAndPassword,
  SignUpWithEmailAndPassword,
  SignUpWithEmailLink,
  SignInWithEmailLink,
  SignInWithRedirect,
  SignOut,
}

export type AuthenticationProviderErrorType =
  | 'email-already-in-use'
  | 'invalid-email'
  | 'user-disabled'
  | 'user-not-found'
  | 'weak-password'
  | 'wrong-password'
  | 'generic';

export type AuthenticationProviderFlowType = 'email-link' | 'email-password';

// Those provider actions that require Language support
export type AuthenticationProviderLanguageType =
  | AuthenticationProviderActions.SessionExpired
  | AuthenticationProviderActions.SignInWithEmailAndPassword
  | AuthenticationProviderActions.SignUpWithEmailAndPassword
  | AuthenticationProviderActions.SignUpWithEmailLink
  | AuthenticationProviderActions.SignInWithEmailLink
  | AuthenticationProviderActions.SignOut;

export type ClientAuthenticationLanguageType = Record<AuthenticationProviderLanguageType, IAuthenticationLanguageComponentEmail>;
export type ClientAuthenticationProviderErrorLanguageType = Record<AuthenticationProviderErrorType, string>;

export interface IAuthenticationLanguageComponentEmail {
  emailAddressFormLabel?: string;
  emailAddressFormPlaceHolder?: string;
  emailAddressValidationInvalid?: string;
  emailAddressValidationRequired?: string;
  footerLinkText?: string;
  footerText?: string;
  formSubmitLinkText?: string;
  formSubmitText?: string;
  headerSubText?: string;
  headerText?: string;
  passwordFormDisplayDisabled?: string;
  passwordFormDisplayEnabled?: string;
  passwordFormLabel?: string;
  passwordFormPlaceHolder?: string;
  passwordValidationMin?: string;
  passwordValidationRequired?: string;
  sessionInactivityMessage?: string;
  statusErrorDefaultMessage?: string;
  statusErrorExistsMessage?: string;
  statusErrorHeaderText?: string;
  statusErrorLinkText?: string;
  statusErrorSubText?: string;
  statusSuccessHeaderText?: string;
  statusSuccessMessage?: string;
  statusSuccessSubText?: string;
}

export interface IClientAuthenticationConfiguration {
  language?: ClientAuthenticationLanguageType;
  providerErrorLanguage?: ClientAuthenticationProviderErrorLanguageType;
  passwordMinLength?: number;
  authenticationProviderFlow?: AuthenticationProviderFlowType;
  redirectOnSignUpWithEmailLink?: string;
  redirectOnSessionExpiration?: string;
}
/**
 * Subset of the Firebase  object
 */
export interface IAuthenticatedError {
  code: string;
  message: string;
}
/**
 * Subset of the Firebase User object
 */
export interface IAuthenticatedUser {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  uid: string;
}

export interface IAuthenticatedAdditionalUserInfo {
  isNewUser: boolean;
  profile: unknown | null;
  providerId: string;
  username?: string | null;
}

export interface IAuthenticatedCredential {
  providerId: string;
  signInMethod: string;
}

export interface IAuthenticatedUserCredential {
  additionalUserInfo?: IAuthenticatedAdditionalUserInfo | null;
  credential: IAuthenticatedCredential | null;
  operationType?: string | null;
  user: IAuthenticatedUser | null;
}

export interface IAuthenticatedProcessingStatus {
  authenticationProvider: AuthenticationProviderActions | null;
  linkText: string | null;
  message: string;
  title: string;
  subTitle: string;
}

export interface IAuthenticatedSessionTimeout {
  // number of seconds a user can be idle before being logged out
  idleTimeSeconds: number | null;
  // number of seconds a user can go since their last login before they must login again
  sessionTimeSeconds: number | null;
}
