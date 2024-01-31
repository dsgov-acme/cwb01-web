import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialCheckboxComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../base';
import { CheckboxFieldProperties } from '../models/formly-checkbox.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialCheckboxComponent],
  selector: 'dsg-formio-checkbox',
  standalone: true,
  styleUrls: ['./formio-checkbox.component.scss'],
  templateUrl: './formio-checkbox.component.html',
})
export class FormioCheckboxComponent extends FormioBaseCustomComponent<string, CheckboxFieldProperties> {}
