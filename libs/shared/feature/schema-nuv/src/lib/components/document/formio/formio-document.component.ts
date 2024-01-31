import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialIconComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../base';
import { AttributeBaseProperties } from '../../base/formio/formio-attribute-base.model';

export interface DocumentAttributeProps extends AttributeBaseProperties {
  processors: string[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialIconComponent],
  selector: 'dsg-formio-document',
  standalone: true,
  styleUrls: ['./formio-document.component.scss'],
  templateUrl: '../../base/formio/formio-attribute-base.component.html',
})
export class FormioDocumentComponent extends FormioBaseCustomComponent<string, DocumentAttributeProps> {}
