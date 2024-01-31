import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { SharedUtilsLoggingModule } from '@dsg/shared/utils/logging';
import { NuverialCardContentDirective } from '../../directives';
import { NuverialCheckboxCardComponent } from './index';

type StoryType = NuverialCheckboxCardComponent & { content?: string; displayImage?: boolean; title?: string };

export default {
  argTypes: {
    change: {
      action: 'change',
      defaultValue: '',
      description: 'Checkbox select event',
    },
    content: {
      control: 'text',
      defaultValue: '',
      description: 'HTML content for the card',
    },
    value: {
      control: 'text',
      defaultValue: '',
      description: 'The value attribute of the native input element',
    },
  },
  component: NuverialCheckboxCardComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, ReactiveFormsModule, NuverialCardContentDirective, SharedUtilsLoggingModule.useConsoleLoggingAdapter()],
    }),
    componentWrapperDecorator(story => `<div style="margin: 0 auto">${story}</div>`),
  ],
  parameters: {
    actions: { change: { action: 'change' } },
    componentSubtitle: 'Checkbox card component.',
  },
  title: 'DSG/Nuverial/Components/CheckboxCard',
} as Meta<NuverialCheckboxCardComponent>;

const Template: Story<StoryType> = args => {
  const formModel = { isValid: true };

  return {
    props: {
      ...args,
      formModel,
      onCardChange: (event: unknown) => {
        return action('change')(event);
      },
      onValidationErrors: (event: unknown) => {
        return action('change')(event);
      },
    },
    template: `
        <nuverial-checkbox-card
            [(ngModel)]="formModel.isValid"
            ariaDescribedBy="${args.ariaDescribedBy}"
            ariaLabel="${args.ariaLabel}"
            colorTheme="${args.colorTheme}"
            [disabled]="${args.disabled}"
            [displayError]="${args.displayError}"
            [indeterminate]="${args.indeterminate}"
            imagePosition="${args.imagePosition}"
            (change)="onCardChange($event)"
            (validationErrors)="onValidationErrors($event)">
            <div nuverialCardContentType="title">${args.title}</div>
            <div nuverialCardContentType="content">${args.content}</div>
            <img *ngIf="displayImage" nuverialCardContentType="image" src="assets/big-ben.webp" alt="big ben"/>
          </nuverial-checkbox-card>`,
  };
};

export const CheckboxCard = Template.bind({});
CheckboxCard.args = {
  ariaDescribedBy: '',
  ariaLabel: '',
  checked: false,
  colorTheme: 'primary',
  content: '<div>Lorem Ipsum dolor sit amet consectetur adipiscing elit</div>',
  disabled: false,
  displayError: true,
  displayImage: true,
  imagePosition: 'top',
  indeterminate: false,
  title: '<div>Lorem Ipsum dolor</div>',
  value: '',
};
