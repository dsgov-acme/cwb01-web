import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoggingService } from '@dsg/shared/utils/logging';
import { AuthenticationService } from '../../services';
import { AuthenticationProviderActions, CLIENT_AUTHENTICATION, IClientAuthenticationConfiguration } from '../../models';

import { AuthenticationStatusComponent } from '../authentication-status';
import { AuthenticationBaseDirective } from '../../common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AuthenticationStatusComponent],
  selector: 'dsg-authentication-email-complete',
  standalone: true,
  styleUrls: ['./authentication-email-complete.component.scss'],
  templateUrl: './authentication-email-complete.component.html',
})
export class AuthenticationEmailCompleteComponent extends AuthenticationBaseDirective implements OnInit {
  /**
   * Set return URL
   */
  @Input() public returnUrl: string | null = null;

  constructor(
    protected readonly _router: Router,
    protected override readonly _authenticationService: AuthenticationService,
    protected override _loggingService: LoggingService,
    @Optional() @Inject(CLIENT_AUTHENTICATION) protected override readonly _configuration: IClientAuthenticationConfiguration,
  ) {
    super(_authenticationService, _loggingService, _configuration);
    this.authenticationAction = AuthenticationProviderActions.SignInWithEmailLink;
    this._configure();
  }

  public onStatusClose() {
    this.changeAuthenticationAction.emit(AuthenticationProviderActions.SignUpWithEmailLink);
  }

  public ngOnInit(): void {
    this._processRequest(this._authenticationService.signInWithEmailLink(), (status: 'error' | 'success') => {
      if (status === 'success') {
        this._router.navigate([this.returnUrl]);
      }
    });
  }
}
