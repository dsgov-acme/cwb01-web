import { InjectionToken } from '@angular/core';

export type IProviderFlow = 'email' | 'redirect';

export interface IFirebaseConfiguration {
  firebase: {
    apiKey: string;
    authDomain: string;
  };
  providerFlow?: IProviderFlow;
  providerId: string;
  tenantId: string;
}

export interface IAuthenticationConfiguration {
  firebaseConfiguration: IFirebaseConfiguration;
  sessionExpiration: {
    idleTimeSeconds: number | null;
    sessionTimeSeconds: number | null;
  };
}

export interface IHTTPConfiguration {
  baseUrl: string;
}

export interface IEnvironment<FeatureFlagT = Record<string, unknown>> {
  authenticationConfiguration: IAuthenticationConfiguration;
  featureFlags?: FeatureFlagT;
  httpConfiguration: IHTTPConfiguration;
}

export interface WindowWithEnvironment extends Window {
  environment: IEnvironment;
}

export const ENVIRONMENT_CONFIGURATION = new InjectionToken<IEnvironment>('ENVIRONMENT_CONFIGURATION');
