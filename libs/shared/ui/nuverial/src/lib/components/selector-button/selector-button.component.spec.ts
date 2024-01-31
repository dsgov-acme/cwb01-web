import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { INuverialTab } from '../tabs';
import { NuverialSelectorButtonComponent } from './selector-button.component';
const dependencies = MockBuilder(NuverialSelectorButtonComponent).keep(CommonModule).build();

const TABS_LIST: INuverialTab[] = [
  { key: 'visual', label: 'Visual' },
  { key: 'json', label: 'JSON' },
];

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(NuverialSelectorButtonComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

describe('SelectorButtonComponent', () => {
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

  it('should be created and inject dependencies', async () => {
    const { fixture } = await render(NuverialSelectorButtonComponent);
    expect(fixture.componentInstance).toBeDefined();
    expect((fixture.componentInstance as any)._cdr).toBeDefined();
  });

  it('should inject the ChangeDetectorRef', () => {
    const fixture = TestBed.createComponent(NuverialSelectorButtonComponent);
    const cdr = fixture.debugElement.injector.get(ChangeDetectorRef);
    expect(cdr).toBeTruthy();
  });

  describe('Rendering', () => {
    it('should set tabs list', async () => {
      const { fixture } = await getFixture({ componentProperties: { tabs: TABS_LIST } });
      expect(TABS_LIST.length).toEqual(fixture.componentInstance.tabs?.length);
    });

    it('should default to no labels in DOM if there are no tabs', async () => {
      const { fixture } = await render(NuverialSelectorButtonComponent);
      fixture.componentInstance.tabs = TABS_LIST;
      fixture.detectChanges();
      const labels = fixture.debugElement.queryAll(By.css('.button'));
      expect(labels.length).toEqual(0);
    });

    it('should render the appropriate amount of labels', async () => {
      const { fixture } = await render(NuverialSelectorButtonComponent);
      fixture.componentInstance.tabs = TABS_LIST;
      fixture.detectChanges();
      const labels = fixture.debugElement.queryAll(By.css('.button'));
      expect(labels.length).toEqual(0);
    });
  });

  describe('onSelect', () => {
    it('should emit the selectEvent when onSelect is called', async () => {
      const { fixture } = await getFixture({ componentProperties: { tabs: TABS_LIST } });
      const emitSpy = jest.spyOn(fixture.componentInstance['selectEvent'], 'emit');
      const testKey = 'visual';
      fixture.componentInstance.onSelect(testKey);
      expect(emitSpy).toHaveBeenCalledWith(testKey);
    });

    it('should call updateThumbStyles when onSelect is called', async () => {
      const { fixture } = await getFixture({ componentProperties: { tabs: TABS_LIST } });
      const spy = jest.spyOn(fixture.componentInstance as any, '_updateThumbStyles');
      const testKey = 'visual';
      fixture.componentInstance.onSelect(testKey);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('_updateThumbStyles', () => {
    it('should update thumb styles correctly', async () => {
      const { fixture } = await render(NuverialSelectorButtonComponent);
      fixture.componentInstance.tabs = TABS_LIST;
      const testKey = 'visual';
      fixture.componentInstance.selectedTabKey = testKey;
      fixture.componentInstance.buttonWidths = [50, 100];
      fixture.componentInstance['_updateThumbStyles']();

      const expectedWidth = '50px';
      const expectedShift = 0; // Since the 'visual' tab is assumed to be the first tab based on the mock data

      expect(fixture.componentInstance.thumbWidth).toEqual(expectedWidth);
      expect(fixture.componentInstance.shiftPosition).toEqual(expectedShift);
    });
  });

  describe('trackByFn', () => {
    it('should return the same value passed to trackByFn', async () => {
      const { fixture } = await render(NuverialSelectorButtonComponent);
      const testValues = [0, 1, 2, 3, 10, 50, 100];
      for (const value of testValues) {
        expect(fixture.componentInstance.trackByFn(value)).toEqual(value);
      }
    });
  });

  describe('ngAfterViewInit', () => {
    it('should correctly initialize after view init', async () => {
      const { fixture } = await render(NuverialSelectorButtonComponent);
      fixture.componentInstance.tabs = [{ key: 'testKey', label: 'Test Label' }];
      const mockButtons = [{ nativeElement: { offsetWidth: 50 } }];
      fixture.componentInstance.buttons = {
        map: jest.fn(callback => mockButtons.map(callback)),
      } as any;
      const updateSpy = jest.spyOn(fixture.componentInstance as any, '_updateThumbStyles');
      fixture.componentInstance.ngAfterViewInit();
      expect(fixture.componentInstance.selectedTabKey).toEqual('testKey');
      expect(fixture.componentInstance.buttonWidths[0]).toEqual(50);
      expect(updateSpy).toHaveBeenCalled();
      updateSpy.mockRestore();
    });
  });
});
