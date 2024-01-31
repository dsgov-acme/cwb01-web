import { IEnvironment } from '../environment.model';

export const mockEnvironment: IEnvironment = {
  authenticationConfiguration: {
    firebaseConfiguration: {
      firebase: {
        apiKey: 'api-key',
        authDomain: 'auth-domain',
      },
      providerId: 'oidc.test',
      tenantId: 'tenant-id',
    },
    sessionExpiration: {
      idleTimeSeconds: 100,
      sessionTimeSeconds: 200,
    },
  },
  httpConfiguration: {
    baseUrl: 'https://dsgov-test.com',
  },
};
