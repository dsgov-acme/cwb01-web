import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { NuverialIconComponent } from './icon.component';

export default {
  component: NuverialIconComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
  title: 'DSG/Nuverial/Components/Icon',
} as Meta<NuverialIconComponent>;

const Template: Story<NuverialIconComponent> = args => {
  return {
    args,
    template: `<nuverial-icon [ariaHidden]="${args.ariaHidden}" iconName="${args.iconName}"></nuverial-icon>`,
  };
};

export const Icon = Template.bind({});
Icon.args = {
  ariaHidden: true,
  iconName: 'error_outline',
};
