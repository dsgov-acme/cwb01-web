import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedUtilsLoggingModule } from '@dsg/shared/utils/logging';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { NuverialTabKeyDirective } from '../../directives';
import { NuverialTabsComponent } from './tabs.component';

export default {
  component: NuverialTabsComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, CommonModule, MatTabsModule, NuverialTabKeyDirective, SharedUtilsLoggingModule.useConsoleLoggingAdapter()],
    }),
    componentWrapperDecorator(story => `<div style="margin: 0 auto;">${story}</div>`),
  ],
  title: 'DSG/Nuverial/Components/Tabs',
} as Meta<NuverialTabsComponent>;

const Template: Story<NuverialTabsComponent> = (args: NuverialTabsComponent) => {
  const tabs: unknown[] = [];
  args.tabs.forEach(tab => {
    tabs.push(JSON.stringify(tab));
  });

  return {
    props: {
      ...args,
    },
    template: `
    <nuverial-tabs activeTabIndex="${args.activeTabIndex}" [tabs]="tabs">
      <ng-template nuverialTabKey="formly" let-form>
        <h4>Formly Content</h4>
        <hr>
        <div></div>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt </p>
        <button type="submit">Click</button>
      </ng-template>
      <ng-template nuverialTabKey="formio" let-form>FormIO Content</ng-template>
      <ng-template nuverialTabKey="formlyJson" let-form>
          <h4>Formly Data</h4>
          <hr>
          <div></div>
          <div>First name: Test</div>
          <div>Last name: Test</div>
          <div>Email: Test@email.com</div>
          <div>Address: 555 Maine Street, Orlando, Florida</div>
      </ng-template>
      <ng-template nuverialTabKey="formioJson" let-form>
        <h4>Formio Data</h4>
        <hr>
        <div></div>
        <div>First name: Test</div>
        <div>Last name: Test</div>
        <div>Email: Test@email.com</div>
        <div>Address: 555 Maine Street, Orlando, Florida</div>
      </ng-template>
    </nuverial-tabs>`,
  };
};

export const Tabs = Template.bind({});

Tabs.args = {
  activeTabIndex: 1,
  ariaLabel: 'Builder Renderer Tabs',
  tabs: [
    { disabled: true, key: 'formio', label: 'FormIO' },
    { key: 'formly', label: 'Formly' },
    { key: 'formioJson', label: 'FormIO JSON' },
    { key: 'formlyJson', label: 'Formly JSON' },
  ],
};
