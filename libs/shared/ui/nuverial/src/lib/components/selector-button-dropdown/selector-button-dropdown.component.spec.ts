import { CommonModule } from '@angular/common';
import { LoggingAdapter, LoggingService } from '@dsg/shared/utils/logging';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder, MockProvider } from 'ng-mocks';
import { NuverialSelectorButtonDropdownComponent } from './selector-button-dropdown.component';

const dependencies = MockBuilder(NuverialSelectorButtonDropdownComponent)
  .keep(CommonModule)
  .provide(MockProvider(LoggingAdapter))
  .provide(MockProvider(LoggingService))
  .build();

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(NuverialSelectorButtonDropdownComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

describe('SelectorButtonDropdownComponent', () => {
  it('should create', async () => {
    const { fixture } = await getFixture({});
    expect(fixture).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations when ariaLabel is set', async () => {
      const { fixture } = await getFixture({});
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });
  });
  it('should return the same value passed to trackByFn', async () => {
    const { fixture } = await getFixture({});
    const testValues = [0, 1, 2, 3, 10, 50, 100];
    for (const value of testValues) {
      expect(fixture.componentInstance.trackByFn(value)).toEqual(value);
    }
  });
  it('should emit buttonClickedEvent with selectedItem on selectItem call', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;

    jest.spyOn(component.buttonClickedEvent, 'emit');

    component.selectItem({ disabled: false, displayTextValue: 'Test Value', key: 'testKey', selected: true });

    expect(component.buttonClickedEvent.emit).toHaveBeenCalledWith({ disabled: false, displayTextValue: 'Test Value', key: 'testKey', selected: true });
  });

  it('should set the max height of the .mat-mdc-menu-panel element when the menu is opened', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;
    component.maxHeight = 200;

    const mockElement = document.createElement('div');
    jest.spyOn(document, 'querySelector').mockReturnValue(mockElement);

    component.onMenuOpened();

    expect(document.querySelector).toHaveBeenCalledWith('.mat-mdc-menu-panel');
    expect(mockElement.style.maxHeight).toBe('200px');
  });
});
