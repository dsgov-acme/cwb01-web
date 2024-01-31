import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialCardContentDirective, NuverialCheckboxCardComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../base';
import { CheckboxCardFieldProperties } from '../models/formly-checkbox-card.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialCheckboxCardComponent, NuverialCardContentDirective],
  selector: 'dsg-formio-checkbox-card',
  standalone: true,
  styleUrls: ['./formio-checkbox-card.component.scss'],
  templateUrl: './formio-checkbox-card.component.html',
})
export class FormioCheckboxCardComponent extends FormioBaseCustomComponent<string, CheckboxCardFieldProperties> {}
