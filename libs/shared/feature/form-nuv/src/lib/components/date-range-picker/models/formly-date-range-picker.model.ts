import { DateFilterFn } from '@angular/material/datepicker';
import { BaseFormlyFieldProperties } from '../../base';

export interface DateRangePickerFieldProperties extends BaseFormlyFieldProperties {
  dateFilter?: DateFilterFn<Date>;
  disabled?: boolean;
  displayError?: boolean;
  endDatePlaceholder?: string;
  label?: string;
  maxDate?: Date;
  minDate?: Date;
  opened?: boolean;
  startAt?: Date;
  startDatePlaceholder?: string;
  startView?: 'month' | 'year' | 'multi-year';
}
