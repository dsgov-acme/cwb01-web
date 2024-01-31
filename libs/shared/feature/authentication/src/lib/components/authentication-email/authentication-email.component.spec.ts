import { NuverialButtonComponent } from '@dsg/shared/ui/nuverial';
import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder, MockInstance, MockProvider, ngMocks } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { AuthenticationProviderActions, CLIENT_AUTHENTICATION } from '../../models';
import { AuthenticationService } from '../../services';
import { AuthenticationEmailComponent } from './authentication-email.component';

const dependencies = MockBuilder(AuthenticationEmailComponent).keep(NuverialButtonComponent).build();

const getFixture = async (props: Record<string, Record<string, unknown>>, deps?: unknown) => {
  const { fixture } = await render(AuthenticationEmailComponent, {
    ...(deps ? deps : dependencies),
    ...props,
  });

  return { fixture };
};

describe('AuthenticationEmailComponent', () => {
  beforeAll(MockInstance.remember);
  afterAll(MockInstance.restore);
  beforeAll(() => {
    MockInstance(AuthenticationService, 'createUserWithEmailAndPassword', () =>
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
    MockInstance(AuthenticationService, 'signUpWithEmailLink', () => of(undefined));
    MockInstance(AuthenticationService, 'signInWithEmailAndPassword', () =>
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

  it('should not call onSubmitClick if form is invalid', async () => {
    const { fixture } = await getFixture({
      componentProperties: {
        authenticationAction: AuthenticationProviderActions.SignUpWithEmailAndPassword,
      },
    });

    fixture.componentInstance.formGroup.addValidators(() => ({ invalid: true }));
    fixture.detectChanges();

    jest.spyOn(fixture.componentInstance, 'onSubmitClick');

    const formControls = fixture.componentInstance.formGroup.controls;

    formControls['emailAddress'].setValue('');
    formControls['password'].setValue('');
    fixture.componentInstance.formGroup.updateValueAndValidity();
    fixture.componentInstance.handleEnterKey();
    expect(fixture.componentInstance.onSubmitClick).not.toHaveBeenCalled();
  });

  it('should call onSubmitClick if form is valid', async () => {
    const { fixture } = await getFixture({ componentProperties: { authenticationAction: AuthenticationProviderActions.SignInWithEmailAndPassword } });

    fixture.componentInstance.ngOnInit();

    fixture.detectChanges();

    jest.spyOn(fixture.componentInstance, 'onSubmitClick');

    const formControls = fixture.componentInstance.formGroup.controls;

    formControls['emailAddress'].setValue('test@test.com');
    formControls['password'].setValue('password');
    fixture.componentInstance.handleEnterKey();
    expect(fixture.componentInstance.onSubmitClick).toHaveBeenCalled();
  });

  it('should display SignInWithEmailAndPassword form', async () => {
    const { fixture } = await getFixture({ componentProperties: { authenticationAction: AuthenticationProviderActions.SignInWithEmailAndPassword } });
    fixture.detectChanges();

    expect(await screen.findByText('Welcome back!')).toBeVisible();
    expect(await screen.findByText('Enter your email and password to sign in.')).toBeVisible();
    expect(await screen.findByText('Sign in')).toBeVisible();
    expect(await screen.findByText('Don’t have an account?')).toBeVisible();
    expect(await screen.findByText('Sign Up')).toBeVisible();
  });

  it('should display SignUpWithEmailAndPassword form', async () => {
    await getFixture({ componentProperties: { authenticationAction: AuthenticationProviderActions.SignUpWithEmailAndPassword } });
    expect(await screen.findByText('Sign Up to DSGov')).toBeVisible();
    expect(await screen.findByText('Please fill in required fields below.')).toBeVisible();
    expect(await screen.findByText('Sign up')).toBeVisible();
    expect(await screen.findByText('Already have an account?')).toBeVisible();
    expect(await screen.findByText('Sign In')).toBeVisible();
  });

  it('should display updated provider', async () => {
    let provider = null;
    const { fixture } = await getFixture({
      componentProperties: {
        authenticationAction: AuthenticationProviderActions.SignUpWithEmailAndPassword,
        authenticationActionSignIn: AuthenticationProviderActions.SignInWithEmailAndPassword,
      },
    });
    fixture.detectChanges();

    fixture.componentInstance.changeAuthenticationAction.subscribe(result => (provider = result));
    ngMocks.click('.dsg-authentication-email-footer-link');

    expect(provider).toEqual(AuthenticationProviderActions.SignInWithEmailAndPassword);
  });

  it('should use default language', async () => {
    const { fixture } = await getFixture({
      componentProperties: {
        authenticationAction: AuthenticationProviderActions.SignUpWithEmailAndPassword,
        authenticationActionSignIn: AuthenticationProviderActions.SignInWithEmailAndPassword,
      },
    });

    expect(fixture.componentInstance.language.emailAddressFormLabel).toEqual('Email');
  });

  it('should create email account', async () => {
    const { fixture } = await getFixture({
      componentProperties: {
        authenticationAction: AuthenticationProviderActions.SignUpWithEmailAndPassword,
      },
    });
    let completionStatus = null;

    fixture.detectChanges();

    fixture.componentInstance.processingStatus$.subscribe(status => (completionStatus = status));
    expect(fixture.componentInstance.formGroup.status).toEqual('VALID');
    let button = ngMocks.find('button');
    expect(button.componentInstance.disabled).toEqual(true);

    fixture.componentInstance.emailAddress.setValue('a@a.com');
    fixture.componentInstance.password.setValue('abc123');
    fixture.componentInstance.formGroup.updateValueAndValidity();

    fixture.detectChanges();
    expect(fixture.componentInstance.formGroup.status).toEqual('VALID');

    button = ngMocks.find('button');
    expect(button.componentInstance.disabled).toEqual(false);
    ngMocks.click('button');
    expect(completionStatus).toEqual({
      authenticationProvider: null,
      linkText: null,
      message: 'Please click the link sent to your email account to verify your email address.',
      subTitle: 'Your account has been created!',
      title: 'Success',
    });
  });

  it('should sign up with email link', async () => {
    const { fixture } = await getFixture({
      componentProperties: {
        authenticationAction: AuthenticationProviderActions.SignUpWithEmailLink,
      },
    });
    let completionStatus = null;

    fixture.detectChanges();

    fixture.componentInstance.processingStatus$.subscribe(status => (completionStatus = status));
    expect(fixture.componentInstance.formGroup.status).toEqual('VALID');
    expect(fixture.componentInstance.password).toBeFalsy();
    let button = ngMocks.find('button');
    expect(button.componentInstance.disabled).toEqual(true);
    fixture.componentInstance.emailAddress.setValue('a@a.com');
    fixture.componentInstance.formGroup.updateValueAndValidity();

    fixture.detectChanges();
    expect(fixture.componentInstance.formGroup.status).toEqual('VALID');

    button = ngMocks.find('button');
    expect(button.componentInstance.disabled).toEqual(false);
    ngMocks.click('button');
    expect(completionStatus).toEqual({
      authenticationProvider: null,
      linkText: null,
      message: 'Please click the link sent to your email account to verify your email address.',
      subTitle: 'Your account has been created!',
      title: 'Success',
    });
  });

  it('should sign into to email account', async () => {
    const { fixture } = await getFixture({
      componentProperties: {
        authenticationAction: AuthenticationProviderActions.SignUpWithEmailLink,
        returnUrl: '/main/profile',
      },
    });

    fixture.detectChanges();
    expect(fixture.componentInstance.formGroup.status).toEqual('VALID');
    expect(fixture.componentInstance.password).toBeFalsy();
    let button = ngMocks.find('button');
    expect(button.componentInstance.disabled).toEqual(true);

    fixture.componentInstance.authenticationAction = AuthenticationProviderActions.SignInWithEmailAndPassword;
    fixture.detectChanges();
    expect(fixture.componentInstance.password).toBeTruthy();
    expect(fixture.componentInstance.passwordValidationMessages).toEqual({
      min: 'Password must be at least 6 characters long',
      required: 'Password is required',
    });

    fixture.componentInstance.emailAddress.setValue('a@a.com');
    fixture.componentInstance.password.setValue('abc123');
    fixture.componentInstance.formGroup.updateValueAndValidity();

    fixture.detectChanges();
    expect(fixture.componentInstance.formGroup.status).toEqual('VALID');

    button = ngMocks.find('button');
    expect(button.componentInstance.disabled).toEqual(false);
    ngMocks.click('button');
    expect(fixture.componentInstance.processingStatus).toEqual('complete');

    fixture.componentInstance.onStatusClose();
    expect(fixture.componentInstance.processingStatus).toEqual('active');
  });

  it('should use provided language', async () => {
    const deps = MockBuilder(AuthenticationEmailComponent)
      .keep(NuverialButtonComponent)
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
    const { fixture } = await getFixture(
      {
        componentProperties: {
          authenticationAction: AuthenticationProviderActions.SignInWithEmailAndPassword,
        },
      },
      deps,
    );

    expect(fixture.componentInstance.language.emailAddressFormLabel).toEqual('Lorem ipsum');
  });

  it('should use provided config no lanuage', async () => {
    const deps = MockBuilder(AuthenticationEmailComponent)
      .keep(NuverialButtonComponent)
      .provide(
        MockProvider(
          CLIENT_AUTHENTICATION,
          {
            redirectOnSignUpWithEmailLink: 'link-name',
          },
          'useValue',
        ),
      )
      .build();
    const { fixture } = await getFixture(
      {
        componentProperties: {
          authenticationAction: AuthenticationProviderActions.SignInWithEmailAndPassword,
        },
      },
      deps,
    );

    expect(fixture.componentInstance.language.emailAddressFormLabel).toEqual('Email');
  });

  describe('AuthenticationEmailComponent error suite', () => {
    beforeEach(MockInstance.remember);
    afterEach(MockInstance.restore);

    beforeEach(() => {
      MockInstance(
        AuthenticationService,
        'createUserWithEmailAndPassword',
        jest.fn().mockImplementation(() => {
          return throwError(() => ({
            code: '1234',
            message: 'error message',
          }));
        }),
      );
      MockInstance(
        AuthenticationService,
        'signInWithEmailAndPassword',
        jest.fn().mockImplementation(() => {
          return throwError(() => ({
            code: '1234',
            message: 'error message',
          }));
        }),
      );
      MockInstance(
        AuthenticationService,
        'signUpWithEmailLink',
        jest.fn().mockImplementation(() => {
          return throwError(() => ({
            code: 'auth/email-already-in-use',
            message: 'error message',
          }));
        }),
      );
      MockInstance(
        AuthenticationService,
        'errorString',
        jest.fn().mockImplementation(() => 'error message'),
      );
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
      );
    });

    it('should error creating email account', async () => {
      const { fixture } = await getFixture({ componentProperties: { authenticationAction: AuthenticationProviderActions.SignUpWithEmailAndPassword } });
      let completionStatus = null;
      fixture.componentInstance.processingStatus$.subscribe(status => (completionStatus = status));
      fixture.componentInstance.emailAddress.setValue('a@a.com');
      fixture.componentInstance.password.setValue('abc123');
      fixture.componentInstance.formGroup.updateValueAndValidity();

      fixture.detectChanges();
      ngMocks.click('button');
      expect(completionStatus).toEqual({
        authenticationProvider: 3,
        linkText: 'Return to sign up',
        message: 'error message',
        subTitle: 'Unable to create your account',
        title: 'Failed',
      });
    });

    it('should error signing in to email account', async () => {
      const { fixture } = await getFixture({ componentProperties: { authenticationAction: AuthenticationProviderActions.SignInWithEmailAndPassword } });
      let completionStatus = null;
      fixture.componentInstance.processingStatus$.subscribe(status => (completionStatus = status));
      fixture.componentInstance.emailAddress.setValue('a@a.com');
      fixture.componentInstance.password.setValue('abc123');
      fixture.componentInstance.formGroup.updateValueAndValidity();

      fixture.detectChanges();
      ngMocks.click('button');
      expect(completionStatus).toEqual({
        authenticationProvider: 2,
        linkText: 'Return to sign in',
        message: 'error message',
        subTitle: 'Unable to access your account',
        title: 'Failed',
      });
    });

    it('should error creating email link', async () => {
      const { fixture } = await getFixture({ componentProperties: { authenticationAction: AuthenticationProviderActions.SignUpWithEmailLink } });
      let completionStatus = null;
      fixture.componentInstance.processingStatus$.subscribe(status => (completionStatus = status));
      fixture.componentInstance.emailAddress.setValue('a@a.com');
      fixture.componentInstance.formGroup.updateValueAndValidity();

      fixture.detectChanges();
      ngMocks.click('button');
      expect(completionStatus).toEqual({
        authenticationProvider: 4,
        linkText: 'Return to sign up',
        message: 'error message',
        subTitle: 'Unable to create your account',
        title: 'Failed',
      });
    });
  });
});
