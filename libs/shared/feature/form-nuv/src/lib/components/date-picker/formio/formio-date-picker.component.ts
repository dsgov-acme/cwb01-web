import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialCardContentDirective, NuverialDatePickerComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../base';
import { DatePickerFieldProperties } from '../models/formly-date-picker.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialDatePickerComponent, NuverialCardContentDirective],
  selector: 'dsg-formio-date-picker',
  standalone: true,
  styleUrls: ['./formio-date-picker.component.scss'],
  templateUrl: './formio-date-picker.component.html',
})
export class FormioDatePickerComponent extends FormioBaseCustomComponent<string, DatePickerFieldProperties> {}
