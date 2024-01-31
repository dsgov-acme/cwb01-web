import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { UserModel } from '@dsg/shared/data-access/user-api';
import {
  CardChange,
  FormErrorsFromGroup,
  IFormError,
  MarkAllControlsAsTouched,
  NuverialButtonComponent,
  NuverialCardGroupComponent,
  NuverialCheckboxComponent,
  NuverialFormErrorsComponent,
  NuverialRadioCardComponent,
  NuverialSectionHeaderComponent,
  NuverialSnackbarComponent,
  NuverialSnackBarService,
  NuverialTextInputComponent,
} from '@dsg/shared/ui/nuverial';
import { untilDestroyed } from '@ngneat/until-destroy';
import { catchError, EMPTY, Observable, take, tap } from 'rxjs';
import { EmployerFeatureProfileService } from '../../employer-feature-profile.service';

type FormFields = 'communicationMethod' | 'email' | 'firstName' | 'lastName' | 'phoneNumber' | 'smsAgreement';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NuverialTextInputComponent,
    NuverialButtonComponent,
    NuverialCheckboxComponent,
    NuverialSnackbarComponent,
    NuverialRadioCardComponent,
    NuverialSectionHeaderComponent,
    NuverialCardGroupComponent,
    NuverialFormErrorsComponent,
  ],
  providers: [
    {
      provide: MatSnackBarRef,
      useValue: {},
    },
    {
      provide: MAT_SNACK_BAR_DATA,
      useValue: {},
    },
  ],
  selector: 'dsg-profile',
  standalone: true,
  styleUrls: ['./profile.component.scss'],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  public formErrors: IFormError[] = [];

  public formConfigs: Record<FormFields, { id: string; label: string }> = {
    communicationMethod: {
      id: 'profile-communicationMethod',
      label: 'Preferred Communication Method',
    },
    email: {
      id: 'profile-email',
      label: 'Email',
    },
    firstName: {
      id: 'profile-firstName',
      label: 'First Name',
    },
    lastName: {
      id: 'profile-lastName',
      label: 'Last Name',
    },
    phoneNumber: {
      id: 'profile-phoneNumber',
      label: 'Phone Number',
    },
    smsAgreement: {
      id: 'profile-smsAgreement',
      label: 'SMS Agreement',
    },
  };

  constructor(
    private readonly _profileService: EmployerFeatureProfileService,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _router: Router,
  ) {}

  public requiredCommunicationMsg = { required: 'Please select a communication method' };
  public communicationMethodOptions = [
    { label: 'Text (SMS)', value: 'sms' },
    { label: 'Email', value: 'email' },
  ];

  public userModel: UserModel = new UserModel();
  public profile$: Observable<UserModel | null> = this._profileService.getProfile$().pipe(
    tap(profile => {
      if (!profile) return;

      this.userModel = profile;

      this.inputTextFormGroup = new FormGroup({
        //Order disabled to match the order of the form in the form errors component
        /* eslint-disable sort-keys */
        firstName: new FormControl({ disabled: false, value: this.userModel.firstName }, [Validators.maxLength(26), Validators.min(10), Validators.required]),
        middleName: new FormControl({ disabled: false, value: this.userModel.middleName }, [Validators.maxLength(26)]),
        lastName: new FormControl({ disabled: false, value: this.userModel.lastName }, [Validators.maxLength(26), Validators.required]),
        email: new FormControl({ disabled: true, value: this.userModel.email }, [Validators.email]),
        phoneNumber: new FormControl({ disabled: false, value: this.userModel.phoneNumber }, [Validators.required]),
        communicationMethod: new FormControl({ disabled: false, value: this.userModel.preferences?.preferredCommunicationMethod }, [Validators.required]),
        smsAgreement: new FormControl(
          {
            disabled: this.userModel.preferences?.preferredCommunicationMethod !== 'sms',
            value: this.userModel.preferences?.preferredCommunicationMethod === 'sms',
          },
          [Validators.requiredTrue],
        ),
        /* eslint-enable sort-keys */
      });
    }),
  );

  public inputTextFormGroup: FormGroup | undefined;

  public saveProfile() {
    this.formErrors = [];

    if (this.inputTextFormGroup?.invalid) {
      this.formErrors = FormErrorsFromGroup(this.inputTextFormGroup, this.formConfigs);
      MarkAllControlsAsTouched(this.inputTextFormGroup);

      return;
    }

    this.userModel.firstName = this.inputTextFormGroup?.value.firstName;
    this.userModel.middleName = this.inputTextFormGroup?.value.middleName;
    this.userModel.lastName = this.inputTextFormGroup?.value.lastName;
    this.userModel.phoneNumber = this.inputTextFormGroup?.value.phoneNumber;
    this.userModel.preferences.preferredCommunicationMethod = this.inputTextFormGroup?.value.communicationMethod;

    this._profileService
      .createUpdateProfile$(this.userModel)
      .pipe(
        take(1),
        tap(_ => {
          this._goToDashboard();
        }),
        catchError(
          _error =>
            this._nuverialSnackBarService
              .openConfigured({
                dismissible: false,
                duration: 5000,
                message: 'Unable to save profile information - Skip for now to continue.',
                nuverialActions: [
                  {
                    ariaLabel: 'snackbar-skip-for-now',
                    buttonStyle: 'outlined',
                    colorTheme: 'primary',
                    context: 'skipForNow',
                    label: 'Skip for Now',
                  },
                ],
                title: 'Error',
                type: 'error',
              })
              .action()
              .pipe(
                tap(() => {
                  this._goToDashboard();
                }),
                untilDestroyed(this),
              )
              .subscribe() && EMPTY,
        ),
      )
      .subscribe();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public communicationMethodChange($event: CardChange) {
    const agreementControl = this.inputTextFormGroup?.get('smsAgreement');

    if ($event.value === 'sms') {
      agreementControl?.enable();

      return;
    }
    agreementControl?.disable();
  }

  private _goToDashboard() {
    this._router.navigate(['/dashboard']);
  }
}
