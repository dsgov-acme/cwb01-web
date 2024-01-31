import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialAccordionComponent, NuverialFileUploadComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../../../base';
import { FileUploadFieldProperties } from '../../models/formly-file-upload.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialFileUploadComponent, NuverialAccordionComponent],
  selector: 'dsg-formio-file-upload',
  standalone: true,
  styleUrls: ['../../templates/formio-file-upload.component.scss'],
  templateUrl: '../../templates/formio-file-upload.component.html',
})
export class FormioFileUploadComponent extends FormioBaseCustomComponent<string, FileUploadFieldProperties> {
  // Keeping this multiple check in case we need togglable file upload in one component in the future
  public get fullWidth(): boolean {
    const multipleComponents = (this.components?.length ?? 0) > 1;

    return !!this.props.multiple || multipleComponents;
  }

  public get multiple() {
    return this.props.multiple ?? false;
  }
}
