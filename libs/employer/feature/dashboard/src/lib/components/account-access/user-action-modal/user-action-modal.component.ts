import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EnumMapType } from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService } from '@dsg/shared/feature/app-state';
import {
  INuverialSelectOption,
  NuverialButtonComponent,
  NuverialIconComponent,
  NuverialSelectComponent,
  NuverialTextInputComponent,
  NuverialValidationErrorType,
} from '@dsg/shared/ui/nuverial';
import { Observable, map } from 'rxjs';
import { UserListColumn } from '../user-list/user-list.component';

export enum UserActionModalModes {
  invite = 'invite',
  edit = 'edit',
}
export interface UserActionModalData {
  mode: UserActionModalModes;
  user?: UserListColumn;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatDialogModule,
    NuverialTextInputComponent,
    NuverialSelectComponent,
    NuverialButtonComponent,
    ReactiveFormsModule,
    NuverialIconComponent,
  ],
  selector: 'dsg-user-action-modal',
  standalone: true,
  styleUrls: ['./user-action-modal.component.scss'],
  templateUrl: './user-action-modal.component.html',
})
export class UserActionModalComponent {
  public formGroup: FormGroup;
  public emailValidationMessages: NuverialValidationErrorType = {
    email: 'Invalid email address',
    required: 'Email address is required',
  };
  public roleValidationMessages: NuverialValidationErrorType = {
    required: 'Role is required',
  };

  public roles$: Observable<INuverialSelectOption[]> = this._enumService.getEnumMap$(EnumMapType.ProfileAccessLevels).pipe(
    map(accessLevels => {
      return Array.from(accessLevels, ([key, value]) => ({
        disabled: false,
        displayTextValue: value.label,
        key: key,
        selected: false,
      }));
    }),
  );

  public dialogMode: UserActionModalModes;
  public userActionModalModes = UserActionModalModes;
  public user?: UserListColumn;
  public get submitText(): string {
    return this.dialogMode === UserActionModalModes.invite ? 'SEND INVITE' : 'SAVE';
  }
  public get dialogLabel(): string {
    return this.dialogMode === UserActionModalModes.invite ? 'Invite User' : 'Edit User';
  }

  constructor(
    public dialog: MatDialogRef<UserActionModalComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly _data: UserActionModalData,
    private readonly _enumService: EnumerationsStateService,
  ) {
    this.formGroup = new FormGroup({
      emailAddress: new FormControl(this._data.user?.email, [Validators.email, Validators.required]),
      role: new FormControl(this._data.user?.profileAccessLevel, [Validators.required]),
    });
    this.dialogMode = this._data.mode;
    this.user = this._data.user;
  }

  public submit() {
    if (this.formGroup.valid) {
      this.dialog.close(this.formGroup.value);

      return;
    }
    this.formGroup.updateValueAndValidity();
  }
}
