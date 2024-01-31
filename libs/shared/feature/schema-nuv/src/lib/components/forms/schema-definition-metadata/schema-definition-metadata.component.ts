import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ISchemaMetaData } from '@dsg/shared/data-access/work-api';
import {
  MarkAllControlsAsTouched,
  NuverialButtonComponent,
  NuverialTextAreaComponent,
  NuverialTextInputComponent,
  NuverialTrimInputDirective,
} from '@dsg/shared/ui/nuverial';
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
  selector: 'dsg-schema-definition-metadata-component',
  standalone: true,
  styleUrls: ['./schema-definition-metadata.component.scss'],
  templateUrl: './schema-definition-metadata.component.html',
})
export class SchemaDefinitionMetaDataComponent {
  @Input() public metaData?: ISchemaMetaData;

  public formGroup: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: ISchemaMetaData, public dialogRef: MatDialogRef<SchemaDefinitionMetaDataComponent>) {
    if (dialogData) {
      this.metaData = dialogData;
    }

    const schemaKeyFormControl = new FormControl(this.metaData?.key, [Validators.maxLength(200), Validators.required]);
    schemaKeyFormControl.disable();

    this.formGroup = new FormGroup({
      createdBy: new FormControl(this.metaData?.createdBy),
      description: new FormControl(this.metaData?.description, [Validators.maxLength(200)]),
      key: schemaKeyFormControl,
      lastUpdatedBy: new FormControl(this.metaData?.lastUpdatedBy),
      name: new FormControl(this.metaData?.name, [Validators.maxLength(200), Validators.required]),
    });
  }
  public loading = false;
  public onSave() {
    MarkAllControlsAsTouched(this.formGroup);
    if (this.formGroup.valid) {
      this.metaData = {
        createdBy: this.formGroup.value.createdBy,
        description: this.formGroup.value.description,
        key: this.metaData?.key || '',
        lastUpdatedBy: this.formGroup.value.lastUpdatedBy,
        name: this.formGroup.value.name,
        status: this.metaData?.status || '',
      };
      this.loading = true;
      this.dialogRef.close({ metaData: this.metaData, save: true });
    }
  }
}
