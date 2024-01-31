import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedUtilsLoggingModule } from '@dsg/shared/utils/logging';
import { action } from '@storybook/addon-actions';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { NuverialTextAreaComponent } from './text-area.component';

export default {
  argTypes: {
    validationErrors: {
      action: 'change',
      defaultValue: '',
      description: 'Text input validation error events',
    },
  },
  component: NuverialTextAreaComponent,
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
  title: 'DSG/Nuverial/Components/TextArea',
} as Meta<NuverialTextAreaComponent>;

const Template: Story<NuverialTextAreaComponent> = (args: NuverialTextAreaComponent) => {
  const formControl = new FormControl({ disabled: false, value: null }, args.required ? [Validators.required] : []);

  return {
    props: {
      ...args,
      formControl,
      onValidationErrors: (event: unknown) => {
        return action('change')(event);
      },
    },
    template: `
        <nuverial-text-area
            ariaLabel="${args.ariaLabel}"
            [disabled]="${args.disabled}"
            [required]="${args.required}"
            hint="${args.hint}"
            maxlength="${args.maxlength}"
            placeholder="${args.placeholder}"
            autoSize="${args.autoSize}"
            autoSizeMinRows="${args.autoSizeMinRows}"
            autoSizeMaxRows="${args.autoSizeMaxRows}"
            [formControl]="formControl"
            (validationErrors)="onValidationErrors($event)">
        </nuverial-text-area>`,
  };
};

export const TextArea = Template.bind({});
TextArea.args = {
  ariaLabel: '',
  disabled: false,
  hint: '',
  maxlength: undefined,
  placeholder: 'Enter your description',
  required: false,
};
