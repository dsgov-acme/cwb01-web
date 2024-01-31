import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { NuverialAccordionComponent, NuverialFileUploadComponent, NuverialSectionHeaderComponent } from '@dsg/shared/ui/nuverial';
import { FormlyExtension, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyBaseComponent, defaultPrePopulateAdvancedComponent, isPrePopulated } from '../../../../base';
import { FileUploadFieldProperties } from '../../models/formly-file-upload.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormlyModule, NuverialFileUploadComponent, NuverialAccordionComponent, NuverialSectionHeaderComponent],
  selector: 'dsg-formly-multiple-file-upload',
  standalone: true,
  styleUrls: ['../../templates/formly-file-upload.component.scss'],
  templateUrl: '../../templates/formly-file-upload.component.html',
})
export class FormlyMultipleFileUploadComponent extends FormlyBaseComponent<FileUploadFieldProperties> implements FormlyExtension {
  public fullWidth = true;

  public prePopulate(field: FormlyFieldConfig<FileUploadFieldProperties>): void {
    if (isPrePopulated(field)) return;

    defaultPrePopulateAdvancedComponent(field);

    const fieldGroup = field.fieldGroup?.map(_field => {
      return {
        ..._field,
        className: 'flex-full',
        props: { ..._field.props, multiple: true },
        type: 'nuverialFileUploader',
      };
    });

    field.fieldGroup = fieldGroup;

    if (field.props) {
      field.props.multiple = true;
    }
  }

  public get formControls(): Array<AbstractControl | null> {
    const controlsArray: Array<AbstractControl | null> = [];
    this.field.fieldGroup?.forEach(field => {
      if (field.key) {
        controlsArray.push(this.formControl.get(field.key.toString()));
      }
    });

    return controlsArray;
  }

  public trackByFn(index: number) {
    return index;
  }
}
