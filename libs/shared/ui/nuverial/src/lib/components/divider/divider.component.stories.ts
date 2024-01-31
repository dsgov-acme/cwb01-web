import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { NuverialDividerComponent } from './divider.component';

export default {
  component: NuverialDividerComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
  title: 'DSG/Nuverial/Components/Divider',
} as Meta<NuverialDividerComponent>;

const Template: Story<NuverialDividerComponent> = args => {
  const style = `display: flex; gap: 0.5rem; row-gap: 0.5rem; height: 50px; width: 100px; flex-direction: ${args.vertical ? 'row' : 'column'}`;

  return {
    args,
    template: `
      <div style="${style}">
        <div style="align-self: center; width: 50px">hello</div>
        <nuverial-divider [vertical]="${args.vertical}"></nuverial-divider>
        <div style="align-self: center; width: 50px">world</div>
      </div>`,
  };
};

export const Divider = Template.bind({});
Divider.args = {
  vertical: false,
};
