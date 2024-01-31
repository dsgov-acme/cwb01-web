import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NuverialSectionHeaderComponent, NuverialSelectComponent, NuverialTextInputComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../../base';
import { FormlyAddressFieldProperties } from '../formly/formly-address.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, NuverialSectionHeaderComponent, NuverialTextInputComponent, NuverialSelectComponent],
  selector: 'dsg-formio-address',
  standalone: true,
  styleUrls: ['./formio-address.component.scss'],
  templateUrl: './formio-address.component.html',
})
export class FormioAddressComponent extends FormioBaseCustomComponent<string, FormlyAddressFieldProperties> {
  public model: Record<string, string> = {};
}
