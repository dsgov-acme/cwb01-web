import { Meta, Story } from '@storybook/angular';
import Readme from './validation.mdx';

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

export const Validation: Story = () => ({});
