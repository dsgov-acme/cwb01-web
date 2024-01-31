/** This environment is what the cloud environment builds from, We build the container for the dev environment and the container is graduated to the environments. The environments configuration is configured in the helm repo */

import { IEnvironment, WindowWithEnvironment } from '@dsg/shared/utils/environment';

declare let window: WindowWithEnvironment;

export const environment: IEnvironment = {
  ...window.environment, // must be last
};
