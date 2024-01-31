import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { action } from '@storybook/addon-actions';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { NuverialDatePickerComponent } from './date-picker.component';

export default {
  argTypes: {
    change: {
      action: 'change',
      defaultValue: '',
      description: 'Date picker event',
    },
  },
  component: NuverialDatePickerComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, FormsModule, ReactiveFormsModule, MatNativeDateModule],
    }),
    componentWrapperDecorator(story => `<div style="display: flex; justify-content: center;">${story}</div>`),
  ],
  parameters: {
    actions: { change: { action: 'change' } },
  },
  title: 'DSG/Nuverial/Components/DatePicker',
} as Meta<NuverialDatePickerComponent>;

const DatePickerTemplate: Story<NuverialDatePickerComponent> = args => {
  const formControl = new FormControl();

  return {
    props: {
      ...args,
      formControl,
      onValidationErrors: (event: unknown) => action('change')(event),
    },
    template: `
      <nuverial-date-picker
        ariaDescribedBy="${args.ariaDescribedBy}"
        ariaLabel="${args.ariaLabel}"
        [disabled]="${args.disabled}"
        [displayError]="${args.displayError}"
        [formControl]="formControl"
        hint="${args.hint}"
        inputLabel="${args.inputLabel}"
        maxDate="${args.maxDate}"
        minDate="${args.minDate}"
        [opened]="${args.opened}"
        placeholder="${args.placeholder}"
        startAt="${args.startAt}"
        startView="${args.startView}"
        (validationErrors)="onValidationErrors($event)">
      </nuverial-date-picker>`,
  };
};

export const DatePicker = DatePickerTemplate.bind({});
DatePicker.args = {
  ariaDescribedBy: '',
  ariaLabel: '',
  disabled: false,
  displayError: true,
  hint: '',
  inputLabel: 'Enter Date',
  maxDate: undefined,
  minDate: undefined,
  opened: false,
  placeholder: 'Date',
  required: false,
  startAt: undefined,
  startView: 'year',
};
