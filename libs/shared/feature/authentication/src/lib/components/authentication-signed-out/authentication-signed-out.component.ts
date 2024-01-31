import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NuverialCardComponent } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { AuthenticationProviderActions, CLIENT_AUTHENTICATION, IClientAuthenticationConfiguration } from '../../models';
import { AuthenticationService } from '../../services';

import { AuthenticationBaseDirective } from '../../common';
import { AuthenticationStatusComponent } from '../authentication-status';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, AuthenticationStatusComponent, NuverialCardComponent],
  selector: 'dsg-authentication-signed-out',
  standalone: true,
  styleUrls: ['./authentication-signed-out.component.scss'],
  templateUrl: './authentication-signed-out.component.html',
})
export class AuthenticationSignedOutComponent extends AuthenticationBaseDirective implements OnInit {
  /**
   * Set return URL
   */
  @Input() public returnUrl: string | null = null;

  /**
   * Set Signup Action
   */
  @Input() public authenticationActionSignIn!: AuthenticationProviderActions;

  constructor(
    protected readonly _router: Router,
    protected override readonly _authenticationService: AuthenticationService,
    protected override _loggingService: LoggingService,
    @Optional() @Inject(CLIENT_AUTHENTICATION) protected override readonly _configuration: IClientAuthenticationConfiguration,
  ) {
    super(_authenticationService, _loggingService, _configuration);
    this.authenticationAction = AuthenticationProviderActions.SignOut;
    this._configure();
  }

  public ngOnInit() {
    this._processingStatus.next({
      authenticationProvider: null,
      linkText: null,
      message: this.language.statusSuccessMessage || '',
      subTitle: this.language.statusSuccessSubText || '',
      title: this.language.statusSuccessHeaderText || '',
    });
  }

  public onProviderUpdate() {
    this.changeAuthenticationAction.emit(this.authenticationActionSignIn);
    if (this.returnUrl) {
      this._router.navigate([this.returnUrl]);
    }
  }
}
