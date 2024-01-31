import { ActivatedRoute, convertToParamMap, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder, MockInstance, MockProvider, NG_MOCKS_ROOT_PROVIDERS } from 'ng-mocks';
import { of } from 'rxjs';
import { AuthenticationProviderActions } from '../../models';
import { AuthenticationComponent } from './authentication.component';

const dependencies = MockBuilder(AuthenticationComponent)
  .keep(RouterModule)
  .keep(RouterTestingModule.withRoutes([]))
  .keep(NG_MOCKS_ROOT_PROVIDERS)
  .provide({
    provide: ActivatedRoute,
    useValue: {
      queryParamMap: of(convertToParamMap({ returnUrl: '/main/profile' })),
    },
  })
  .build();

const getFixture = async (props: Record<string, Record<string, unknown>>, deps?: unknown) => {
  const { fixture } = await render(AuthenticationComponent, {
    ...(deps ? deps : dependencies),
    ...props,
  });

  return { component: fixture.componentInstance, fixture };
};

describe('AuthenticationComponent', () => {
  beforeAll(MockInstance.remember);
  afterAll(MockInstance.restore);
  beforeAll(() => {
    MockProvider(
      ActivatedRoute,
      {
        queryParamMap: of(convertToParamMap({ returnUrl: '/main/profile' })),
      },
      'useValue',
    );
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { fixture } = await getFixture({});
      const axeResults = await axe(fixture.nativeElement);
      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should have default SignInWithEmailAndPassword provide', async () => {
    const { fixture } = await getFixture({});
    fixture.detectChanges();
    expect(fixture.componentInstance.authenticationAction).toEqual(AuthenticationProviderActions.SignInWithEmailAndPassword);
    expect(fixture.componentInstance.authenticationActionSignIn).toEqual(AuthenticationProviderActions.SignUpWithEmailAndPassword);
    expect(fixture.componentInstance.actionReset).toEqual(AuthenticationProviderActions.PasswordResetEmail);
  });

  it('should switch provider to SignUpWithEmailAndPassword', async () => {
    const { fixture } = await getFixture({});
    fixture.detectChanges();
    fixture.componentInstance.onChangeAuthenticationProvider(AuthenticationProviderActions.SignUpWithEmailAndPassword);
    expect(fixture.componentInstance.authenticationAction).toEqual(AuthenticationProviderActions.SignUpWithEmailAndPassword);
    expect(fixture.componentInstance.authenticationActionSignIn).toEqual(AuthenticationProviderActions.SignInWithEmailAndPassword);
    expect(fixture.componentInstance.actionReset).toEqual(null);
  });

  it('should switch provider to SignInWithEmailAndPassword', async () => {
    const { fixture } = await getFixture({});
    fixture.detectChanges();
    fixture.componentInstance.onChangeAuthenticationProvider(AuthenticationProviderActions.SignInWithEmailAndPassword);
    expect(fixture.componentInstance.authenticationAction).toEqual(AuthenticationProviderActions.SignInWithEmailAndPassword);
    expect(fixture.componentInstance.authenticationActionSignIn).toEqual(AuthenticationProviderActions.SignUpWithEmailAndPassword);
    expect(fixture.componentInstance.actionReset).toEqual(AuthenticationProviderActions.PasswordResetEmail);
  });

  it('should switch provider to SignInWithEmailAndPassword', async () => {
    const { fixture } = await getFixture({});
    fixture.detectChanges();
    fixture.componentInstance.onChangeAuthenticationProvider(AuthenticationProviderActions.PasswordResetEmail);
    expect(fixture.componentInstance.authenticationAction).toEqual(AuthenticationProviderActions.PasswordResetEmail);
    expect(fixture.componentInstance.authenticationActionSignIn).toEqual(AuthenticationProviderActions.SignUpWithEmailAndPassword);
    expect(fixture.componentInstance.actionReset).toEqual(null);
  });

  it('should switch provider to SignUpWithEmailLink', async () => {
    const { fixture } = await getFixture({});
    fixture.detectChanges();
    fixture.componentInstance.onChangeAuthenticationProvider(AuthenticationProviderActions.SignUpWithEmailLink);
    expect(fixture.componentInstance.authenticationAction).toEqual(AuthenticationProviderActions.SignUpWithEmailLink);
    expect(fixture.componentInstance.authenticationActionSignIn).toEqual(AuthenticationProviderActions.SignInWithEmailAndPassword);
    expect(fixture.componentInstance.actionReset).toEqual(null);
  });

  it('should switch provider to SignInWithEmailLink', async () => {
    const { fixture } = await getFixture({});
    fixture.detectChanges();
    fixture.componentInstance.onChangeAuthenticationProvider(AuthenticationProviderActions.SignInWithEmailLink);
    expect(fixture.componentInstance.authenticationAction).toEqual(AuthenticationProviderActions.SignInWithEmailLink);
    expect(fixture.componentInstance.authenticationActionSignIn).toEqual(AuthenticationProviderActions.SignInWithEmailAndPassword);
    expect(fixture.componentInstance.actionReset).toEqual(null);
  });
  it('should switch provider to SignOut', async () => {
    const { fixture } = await getFixture({});
    fixture.detectChanges();
    fixture.componentInstance.onChangeAuthenticationProvider(AuthenticationProviderActions.SignOut);
    expect(fixture.componentInstance.activeComponent).toEqual('authentication-signed-out');
    expect(fixture.componentInstance.authenticationAction).toEqual(AuthenticationProviderActions.SignOut);
    expect(fixture.componentInstance.authenticationActionSignIn).toEqual(AuthenticationProviderActions.SignInWithEmailAndPassword);
    expect(fixture.componentInstance.actionReset).toEqual(null);
  });

  it('should switch provider to SignInWithRedirect', async () => {
    const { fixture } = await getFixture({});
    fixture.detectChanges();
    fixture.componentInstance.onChangeAuthenticationProvider(AuthenticationProviderActions.SignInWithRedirect);
    expect(fixture.componentInstance.activeComponent).toEqual('authentication-redirect');
    expect(fixture.componentInstance.authenticationAction).toEqual(AuthenticationProviderActions.SignInWithRedirect);
    expect(fixture.componentInstance.authenticationActionSignIn).toEqual(AuthenticationProviderActions.SignInWithRedirect);
    expect(fixture.componentInstance.actionReset).toEqual(null);
  });

  it('should have return url', async () => {
    let returnUrl;
    const { fixture } = await getFixture({});
    fixture.detectChanges();
    fixture.componentInstance.returnUrl$.subscribe(url => (returnUrl = url));

    expect(returnUrl).toEqual('/main/profile');
  });

  it('should use api key param', async () => {
    const deps = MockBuilder(AuthenticationComponent)
      .keep(RouterModule)
      .keep(RouterTestingModule.withRoutes([]))
      .keep(NG_MOCKS_ROOT_PROVIDERS)
      .provide({
        provide: ActivatedRoute,
        useValue: {
          queryParamMap: of(convertToParamMap({ apiKey: '' })),
        },
      })
      .build();
    const { fixture } = await getFixture({}, deps);
    fixture.detectChanges();
    expect(fixture.componentInstance.authenticationAction).toEqual(AuthenticationProviderActions.SignInWithEmailLink);
    expect(fixture.componentInstance.authenticationActionSignIn).toEqual(AuthenticationProviderActions.SignInWithEmailAndPassword);
    expect(fixture.componentInstance.actionReset).toEqual(null);
  });

  describe('_configure', () => {
    it('should set the returnUrl and authenticationProviderFlow based on the configuration', async () => {
      const { component } = await getFixture({});
      (component as any)['_configuration'] = {
        authenticationProviderFlow: 'email',
        redirectOnSignUpWithEmailLink: '/custom/redirect',
      };
      component['_configure']();
      expect(component['_returnUrl']).toEqual('/custom/redirect');
      expect(component['_authenticationProviderFlow']).toEqual('email');
    });
    it('should call onChangeAuthenticationProvider with SignInWithRedirect when providerFlow is "redirect"', async () => {
      const { component } = await getFixture({});
      (component as any)._providerFlow = 'redirect';
      const onChangeAuthenticationProviderSpy = jest.spyOn(component, 'onChangeAuthenticationProvider');

      component['_configure']();

      expect(onChangeAuthenticationProviderSpy).toHaveBeenCalledWith(AuthenticationProviderActions.SignInWithRedirect);
    });
    it('should call onChangeAuthenticationProvider with SignInWithEmailAndPassword when providerFlow is "email"', async () => {
      const { component } = await getFixture({});
      (component as any)._providerFlow = 'email';
      const onChangeAuthenticationProviderSpy = jest.spyOn(component, 'onChangeAuthenticationProvider');
      component['_configure']();
      expect(onChangeAuthenticationProviderSpy).toHaveBeenCalledWith(AuthenticationProviderActions.SignInWithEmailAndPassword);
    });
  });
});
