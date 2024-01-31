import { Meta, Story } from '@storybook/angular';
import Readme from './card.directive.mdx';

export default {
  parameters: {
    docs: {
      page: Readme,
    },
    previewTabs: { canvas: { hidden: true } },
  },
  title: 'DSG/Nuverial/Directives/Card',
} as Meta<unknown>;

export const Card: Story = () => ({});
