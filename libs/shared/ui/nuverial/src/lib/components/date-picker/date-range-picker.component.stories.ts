import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { Meta, Story, componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import { DateRangePickerControl } from './date-picker.models';
import { NuverialDateRangePickerComponent } from './date-range-picker.component';

export default {
  argTypes: {
    change: {
      action: 'change',
      defaultValue: '',
      description: 'Date Range Picker event',
    },
  },
  component: NuverialDateRangePickerComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, FormsModule, ReactiveFormsModule, MatNativeDateModule],
    }),
    componentWrapperDecorator(story => `<div style="display: flex; justify-content: center;">${story}</div>`),
  ],
  parameters: {
    actions: { change: { action: 'change' } },
  },
  title: 'DSG/Nuverial/Components/DateRangePicker',
} as Meta<NuverialDateRangePickerComponent>;

const DateRangePickerTemplate: Story<NuverialDateRangePickerComponent> = args => {
  const formControl = new FormControl<DateRangePickerControl>({ endDate: null, startDate: null });

  return {
    props: {
      ...args,
      formControl,
      onValidationErrors: (event: unknown) => action('change')(event),
    },
    template: `
      <nuverial-date-range-picker
        ariaDescribedBy="${args.ariaDescribedBy}"
        ariaLabel="${args.ariaLabel}"
        [disabled]="${args.disabled}"
        [displayError]="${args.displayError}"
        endDatePlaceholder="${args.endDatePlaceholder}"
        [formControl]="formControl"
        hint="${args.hint}"
        label="${args.label}"
        maxDate="${args.maxDate}"
        minDate="${args.minDate}"
        [opened]="${args.opened}"
        separator="${args.separator}"
        startAt="${args.startAt}"
        startDatePlaceholder="${args.startDatePlaceholder}"
        startView="${args.startView}"
        (validationErrors)="onValidationErrors($event)">
      </nuverial-date-range-picker>`,
  };
};

export const DateRangePicker = DateRangePickerTemplate.bind({});
DateRangePicker.args = {
  ariaDescribedBy: '',
  ariaLabel: '',
  disabled: false,
  displayError: true,
  endDatePlaceholder: 'End date',
  hint: '',
  label: 'Enter date range',
  maxDate: undefined,
  minDate: undefined,
  required: false,
  separator: '–',
  startAt: undefined,
  startDatePlaceholder: 'Start date',
  startView: 'year',
};
