import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialTextAreaComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../base';
import { FormlyTextAreaFieldProperties } from '../formly/formly-text-area.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialTextAreaComponent],
  selector: 'dsg-formio-text-area',
  standalone: true,
  styleUrls: ['./formio-text-area.component.scss'],
  templateUrl: './formio-text-area.component.html',
})
export class FormioTextAreaComponent extends FormioBaseCustomComponent<string, FormlyTextAreaFieldProperties> {}
