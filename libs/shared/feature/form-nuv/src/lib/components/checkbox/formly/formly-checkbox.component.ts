import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialCheckboxComponent } from '@dsg/shared/ui/nuverial';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBaseComponent } from '../../base';
import { CheckboxFieldProperties } from '../models/formly-checkbox.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormlyModule, NuverialCheckboxComponent],
  selector: 'dsg-formly-checkbox',
  standalone: true,
  styleUrls: ['./formly-checkbox.component.scss'],
  templateUrl: './formly-checkbox.component.html',
})
export class FormlyCheckboxComponent extends FormlyBaseComponent<CheckboxFieldProperties> {}
