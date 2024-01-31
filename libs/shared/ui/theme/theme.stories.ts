import { Meta, Story } from '@storybook/angular';
import Readme from './theme.mdx';

export default {
  parameters: {
    docs: {
      page: Readme,
    },
    previewTabs: { canvas: { hidden: true } },
    viewMode: 'docs',
  },
  title: 'DSG/Theme',
} as Meta<unknown>;

export const Theme: Story = () => ({});
