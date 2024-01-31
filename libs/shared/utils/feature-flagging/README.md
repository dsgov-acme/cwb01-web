# Feature Flagging

This library exposes functionality to implement feature flagging. It is set up platform agnostic, for MPWR we are using a configuration file.

## Dependencies

yarn

```console
  yarn add @ngneat/until-destroy
```

npm

```console
  npm install @ngneat/until-destroy
```

## Set up new application

- Import the module in the app root module with `FeatureFlagModule.useEnvironmentAdapter(),`

## How to use feature flagging

To introduce a new feature the first step is to update the `feature-flag.const` file with the new feature flag name and default value. Generally the default value will be false. ex. `new-feature: false`

A feature toggle can be either a boolean (most common), or a string or number. For boolean feature toggles (the most common usage), you can also use `FeatureFlaggingService.isFeatureFlagEnabled$<FeatureKeys>`. To subscribe to values of a feature flag, subscribe to `FeatureFlaggingService.getFeatureFlagValue$<FeatureKeys>`.

### Enable/disable routes with FeatureFlagGuard

To enable/disable an entire route based on the value of a boolean feature toggle, use the FeatureFlagGuard. To use it, add `canActivate: [FeatureFlagGuard],` to your route, and provide the feature key in the `data` parameter:

```typescript
canActivate: [FeatureFlagGuard],
data: {
  featureFlag: 'new-feature-flag',
  redirectUrl: '/the-url'
},
```

### Hide/show elements based on a feature toggle

To easily hide/show elements based on a feature toggle, a convenient directive `*featureFlag` is available. Essentially this is a `*ngIf` with as parameter the feature key. Example below:

Add `FeatureFlagModule` to the components imports array

#### Option 1

HTML `*dsgFeatureFlag="'new-feature-flag'"`

#### Option 2

HTML `*dsgFeatureFlag="newFeatureFlag"`

TS `public readonly newFeatureFlag: FeatureKeys ='feature-name';`

This will hide/show the element based on the given feature key.
