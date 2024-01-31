import { CommonModule } from '@angular/common';
import { TemplateRef } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { NuverialTabsComponent } from './tabs.component';
import { INuverialTab } from './tabs.model';

const dependencies = MockBuilder(NuverialTabsComponent).keep(MatTabsModule).keep(CommonModule).build();

const TABS_LIST: INuverialTab[] = [
  { disabled: true, key: 'formio', label: 'FormIO' },
  { key: 'formly', label: 'Formly' },
  { key: 'formioJson', label: 'FormIO JSON' },
  { key: 'formlyJson', label: 'Formly JSON' },
];

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(NuverialTabsComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

describe('TabsComponent', () => {
  describe('Accessibility', () => {
    it('should have no violations when ariaLabel is set', async () => {
      const { fixture } = await getFixture({ componentProperties: { ariaLabel: 'tabs list' } });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });
  it('should create', async () => {
    const { fixture } = await getFixture({});
    expect(fixture).toBeTruthy();
  });

  it('can define a default tabs component', async () => {
    const { fixture } = await getFixture({});

    expect(fixture).toBeTruthy();
    expect(fixture.componentInstance.ariaDescribedBy).toEqual(undefined);
    expect(fixture.componentInstance.activeTabIndex).toEqual(0);
    expect(fixture.componentInstance.tabs.length).toEqual(0);
  });

  it('should set tabs list', async () => {
    const { fixture } = await getFixture({ componentProperties: { tabs: TABS_LIST } });

    expect(TABS_LIST.length).toEqual(fixture.componentInstance.tabs?.length);
  });

  it('should default to no mat tabs in DOM if there are no tabs', async () => {
    const { fixture } = await getFixture({});
    fixture.detectChanges();
    const tabs = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'));
    expect(tabs.length).toEqual(0);
  });

  it('should render the appropriate amount of tabs', async () => {
    const { fixture } = await getFixture({ componentProperties: { tabs: TABS_LIST } });
    fixture.detectChanges();

    const tabs = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'));

    expect(tabs.length).toEqual(4);
  });

  it('should emit event on active tab change', async () => {
    const { fixture } = await getFixture({ componentProperties: { tabs: TABS_LIST } });
    const component = fixture.componentInstance;
    const tabs = component.tabs;
    const spy = jest.spyOn(component.activeTabChange, 'emit');
    const spyActiveTabIndexChange = jest.spyOn(component.activeTabIndexChange, 'emit');

    fixture.detectChanges();

    component.handleActiveTabChange({ index: 2 } as MatTabChangeEvent);

    expect(spy).toBeCalledWith({ index: 2, tab: tabs[2] });
    expect(spyActiveTabIndexChange).toBeCalledWith(2);
  });

  it('should set the tab template with the matching label', async () => {
    const template = {} as TemplateRef<unknown>;
    const { fixture } = await getFixture({ componentProperties: { tabs: TABS_LIST } });
    fixture.detectChanges();

    const tabs = fixture.componentInstance.tabs;
    fixture.componentInstance.addTemplate(tabs[2].key, template);

    expect(tabs[2].template).toEqual(template);
  });
});
