import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialIconComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../base';
import { AttributeBaseProperties } from '../../base/formio/formio-attribute-base.model';

export interface ListAttributeProps extends AttributeBaseProperties {
  concatenatedContentType: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialIconComponent],
  selector: 'dsg-formio-list',
  standalone: true,
  styleUrls: ['./formio-list.component.scss'],
  templateUrl: './formio-list.component.html',
})
export class FormioListComponent extends FormioBaseCustomComponent<string, ListAttributeProps> {}
