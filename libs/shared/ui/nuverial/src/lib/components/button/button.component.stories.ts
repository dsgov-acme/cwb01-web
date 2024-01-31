import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SharedUtilsLoggingModule } from '@dsg/shared/utils/logging';
import { NuverialButtonComponent } from './button.component';

type StoryType = NuverialButtonComponent & { label?: string };

export default {
  argTypes: {
    buttonStyle: {
      control: {
        labels: {
          filled: 'Filled',
          outlined: 'Outlined',
          text: 'Text',
        },
        type: 'radio',
      },
      options: ['filled', 'outlined', 'text'],
      table: {
        defaultValue: { summary: 'Filled' },
        type: { summary: 'radio' },
      },
    },
    click: {
      action: 'click',
      description: 'Button click event handler',
    },
    label: {
      control: 'text',
      defaultValue: '',
      description: 'Allows text inside the button to be set. Note that this option applies to Storybook only',
    },
    loading: {
      control: {
        type: 'boolean',
      },
      type: {
        name: 'boolean',
        required: false,
      },
    },
  },
  component: NuverialButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [SharedUtilsLoggingModule.useConsoleLoggingAdapter()],
    }),
  ],
  parameters: {
    actions: { click: { action: 'click' } },
  },
  title: 'DSG/Nuverial/Components/Button',
} as Meta<NuverialButtonComponent>;

const Template: Story<StoryType> = args => {
  return {
    props: {
      ...args,
      onClickEvent: (event: unknown) => {
        return action('click')(event);
      },
    },
    template: `<nuverial-button
        ariaDescribedBy="${args.ariaDescribedBy}"
        ariaLabel="${args.ariaLabel}"
        buttonStyle="${args.buttonStyle}"
        [disabled]="${args.disabled}"
        colorTheme="${args.colorTheme}"
        [loading]="${args.loading}"
        (click)="onClickEvent($event)">${args.label}</nuverial-button>`,
  };
};

export const FilledButton = Template.bind({});
FilledButton.args = {
  ariaDescribedBy: '',
  ariaLabel: '',
  buttonStyle: 'filled',
  colorTheme: 'primary',
  disabled: false,
  label: 'Filled button',
  loading: false,
};

export const OutlinedButton = Template.bind({});
OutlinedButton.args = {
  ariaDescribedBy: '',
  ariaLabel: '',
  buttonStyle: 'outlined',
  colorTheme: 'primary',
  disabled: false,
  label: 'Outlined button',
  loading: false,
};

export const TextButton = Template.bind({});
TextButton.args = {
  ariaDescribedBy: '',
  ariaLabel: '',
  buttonStyle: 'text',
  colorTheme: 'primary',
  disabled: false,
  label: 'Text button',
  loading: false,
};
