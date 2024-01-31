import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialCardContentDirective, NuverialDateRangePickerComponent } from '@dsg/shared/ui/nuverial';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBaseComponent } from '../../base';
import { DateRangePickerFieldProperties } from '../models/formly-date-range-picker.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormlyModule, NuverialDateRangePickerComponent, NuverialCardContentDirective],
  selector: 'dsg-formly-date-range-picker',
  standalone: true,
  styleUrls: ['./formly-date-range-picker.component.scss'],
  templateUrl: './formly-date-range-picker.component.html',
})
export class FormlyDateRangePickerComponent extends FormlyBaseComponent<DateRangePickerFieldProperties> {}
