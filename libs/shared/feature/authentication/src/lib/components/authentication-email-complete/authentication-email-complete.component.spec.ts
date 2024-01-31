import { NuverialButtonComponent } from '@dsg/shared/ui/nuverial';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder, MockComponent, MockInstance, MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { AuthenticationProviderActions, CLIENT_AUTHENTICATION } from '../../models';
import { AuthenticationService } from '../../services';
import { AuthenticationStatusComponent } from '../authentication-status';
import { AuthenticationEmailCompleteComponent } from './authentication-email-complete.component';

const dependencies = MockBuilder(AuthenticationEmailCompleteComponent)
  .keep(NuverialButtonComponent)
  .mock(MockComponent(AuthenticationStatusComponent))
  .provide(
    MockProvider(
      CLIENT_AUTHENTICATION,
      {
        language: {
          [AuthenticationProviderActions.SignInWithEmailAndPassword]: {
            emailAddressFormLabel: 'Lorem ipsum',
          },
        },
      },
      'useValue',
    ),
  )
  .build();

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(AuthenticationEmailCompleteComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

describe('AuthenticationEmailCompleteComponent', () => {
  beforeAll(MockInstance.remember);
  afterAll(MockInstance.restore);
  beforeAll(() => {
    MockInstance(AuthenticationService, 'signInWithEmailLink', () =>
      of({
        additionalUserInfo: null,
        credential: null,
        operationType: null,
        user: {
          displayName: null,
          email: 'email@domin.com',
          phoneNumber: null,
          photoURL: null,
          providerId: 'providerId',
          uid: 'uid',
        },
      }),
    );
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { fixture } = await getFixture({});
      const axeResults = await axe(fixture.nativeElement);
      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should signInWithEmailLink', async () => {
    const { fixture } = await getFixture({});
    let completionStatus = null;

    fixture.componentInstance.processingStatus$.subscribe(status => (completionStatus = status));
    expect(completionStatus).toBeTruthy();
  });

  it('should emit changeAuthenticationAction on status close', async () => {
    const { fixture } = await getFixture({});
    const emitSpy = jest.spyOn(fixture.componentInstance.changeAuthenticationAction, 'emit');
    fixture.componentInstance.onStatusClose();
    expect(emitSpy).toBeCalledWith(AuthenticationProviderActions.SignUpWithEmailLink);
  });
});
