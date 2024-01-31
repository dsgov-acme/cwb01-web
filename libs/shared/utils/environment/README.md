# Runtime Environments

The web portals benefit from runtime environments in order to promote builds to higher environments without the need to rebuild artificats

## Setting up environments for a new client app

1. Add the following to the `project.json` app build scripts configuration

```json
"scripts": [
  {
    "bundleName": "environment",
    "inject": false,
    "input": "libs/shared/utils/environment/src/lib/environment.js"
  }
]
```

2. Example application `environments.ts` file

```typescript
import { IEnvironment, WindowWithEnvironment } from '@dsg/shared/utils/environment';

declare let window: WindowWithEnvironment;

const _environment: IEnvironment = {
  httpConfiguration: {
    baseUrl: 'https://dsgov-dev.com',
  },
};

export const environment: IEnvironment = {
  ..._environment,
  ...window.environment, // must be last
};
```

3. Example application `environments.prod.ts` file

```typescript
import { IEnvironment, WindowWithEnvironment } from '@dsg/shared/utils/environment';

declare let window: WindowWithEnvironment;

export const environment: IEnvironment = {
  ...window.environment, // must be last
};
```

4. Load the script in the apps index.html with:

```html
<script src="environment.js"></script>
```

5. Helm will replace the contents of the `environment.js` file in the cloud environments.
6. The FE overrides the environment variables with the configuration built in the environment.js step above

## Accessing environment values

Environment configuration should be accessed with an injection token

```typescript
import { ENVIRONMENT_CONFIGURATION, IEnvironment } from '@dsg/shared/utils/environment';

constructor(protected override readonly _http: HttpClient, @Inject(ENVIRONMENT_CONFIGURATION) protected readonly _environment: IEnvironment)
```
