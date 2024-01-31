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
export class FormiomultipleFileUploadComponent extends FormioBaseCustomComponent<string, FileUploadFieldProperties> {
  public fullWidth = true;
  public multiple = true;
}
