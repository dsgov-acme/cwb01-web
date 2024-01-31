import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedUtilsLoggingModule } from '@dsg/shared/utils/logging';
import { action } from '@storybook/addon-actions';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { NuverialTextInputComponent } from './text-input.component';

export default {
  argTypes: {
    validationErrors: {
      action: 'change',
      defaultValue: '',
      description: 'Text input validation error events',
    },
  },
  component: NuverialTextInputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        SharedUtilsLoggingModule.useConsoleLoggingAdapter(),
      ],
    }),
    componentWrapperDecorator(story => `<div style="margin: 0 auto;">${story}</div>`),
  ],
  title: 'DSG/Nuverial/Components/TextInput',
} as Meta<NuverialTextInputComponent>;

const Template: Story<NuverialTextInputComponent> = (args: NuverialTextInputComponent) => {
  const formControl = new FormControl({ disabled: false, value: null }, [Validators.email]);

  return {
    props: {
      ...args,
      formControl,
      onValidationErrors: (event: unknown) => {
        return action('change')(event);
      },
    },
    template: `
        <nuverial-text-input
            ariaLabel="${args.ariaLabel}"
            [disabled]="${args.disabled}"
            hint="${args.hint}"
            label="${args.label}"
            maxlength="${args.maxlength}"
            placeholder="${args.placeholder}"
            prefixIcon="${args.prefixIcon}"
            suffixIcon="${args.suffixIcon}"
            tooltip="${args.tooltip}"
            type="${args.type}"
            [formControl]="formControl"
            (validationErrors)="onValidationErrors($event)">
        </nuverial-text-input>`,
  };
};

export const TextInput = Template.bind({});
TextInput.args = {
  ariaLabel: '',
  disabled: false,
  hint: '',
  label: 'Email address',
  maxlength: undefined,
  placeholder: 'Enter email address',
  prefixIcon: '',
  required: false,
  suffixIcon: '',
  tooltip: '',
  type: 'text',
};
