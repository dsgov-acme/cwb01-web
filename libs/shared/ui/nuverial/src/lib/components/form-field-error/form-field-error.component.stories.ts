import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { NuverialIconComponent } from '../icon';
import { NuverialFormFieldErrorComponent } from './form-field-error.component';

export default {
  component: NuverialFormFieldErrorComponent,
  decorators: [
    moduleMetadata({
      imports: [NuverialIconComponent],
    }),
  ],
  parameters: {},
  title: 'DSG/Nuverial/Components/FormFieldError',
} as Meta<NuverialFormFieldErrorComponent>;

const Template: Story<NuverialFormFieldErrorComponent> = args => {
  return {
    args,
    template: `<nuverial-form-field-error class="nuverial-form-field-icon-before"
       ><nuverial-icon iconName="error_outline"></nuverial-icon>Lorem Ipsum dolor sit amet consectetur adipiscing elit</nuverial-form-field-error>`,
  };
};

export const FormFieldError = Template.bind({});
FormFieldError.args = {};
