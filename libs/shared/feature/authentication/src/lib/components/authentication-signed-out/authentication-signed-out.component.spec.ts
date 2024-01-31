import { Router } from '@angular/router';
import { NuverialButtonComponent } from '@dsg/shared/ui/nuverial';
import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder, MockProvider, ngMocks } from 'ng-mocks';
import { AuthenticationProviderActions, CLIENT_AUTHENTICATION } from '../../models';
import { AuthenticationStatusComponent } from '../authentication-status';
import { AuthenticationSignedOutComponent } from './authentication-signed-out.component';

const dependencies = MockBuilder(AuthenticationSignedOutComponent)
  .keep(NuverialButtonComponent)
  .keep(AuthenticationStatusComponent)
  .provide(
    MockProvider(
      CLIENT_AUTHENTICATION,
      {
        language: {
          [AuthenticationProviderActions.SignOut]: {
            emailAddressFormLabel: 'Lorem ipsum',
          },
        },
      },
      'useValue',
    ),
  )
  .provide({
    provide: Router,
    useValue: {
      navigate: jest.fn(),
    },
  })
  .build();

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(AuthenticationSignedOutComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

describe('AuthenticationSignedOutComponent', () => {
  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { fixture } = await getFixture({});
      const axeResults = await axe(fixture.nativeElement);
      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should display signed ou messaging', async () => {
    await getFixture({});
    expect(await screen.findByText('Sign Out')).toBeVisible();
    expect(await screen.findByText('You have successfully signed out')).toBeVisible();
    expect(await screen.findByText('To sign back in, please go back to the Sign In page.')).toBeVisible();
    expect(await screen.findByText('< Back to sign in')).toBeVisible();
  });

  it('should emit the authentication action without navigation if there is no return url', async () => {
    const { fixture } = await getFixture({});
    const router = ngMocks.findInstance(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');
    const component = fixture.componentInstance;
    component.returnUrl = null;
    jest.spyOn(component.changeAuthenticationAction, 'emit');
    component.onProviderUpdate();

    expect(component.changeAuthenticationAction.emit).toHaveBeenCalledWith(component.authenticationActionSignIn);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should emit the authentication action with navigation if there is a return url', async () => {
    const { fixture } = await getFixture({});
    const router = ngMocks.findInstance(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');
    const component = fixture.componentInstance;
    component.returnUrl = 'test';
    jest.spyOn(component.changeAuthenticationAction, 'emit');
    component.onProviderUpdate();

    expect(component.changeAuthenticationAction.emit).toHaveBeenCalledWith(component.authenticationActionSignIn);
    expect(navigateSpy).toHaveBeenCalled();
  });
});
