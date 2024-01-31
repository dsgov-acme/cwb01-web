import { Meta, Story } from '@storybook/angular';
import Readme from './dsg.mdx';

export default {
  parameters: {
    docs: {
      page: Readme,
    },
    previewTabs: { canvas: { hidden: true } },
    viewMode: 'docs',
  },
  title: 'DSG',
} as Meta<unknown>;

export const About: Story = () => ({});
