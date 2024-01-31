import { FormControl, FormGroup } from '@angular/forms';
import { render } from '@testing-library/angular';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';

import { SimpleChanges } from '@angular/core';
import { RelativeDateInputComponent } from './relative-date-input.component';

const dependencies = MockBuilder(RelativeDateInputComponent).build();

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(RelativeDateInputComponent, {
    ...dependencies,
    ...props,
  });
  const component = fixture.componentInstance;

  return { component, fixture };
};

describe('RelativeDateInputComponent', () => {
  it('should create', async () => {
    const { fixture } = await getFixture({});
    expect(fixture).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { fixture } = await getFixture({ componentProperties: { ariaLabel: 'testLabel' } });
      const axeResults = await axe(fixture.nativeElement);
      expect.extend(toHaveNoViolations);
      expect(axeResults).toHaveNoViolations();
    });
  });

  describe('when the component is initialized', () => {
    it('should create a form group with two form controls', async () => {
      const { component } = await getFixture({});
      expect(component.formGroup).toBeDefined();
      expect(component.formGroup instanceof FormGroup).toBe(true);
      expect(component.formGroup.controls.dateUnit).toBeDefined();
      expect(component.formGroup.controls.numberOfUnit).toBeDefined();
      expect(component.formGroup.controls.dateUnit instanceof FormControl).toBe(true);
      expect(component.formGroup.controls.numberOfUnit instanceof FormControl).toBe(true);
    });

    it('should have null values for both form controls', async () => {
      const { component } = await getFixture({});
      expect(component.dateUnit.value).toBeNull();
      expect(component.numberOfUnit.value).toBeNull();
    });
  });

  describe('selectOption property', () => {
    it('should have the correct select options', async () => {
      const { component } = await getFixture({});
      const expectedOptions = [
        { disabled: false, displayTextValue: 'Days', key: 'day', selected: false },
        { disabled: false, displayTextValue: 'Weeks', key: 'week', selected: false },
        { disabled: false, displayTextValue: 'Months', key: 'month', selected: false },
        { disabled: false, displayTextValue: 'Years', key: 'year', selected: false },
      ];
      expect(component.selectOption).toEqual(expectedOptions);
    });

    it('should not have any option marked as selected', async () => {
      const { component } = await getFixture({});
      const selectedOptions = component.selectOption.filter(option => option.selected);
      expect(selectedOptions.length).toBe(0);
    });
  });

  describe('updateValueFromControl method', () => {
    it('should update the value when both controls have values', async () => {
      const { component } = await getFixture({});
      component.dateUnit.setValue('day');
      component.numberOfUnit.setValue(5);
      component.updateValueFromControl();
      expect(component.value).toBe('5-day');
    });

    it('should not update the value and reset the validator when the controls is null', async () => {
      const { component } = await getFixture({});
      component.dateUnit.setValue(null);
      component.numberOfUnit.setValue(5);
      component.updateValueFromControl();
      expect(component.value).toBe('');

      component.dateUnit.setValue('day');
      component.numberOfUnit.setValue(null);
      component.updateValueFromControl();
      expect(component.value).toBe('');
    });

    it('should not update the value when both controls are null', async () => {
      const { component } = await getFixture({});
      component.dateUnit.setValue(null);
      component.numberOfUnit.setValue(null);
      component.updateValueFromControl();
      expect(component.value).toBe('');
    });
  });
  describe('ngOnChanges lifecycle hook', () => {
    it('should set dateUnit and numberOfUnit when value changes', async () => {
      const { component } = await getFixture({});

      const changes: SimpleChanges = {
        value: {
          currentValue: '10-day',

          firstChange: true,

          isFirstChange: () => true,

          previousValue: null,
        },
      };

      component.ngOnChanges(changes);

      expect(component.dateUnit.value).toEqual('day');
      expect(component.numberOfUnit.value).toEqual('10');
    });

    it('should handle negative values', async () => {
      const { component } = await getFixture({});

      const changes: SimpleChanges = {
        value: {
          currentValue: '-10-day',

          firstChange: true,

          isFirstChange: () => true,

          previousValue: null,
        },
      };

      component.ngOnChanges(changes);

      expect(component.dateUnit.value).toEqual('day');
      expect(component.numberOfUnit.value).toEqual('-10');
    });

    it('should not update dateUnit and numberOfUnit if value change is not provided', async () => {
      const { component } = await getFixture({});
      component.dateUnit.setValue('previousValue');
      component.numberOfUnit.setValue('previousValue');

      const changes: SimpleChanges = {};
      component.ngOnChanges(changes);

      expect(component.dateUnit.value).toEqual('previousValue');
      expect(component.numberOfUnit.value).toEqual('previousValue');
    });

    it('should handle null values properly', async () => {
      const { component } = await getFixture({});
      component.dateUnit.setValue('previousValue');
      component.numberOfUnit.setValue('previousValue');

      const changes: SimpleChanges = {
        value: {
          currentValue: null,
          firstChange: false,
          isFirstChange: () => false,
          previousValue: '10-day',
        },
      };

      component.ngOnChanges(changes);

      expect(component.dateUnit.value).toEqual('previousValue');
      expect(component.numberOfUnit.value).toEqual('previousValue');
    });
  });
});
