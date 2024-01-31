import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { NuverialBreadcrumbComponent } from './breadcrumb.component';

export default {
  component: NuverialBreadcrumbComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
  parameters: {},
  title: 'DSG/Nuverial/Components/Breadcrumb',
} as Meta<NuverialBreadcrumbComponent>;

const Template: Story<NuverialBreadcrumbComponent> = args => {
  return {
    args,
    template: `<nuverial-breadcrumb [breadCrumbs]='breadCrumbs'></nuverial-breadcrumb>`,
  };
};

export const Breadcrumb = Template.bind({});
Breadcrumb.args = {};
