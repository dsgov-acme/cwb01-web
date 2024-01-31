import { Meta, Story } from '@storybook/angular';
import Readme from './form.mdx';

export default {
  parameters: {
    docs: {
      page: Readme,
    },
    previewTabs: { canvas: { hidden: true } },
    viewMode: 'docs',
  },
  title: 'DSG/Forms',
} as Meta<unknown>;

export const About: Story = () => ({});
