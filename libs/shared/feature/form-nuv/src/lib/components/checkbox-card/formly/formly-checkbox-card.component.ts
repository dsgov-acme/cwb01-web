import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialCardContentDirective, NuverialCheckboxCardComponent } from '@dsg/shared/ui/nuverial';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBaseComponent } from '../../base';
import { CheckboxCardFieldProperties } from '../models/formly-checkbox-card.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormlyModule, NuverialCheckboxCardComponent, NuverialCardContentDirective],
  selector: 'dsg-formly-checkbox-card',
  standalone: true,
  styleUrls: ['./formly-checkbox-card.component.scss'],
  templateUrl: './formly-checkbox-card.component.html',
})
export class FormlyCheckboxCardComponent extends FormlyBaseComponent<CheckboxCardFieldProperties> {}
