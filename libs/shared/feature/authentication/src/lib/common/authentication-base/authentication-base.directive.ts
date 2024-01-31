import { Directive, EventEmitter, Inject, Input, Optional, Output } from '@angular/core';
import { LoggingService } from '@dsg/shared/utils/logging';
import { catchError, Observable, ReplaySubject, take, tap } from 'rxjs';
import {
  AuthenticationProviderActions,
  AuthenticationProviderLanguageType,
  CLIENT_AUTHENTICATION,
  DEFAULT_LANGUAGE,
  IAuthenticatedProcessingStatus,
  IAuthenticationLanguageComponentEmail,
  IClientAuthenticationConfiguration,
} from '../../models';
import { AuthenticationService } from '../../services';

const CONTEXT = 'AuthenticationBaseDirective';

@Directive({
  selector: '[dsgAuthenticationBaseDirective]',
  standalone: true,
})
export class AuthenticationBaseDirective {
  /**
   * Set Authentication Action
   */
  @Input() public set authenticationAction(action: AuthenticationProviderActions) {
    this._authenticationAction = action;
  }
  public get authenticationAction(): AuthenticationProviderActions {
    return this._authenticationAction;
  }

  /**
   * AuthenticationAction change event
   */
  @Output() public readonly changeAuthenticationAction = new EventEmitter<AuthenticationProviderActions>();

  public language!: IAuthenticationLanguageComponentEmail;
  public processingStatus$!: Observable<IAuthenticatedProcessingStatus>;

  protected _authenticationAction!: AuthenticationProviderActions;
  protected readonly _processingStatus: ReplaySubject<IAuthenticatedProcessingStatus> = new ReplaySubject<IAuthenticatedProcessingStatus>();

  constructor(
    protected readonly _authenticationService: AuthenticationService,
    protected readonly _loggingService: LoggingService,
    @Optional() @Inject(CLIENT_AUTHENTICATION) protected readonly _configuration: IClientAuthenticationConfiguration,
  ) {
    this.processingStatus$ = this._processingStatus.asObservable();
  }

  protected _processRequest(request: Observable<unknown>, cb?: (status: 'error' | 'success', result: unknown) => void) {
    request
      .pipe(
        take(1),
        tap(result => {
          this._processingStatus.next({
            authenticationProvider: null,
            linkText: null,
            message: this.language.statusSuccessMessage || '',
            subTitle: this.language.statusSuccessSubText || '',
            title: this.language.statusSuccessHeaderText || '',
          });
          cb && cb('success', result);
        }),
        catchError(error => {
          if (error.code !== 'auth/email-already-in-use') {
            this._loggingService.error(CONTEXT, error.message);
          }

          this._processingStatus.next({
            authenticationProvider: this.authenticationAction,
            linkText: this.language.statusErrorLinkText || '',
            message: this._authenticationService.errorString(error),
            subTitle: this.language.statusErrorSubText || '',
            title: this.language.statusErrorHeaderText || '',
          });
          cb && cb('error', error);
          throw error;
        }),
      )
      .subscribe();
  }

  protected _configure() {
    this.language = DEFAULT_LANGUAGE[this.authenticationAction as AuthenticationProviderLanguageType];
    if (this._configuration?.language?.[this.authenticationAction as AuthenticationProviderLanguageType]) {
      this.language = {
        ...this.language,
        ...this._configuration?.language?.[this.authenticationAction as AuthenticationProviderLanguageType],
      };
    }
  }
}
