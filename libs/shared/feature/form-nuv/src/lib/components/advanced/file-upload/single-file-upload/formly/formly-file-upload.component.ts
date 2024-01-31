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
  selector: 'dsg-formly-file-upload',
  standalone: true,
  styleUrls: ['../../templates/formly-file-upload.component.scss'],
  templateUrl: '../../templates/formly-file-upload.component.html',
})
export class FormlyFileUploadComponent extends FormlyBaseComponent<FileUploadFieldProperties> implements FormlyExtension {
  public get fullWidth(): boolean {
    const multipleFields = (this.field.fieldGroup?.length ?? 0) > 1;

    return this.field.props?.multiple || multipleFields;
  }

  public prePopulate(field: FormlyFieldConfig<FileUploadFieldProperties>): void {
    if (isPrePopulated(field)) return;

    defaultPrePopulateAdvancedComponent(field);

    const multiple = !!field.props?.multiple;

    const fieldGroup = field.fieldGroup?.map(_field => {
      return {
        ..._field,
        className: multiple ? 'flex-full' : 'flex-half',
        props: { ..._field.props, multiple: multiple },
        type: 'nuverialFileUploader',
      };
    });

    field.fieldGroup = fieldGroup;
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
