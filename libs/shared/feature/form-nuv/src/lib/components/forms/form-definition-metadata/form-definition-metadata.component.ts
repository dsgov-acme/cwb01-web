import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IForm, IFormMetaData, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import {
  AlphaNumericValidator,
  MarkAllControlsAsTouched,
  NuverialButtonComponent,
  NuverialSnackBarService,
  NuverialTextAreaComponent,
  NuverialTextInputComponent,
  NuverialTrimInputDirective,
} from '@dsg/shared/ui/nuverial';
import { catchError, EMPTY, finalize, Observable, take, tap } from 'rxjs';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatDialogModule,
    NuverialTextInputComponent,
    NuverialButtonComponent,
    NuverialTextAreaComponent,
    ReactiveFormsModule,
    NuverialTrimInputDirective,
  ],
  selector: 'dsg-form-definition-metadata-component',
  standalone: true,
  styleUrls: ['./form-definition-metadata.component.scss'],
  templateUrl: './form-definition-metadata.component.html',
})
export class FormDefinitionMetaDataComponent {
  @Input() public metaData?: IFormMetaData;

  public formGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: IFormMetaData,
    public dialogRef: MatDialogRef<FormDefinitionMetaDataComponent>,
    private readonly _workApiRoutesService: WorkApiRoutesService,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _cdr: ChangeDetectorRef,
  ) {
    if (dialogData) {
      this.metaData = dialogData;
    }
    const keyFormControl = new FormControl(this.metaData?.key, [Validators.maxLength(200), Validators.required, AlphaNumericValidator()]);
    if (this.metaData?.mode === 'Update') {
      keyFormControl.disable();
    }
    this.formGroup = new FormGroup({
      createdBy: new FormControl(this.metaData?.createdBy),
      description: new FormControl(this.metaData?.description, [Validators.maxLength(200)]),
      key: keyFormControl,
      lastUpdatedBy: new FormControl(this.metaData?.lastUpdatedBy),
      name: new FormControl(this.metaData?.name, [Validators.maxLength(200), Validators.required]),
      schemaKey: new FormControl(this.metaData?.schemaKey, Validators.required),
    });
  }

  public loading = false;

  public onSave() {
    if (!this.formGroup.valid) {
      MarkAllControlsAsTouched(this.formGroup);

      return;
    }

    this.metaData = {
      createdBy: this.formGroup.value.createdBy,
      description: this.formGroup.value.description,
      key: this.metaData?.mode === 'Create' ? this.formGroup.value.key : this.metaData?.key,
      lastUpdatedBy: this.formGroup.value.lastUpdatedBy,
      mode: this.metaData?.mode,
      name: this.formGroup.value.name,
      schemaKey: this.formGroup.value.schemaKey,
      transactionDefinitionKey: this.metaData?.transactionDefinitionKey || '',
    };

    if (this.metaData?.mode === 'Create') {
      this.loading = true;
      this._createFormConfig(this.metaData)
        .pipe(
          take(1),
          tap(_response => {
            this._nuverialSnackBarService.notifyApplicationSuccess();
            this.dialogRef.close({ metaData: _response, save: false });

            return EMPTY;
          }),
          catchError(_error => {
            if (_error.status === 409 && _error?.error?.messages?.[0]?.includes('already exists')) {
              this.formGroup.controls['key'].setErrors({ keyExists: true });
              MarkAllControlsAsTouched(this.formGroup);
            } else {
              this._nuverialSnackBarService.notifyApplicationError();
            }

            return EMPTY;
          }),
          finalize(() => {
            this.loading = false;
            this._cdr.detectChanges();
          }),
        )
        .subscribe();
    } else {
      this.dialogRef.close({ metaData: this.metaData, save: true });
    }
  }

  private _createFormConfig(metaData: IFormMetaData): Observable<IForm> {
    const formConfiguration: Partial<IForm> = {
      configuration: {
        components: [],
      },
      configurationSchema: 'formio',
      description: metaData.description,
      key: metaData.key,
      name: metaData.name,
      schemaKey: metaData.schemaKey,
      transactionDefinitionKey: metaData.transactionDefinitionKey,
    };

    return this._workApiRoutesService.createFormConfiguration$(formConfiguration, metaData.transactionDefinitionKey);
  }
}
