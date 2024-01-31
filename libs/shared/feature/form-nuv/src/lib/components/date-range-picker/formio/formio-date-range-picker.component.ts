import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialCardContentDirective, NuverialDateRangePickerComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../base';
import { DateRangePickerFieldProperties } from '../models/formly-date-range-picker.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialDateRangePickerComponent, NuverialCardContentDirective],
  selector: 'dsg-formio-date-range-picker',
  standalone: true,
  styleUrls: ['./formio-date-range-picker.component.scss'],
  templateUrl: './formio-date-range-picker.component.html',
})
export class FormioDateRangePickerComponent extends FormioBaseCustomComponent<string, DateRangePickerFieldProperties> {}
