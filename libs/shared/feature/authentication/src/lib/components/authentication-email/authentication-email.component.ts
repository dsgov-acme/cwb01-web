import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import {
  NuverialButtonComponent,
  NuverialCardComponent,
  NuverialSpinnerComponent,
  NuverialTextInputComponent,
  NuverialValidationErrorType,
} from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { Observable, Subject, combineLatest, startWith } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { AuthenticationBaseDirective } from '../../common';
import { AuthenticationProviderActions, CLIENT_AUTHENTICATION, IClientAuthenticationConfiguration } from '../../models';
import { AuthenticationService } from '../../services/';
import { AuthenticationStatusComponent } from '../authentication-status';

const VALIDATE_API = (control: AbstractControl): ValidationErrors | null => {
  return control.errors && 'apiError' in control.errors ? { firebase: 'error' } : null;
};

const DEFAULT_PASSWORD_MIN_LENGTH = 6;

export type ProcessingStatusType = 'active' | 'complete' | 'loading';
export type SubmitStatusType = 'invalid' | 'loading' | 'valid';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatProgressSpinnerModule,
    NuverialButtonComponent,
    NuverialCardComponent,
    NuverialSpinnerComponent,
    NuverialTextInputComponent,
    AuthenticationStatusComponent,
  ],
  selector: 'dsg-authentication-email',
  standalone: true,
  styleUrls: ['./authentication-email.component.scss'],
  templateUrl: './authentication-email.component.html',
})
export class AuthenticationEmailComponent extends AuthenticationBaseDirective implements OnInit {
  /**
   * Set AuthenticationAction
   */
  @Input() public override set authenticationAction(action: AuthenticationProviderActions) {
    this._authenticationAction = action;
    this.passwordActive = action !== AuthenticationProviderActions.SignUpWithEmailLink;
    this._configure();
  }
  public override get authenticationAction(): AuthenticationProviderActions {
    return this._authenticationAction;
  }
  /**
   * Set return URL
   */
  @Input() public returnUrl: string | null = null;
  /**
   * Set Forgot provider
   */
  @Input() public displayReset = false;
  /**
   * Set Signup Action
   */
  @Input() public authenticationActionSignIn!: AuthenticationProviderActions;

  public get emailAddress(): FormControl {
    return this.formGroup?.controls['emailAddress'] as FormControl;
  }
  public get password(): FormControl {
    return this.formGroup?.controls['password'] as FormControl;
  }

  public emailValidationMessages!: NuverialValidationErrorType;
  public passwordValidationMessages!: NuverialValidationErrorType;
  public submitStatus$!: Observable<{ status: SubmitStatusType }>;
  public formGroup!: FormGroup;
  public passwordActive = false;
  public passwordVisible = false;
  public displayInput = true;

  public processingStatus: ProcessingStatusType = 'loading';

  private readonly _submitStatus: Subject<SubmitStatusType> = new Subject<SubmitStatusType>();

  constructor(
    protected readonly _changeDetectorRef: ChangeDetectorRef,
    protected readonly _router: Router,
    protected override readonly _authenticationService: AuthenticationService,
    @Optional() @Inject(CLIENT_AUTHENTICATION) protected override readonly _configuration: IClientAuthenticationConfiguration,
    protected override readonly _loggingService: LoggingService,
  ) {
    super(_authenticationService, _loggingService, _configuration);
  }

  public ngOnInit() {
    this.formGroup = new FormGroup({
      emailAddress: new FormControl(null, [Validators.email, VALIDATE_API]),
    });

    this.emailValidationMessages = {
      email: this.language?.emailAddressValidationInvalid || '',
      required: this.language?.emailAddressValidationRequired || '',
    };

    if (this.passwordActive && !this.password) {
      this.formGroup.addControl('password', new FormControl(null, [Validators.min(this._configuration?.passwordMinLength || DEFAULT_PASSWORD_MIN_LENGTH)]));
      this.passwordValidationMessages = { min: this.language?.passwordValidationMin || '', required: this.language?.passwordValidationRequired || '' };
    }

    this.submitStatus$ = combineLatest([this.formGroup.statusChanges.pipe(startWith(null)), this._submitStatus.pipe(startWith(null))]).pipe(
      map(([formStatus, submitStatus]) => {
        let status: SubmitStatusType = 'invalid';
        if (formStatus && formStatus != 'INVALID') {
          status = submitStatus ? 'loading' : 'valid';
        }

        return { status };
      }),
      share(),
    );
  }

  public onStatusClose() {
    this.processingStatus = 'active';
  }

  public onProviderUpdate(type: 'reset' | 'link') {
    this.changeAuthenticationAction.emit(type === 'reset' ? AuthenticationProviderActions.PasswordResetEmail : this.authenticationActionSignIn);
  }

  public handleEnterKey() {
    if (this.formGroup.valid) {
      this.onSubmitClick();
    }
  }

  public onSubmitClick(): void {
    this._submitStatus.next('loading');
    switch (this._authenticationAction) {
      case AuthenticationProviderActions.SignInWithEmailAndPassword:
        this._processRequest(
          this._authenticationService.signInWithEmailAndPassword(this.emailAddress.value, this.password.value),
          (status: 'error' | 'success', _data: unknown) => {
            this.processingStatus = 'complete';
            if (status === 'success' && this.returnUrl) {
              const returnUrl = new URL(this.returnUrl, window.location.origin);
              this._router.navigate([returnUrl.pathname], {
                queryParams: Object.fromEntries(returnUrl.searchParams.entries()),
              });
            }
            this._changeDetectorRef.detectChanges();
          },
        );
        break;

      case AuthenticationProviderActions.SignUpWithEmailAndPassword:
        this._processRequest(
          this._authenticationService.createUserWithEmailAndPassword(this.emailAddress.value, this.password.value),
          (status: 'error' | 'success', _data: unknown) => {
            this.processingStatus = 'complete';
            if (status === 'success') {
              this._router.navigate(['/main/profile']);
            }
            this._changeDetectorRef.detectChanges();
          },
        );
        break;

      case AuthenticationProviderActions.SignUpWithEmailLink:
        this._processRequest(this._authenticationService.signUpWithEmailLink(this.emailAddress.value), (status: 'error' | 'success', _data: unknown) => {
          this.processingStatus = 'complete';
          if (status === 'success') {
            this._submitStatus.next('valid');
          }
          this._changeDetectorRef.detectChanges();
        });
        break;
    }
  }

  protected override _configure() {
    super._configure();

    if (this.formGroup && this.passwordActive && !this.password) {
      this.formGroup.addControl(
        'password',
        new FormControl(null, [Validators.min(this._configuration?.passwordMinLength ? this._configuration.passwordMinLength : DEFAULT_PASSWORD_MIN_LENGTH)]),
      );
      this.passwordValidationMessages = { min: this.language?.passwordValidationMin || '', required: this.language?.passwordValidationRequired || '' };
    }

    if (this.password) {
      this.password.reset(null, { onlySelf: true });
      this.password.setErrors(null);
    }
    this.processingStatus = 'active';
  }
}
