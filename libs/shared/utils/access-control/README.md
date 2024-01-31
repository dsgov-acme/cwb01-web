# shared-utils-access-control

This library exposes functionality to implement feature flagging.

## Set up new application

- Import the module in the app root module with `AccessControlModule.forRoot(),`

## How to use access control

To introduce a new capability the first step is to update the `access-control.model` file with the new capability key.

A capability check will return a boolean, or a string or number. To implement a system capability check you can subscribe to `AccessControlService.isAuthorized$`.

### Enable/disable routes with FeatureFlagGuard

To enable/disable an entire route based on the capability, use the AccessControlGuard. To use it, add `canActivate: [AccessControlGuard],` to your route, and provide the capability key in the `data` parameter:

```typescript
canActivate: [AccessControlGuard],
data: {
  capability: 'transaction-management-read',
  redirectUrl: '/some-url', // optional
},
```

### Hide/show elements based on a capability

To easily hide/show elements based on a capability, a couple of directives `*dsgAuthorized` and `*dsgUnauthorized` are available. These structural directives similar to `*ngIf` with a provided parameter the capability key. Example below:

Add `FeatureFlagModule` to the components imports array

#### Authorized directive

HTML `*dsgAuthorized="'some-capability'"`

This will show content if the user is authorized

#### Unauthorized directive

HTML `*dsgUnauthorized="'some-capability'"`

This will show content if the user is unauthorized
