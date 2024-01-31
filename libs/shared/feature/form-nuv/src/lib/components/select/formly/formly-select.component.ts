import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialSelectComponent } from '@dsg/shared/ui/nuverial';
import { FormlyModule } from '@ngx-formly/core';

import { FormlyBaseComponent } from '../../base';
import { SelectFieldProperties } from '../models/formly-select.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormlyModule, NuverialSelectComponent],
  selector: 'dsg-formly-select',
  standalone: true,
  styleUrls: ['./formly-select.component.scss'],
  templateUrl: './formly-select.component.html',
})
export class FormlySelectComponent extends FormlyBaseComponent<SelectFieldProperties> {
  public get displayTextValue(): string | undefined {
    return this.props.selectOptions?.find(opt => opt.key === this.formControl.value)?.displayTextValue;
  }
}
