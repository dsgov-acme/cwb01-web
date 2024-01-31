import { IEnvironment, WindowWithEnvironment } from '@dsg/shared/utils/environment';
import { FeatureFlags } from '@dsg/shared/utils/feature-flagging';

declare let window: WindowWithEnvironment;

const _environment: IEnvironment<Partial<FeatureFlags>> = {
  authenticationConfiguration: {
    firebaseConfiguration: {
      firebase: {
        apiKey: 'AIzaSyBb5I7J5yd_e0vL0iuiPrlykv-WQMtgAbw',
        authDomain: 'dsgov-dev.firebaseapp.com',
      },
      providerId: 'oidc.public',
      tenantId: 'public-portal-a2kyb',
    },
    sessionExpiration: {
      idleTimeSeconds: 60 * 30,
      sessionTimeSeconds: 60 * 60 * 18,
    },
  },
  featureFlags: {},
  httpConfiguration: {
    baseUrl: 'https://api-dev.dsgov.demo.nuvalence.io',
  },
};

export const environment: IEnvironment = {
  ..._environment,
  ...window.environment, // must be last
};
