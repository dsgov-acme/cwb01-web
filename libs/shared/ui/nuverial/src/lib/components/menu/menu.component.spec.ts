import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { LoggingService } from '@dsg/shared/utils/logging';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder, MockService } from 'ng-mocks';
import { INuverialMenuItem, NuverialMenuOptions } from '../../models';
import { NuverialButtonComponent } from '../button';
import { NuverialMenuComponent } from './menu.component';

const dependencies = MockBuilder(NuverialMenuComponent).keep(MatMenuModule).keep(NuverialButtonComponent).keep(CommonModule).build();

const MENU_OPTIONS: INuverialMenuItem[] = [
  {
    disabled: false,
    icon: 'settings',
    key: NuverialMenuOptions.PREFERENCES,
    label: '',
  },
  {
    disabled: true,
    icon: 'account_circle',
    key: NuverialMenuOptions.PROFILE,
    label: '',
  },
  {
    disabled: false,
    icon: 'logout',
    key: NuverialMenuOptions.LOGOUT,
    label: '',
  },
];

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(NuverialMenuComponent, {
    ...dependencies,
    ...props,
    providers: [{ provide: LoggingService, useValue: MockService(LoggingService) }],
  });

  return { fixture };
};

describe('NuverialMenuComponent', () => {
  it('should create', async () => {
    const { fixture } = await getFixture({});
    expect(fixture).toBeTruthy();
  });

  it('can define a default menu component', async () => {
    const { fixture } = await getFixture({});

    expect(fixture).toBeTruthy();
    expect(fixture.componentInstance.ariaLabel).toEqual(undefined);
    expect(fixture.componentInstance.menuAriaLabel).toEqual(undefined);
    expect(fixture.componentInstance.buttonIcon).toEqual(undefined);
    expect(fixture.componentInstance.menuItemList).toEqual(undefined);
  });

  describe('Accessibility', () => {
    it('should have violations when ariaLabel is not set', async () => {
      const { fixture } = await getFixture({});
      const axeResults = await axe(fixture.debugElement.nativeElement.querySelector('nuverial-button'));

      expect(axeResults).not.toHaveNoViolations();
    });
  });

  it('should set menuItemsList', async () => {
    const { fixture } = await getFixture({ componentProperties: { menuItemList: MENU_OPTIONS } });

    expect(MENU_OPTIONS.length).toEqual(fixture.componentInstance.menuItemList?.length);
  });

  it('should default to mat menu having no elements', async () => {
    const { fixture } = await getFixture({});
    const menu: HTMLElement = fixture.debugElement.nativeElement.querySelector('mat-menu');
    const menuElements = menu.querySelectorAll('button').length;
    expect(menuElements).toEqual(0);
  });

  it('should render the appropriate amount of mat menu elements', async () => {
    const { fixture } = await getFixture({ componentProperties: { menuItemList: MENU_OPTIONS } });
    const menu: HTMLElement = fixture.debugElement.nativeElement.querySelector('mat-menu');
    const menuElements = menu.querySelectorAll('button').length;
    expect(menuElements).toEqual(3);
  });

  it('should emit when onMenuClick is triggered', async () => {
    const { fixture } = await getFixture({ componentProperties: { menuItemList: MENU_OPTIONS } });

    fixture.detectChanges();
    const menuEmitterSpy = jest.spyOn(fixture.componentInstance.menuItemEvent, 'emit');
    const menuItemList = fixture.componentInstance.menuItemList;
    if (menuItemList && menuItemList?.length > 0) {
      fixture.componentInstance.onMenuClick(menuItemList[0].key);
      expect(menuEmitterSpy).toHaveBeenCalledWith(NuverialMenuOptions.PREFERENCES);
    }
  });
});
