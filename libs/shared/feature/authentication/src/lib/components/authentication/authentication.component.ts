import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProviderFlow } from '@dsg/shared/utils/environment';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthenticationProviderActions, AuthenticationProviderFlowType, CLIENT_AUTHENTICATION, IClientAuthenticationConfiguration } from '../../models';
import { AuthenticationEmailComponent } from '../authentication-email';
import { AuthenticationEmailCompleteComponent } from '../authentication-email-complete';
import { AuthenticationRedirectComponent } from '../authentication-redirect';
import { AuthenticationSignedOutComponent } from '../authentication-signed-out';
import { PROVIDER_FLOW } from './../../models/authentication.model';

const DEFAULT_SIGNIN_REDIRECT = 'main/profile';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AuthenticationEmailComponent,
    AuthenticationEmailCompleteComponent,
    AuthenticationSignedOutComponent,
    AuthenticationRedirectComponent,
  ],
  selector: 'dsg-authentication',
  standalone: true,
  styleUrls: ['./authentication.component.scss'],
  templateUrl: './authentication.component.html',
})
export class AuthenticationComponent implements OnInit {
  public actionReset: AuthenticationProviderActions | null = AuthenticationProviderActions.PasswordResetEmail;
  public authenticationAction: AuthenticationProviderActions = AuthenticationProviderActions.SignInWithEmailAndPassword;
  public authenticationActionSignIn: AuthenticationProviderActions = AuthenticationProviderActions.SignUpWithEmailAndPassword;

  public activeComponent: 'authentication-email' | 'authentication-email-complete' | 'authentication-signed-out' | 'authentication-redirect' =
    'authentication-email';
  public returnUrl$!: Observable<string | null>;

  protected _authenticationProviderFlow: AuthenticationProviderFlowType = 'email-password';
  protected _returnUrl = DEFAULT_SIGNIN_REDIRECT;

  constructor(
    protected _route: ActivatedRoute,
    @Optional() @Inject(CLIENT_AUTHENTICATION) protected readonly _configuration: IClientAuthenticationConfiguration,
    @Optional() @Inject(PROVIDER_FLOW) protected readonly _providerFlow: IProviderFlow,
  ) {
    this._configure();
  }

  public ngOnInit(): void {
    this.returnUrl$ = this._route.queryParamMap.pipe(map(params => (params.has('returnUrl') ? params.get('returnUrl') : this._returnUrl)));
    this._route.queryParamMap
      .pipe(
        take(1),
        tap(params => {
          if (params.has('apiKey')) {
            this.onChangeAuthenticationProvider(AuthenticationProviderActions.SignInWithEmailLink);
          } else if (params.has('status') && params.get('status') === 'signedOut') {
            this.onChangeAuthenticationProvider(AuthenticationProviderActions.SignOut);
          }
        }),
      )
      .subscribe();
  }

  public onChangeAuthenticationProvider(event: AuthenticationProviderActions) {
    this.activeComponent = 'authentication-email';
    switch (event) {
      case AuthenticationProviderActions.PasswordResetEmail:
        this.actionReset = null;
        this.authenticationAction = AuthenticationProviderActions.PasswordResetEmail;
        this.authenticationActionSignIn = AuthenticationProviderActions.SignUpWithEmailAndPassword;
        break;
      case AuthenticationProviderActions.SignInWithEmailAndPassword:
        this.actionReset = AuthenticationProviderActions.PasswordResetEmail;
        this.authenticationAction = AuthenticationProviderActions.SignInWithEmailAndPassword;
        this.authenticationActionSignIn =
          this._authenticationProviderFlow === 'email-link'
            ? AuthenticationProviderActions.SignUpWithEmailLink
            : AuthenticationProviderActions.SignUpWithEmailAndPassword;
        break;
      case AuthenticationProviderActions.SignUpWithEmailAndPassword:
        this.actionReset = null;
        this.authenticationAction = AuthenticationProviderActions.SignUpWithEmailAndPassword;
        this.authenticationActionSignIn = AuthenticationProviderActions.SignInWithEmailAndPassword;
        break;
      case AuthenticationProviderActions.SignUpWithEmailLink:
        this.actionReset = null;
        this.authenticationAction = AuthenticationProviderActions.SignUpWithEmailLink;
        this.authenticationActionSignIn = AuthenticationProviderActions.SignInWithEmailAndPassword;
        break;
      case AuthenticationProviderActions.SignInWithEmailLink:
        this.activeComponent = 'authentication-email-complete';
        this.actionReset = null;
        this.authenticationAction = AuthenticationProviderActions.SignInWithEmailLink;
        this.authenticationActionSignIn = AuthenticationProviderActions.SignInWithEmailAndPassword;
        break;
      case AuthenticationProviderActions.SignOut:
        this.activeComponent = 'authentication-signed-out';
        this.actionReset = null;
        this.authenticationAction = AuthenticationProviderActions.SignOut;
        this.authenticationActionSignIn = this._authenticationActionSignInFromProviderFlow();
        break;
      case AuthenticationProviderActions.SignInWithRedirect:
        this.activeComponent = 'authentication-redirect';
        this.actionReset = null;
        this.authenticationAction = AuthenticationProviderActions.SignInWithRedirect;
        this.authenticationActionSignIn = AuthenticationProviderActions.SignInWithRedirect;
        break;
    }
  }

  private _configure() {
    this._returnUrl = this._configuration?.redirectOnSignUpWithEmailLink || DEFAULT_SIGNIN_REDIRECT;
    this._authenticationProviderFlow = this._configuration?.authenticationProviderFlow || this._authenticationProviderFlow;

    switch (this._providerFlow) {
      case 'redirect':
        this.onChangeAuthenticationProvider(AuthenticationProviderActions.SignInWithRedirect);
        break;
      case 'email':
        this.onChangeAuthenticationProvider(AuthenticationProviderActions.SignInWithEmailAndPassword);
        break;
    }
  }

  private _authenticationActionSignInFromProviderFlow(): AuthenticationProviderActions {
    let authenticationActionSignIn: AuthenticationProviderActions = AuthenticationProviderActions.SignInWithEmailAndPassword;
    switch (this._providerFlow) {
      case 'redirect':
        authenticationActionSignIn = AuthenticationProviderActions.SignInWithRedirect;
        break;
      case 'email':
        authenticationActionSignIn = AuthenticationProviderActions.SignInWithEmailAndPassword;
        break;
    }

    return authenticationActionSignIn;
  }
}
