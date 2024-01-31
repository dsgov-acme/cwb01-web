import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { FormControl, FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { axe } from 'jest-axe';
import { MockBuilder, MockService, NG_MOCKS_ROOT_PROVIDERS } from 'ng-mocks';
import { Subject } from 'rxjs';
import { DateRangePickerControl } from './date-picker.models';
import { NuverialDateRangePickerComponent } from './date-range-picker.component';

const focusEvents = new Subject<FocusOrigin | null>();
const focusMonitor = MockService(FocusMonitor, {
  monitor: _ => focusEvents.asObservable(),
});

const dependencies = MockBuilder(NuverialDateRangePickerComponent)
  .keep(FormsModule)
  .keep(NG_MOCKS_ROOT_PROVIDERS)
  .keep(MatNativeDateModule)
  .mock(FocusMonitor, focusMonitor)
  .build();

describe('DatePicker Component', () => {
  describe('Accessibility', () => {
    it('should have violations when ariaLabel is not set', async () => {
      const { fixture } = await render(NuverialDateRangePickerComponent, {
        ...dependencies,
        componentProperties: {
          formControl: new FormControl<DateRangePickerControl>({ endDate: null, startDate: null }),
        },
      });
      fixture.detectChanges();

      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
    it('should not have violations when ariaLabel is set', async () => {
      const { fixture } = await render(NuverialDateRangePickerComponent, {
        ...dependencies,
        componentProperties: {
          ariaLabel: 'Aria label',
          formControl: new FormControl<DateRangePickerControl>({ endDate: null, startDate: null }),
        },
      });
      fixture.detectChanges();

      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });

    it('should have no violations when endDatePlaceholder & startDatePlaceholder are set', async () => {
      const { fixture } = await render(NuverialDateRangePickerComponent, {
        ...dependencies,
        componentProperties: {
          endDatePlaceholder: 'end placeholder',
          formControl: new FormControl<DateRangePickerControl>({ endDate: null, startDate: null }),
          label: 'Input label',
          startDatePlaceholder: 'end placeholder',
        },
      });

      fixture.detectChanges();
      expect(fixture).toBeTruthy();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should not initialize without NgControl', async () => {
    const template = `<nuverial-date-range-picker ariaLabel="Aria label"></nuverial-date-range-picker>`;

    try {
      await render(template, { ...dependencies });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should be in invalid state', async () => {
    const { fixture } = await render(NuverialDateRangePickerComponent, {
      ...dependencies,
      componentProperties: {
        formControl: new FormControl<DateRangePickerControl>({ endDate: null, startDate: null }),
      },
    });
    const component = fixture.componentInstance;
    jest.spyOn(component.validationErrors, 'emit');
    fixture.detectChanges();

    focusEvents.next('keyboard');
    focusEvents.next(null);
    fixture.detectChanges();

    expect(await screen.findByText('Required date field')).toBeVisible();
    expect(component.validationErrors.emit).toHaveBeenCalledWith([{ datePickerRequired: 'Required date field' }]);
  });

  it('should be in invalid state no error display', async () => {
    const { fixture } = await render(NuverialDateRangePickerComponent, {
      ...dependencies,
      componentProperties: {
        displayError: false,
        formControl: new FormControl<DateRangePickerControl>({ endDate: null, startDate: null }),
      },
    });
    const component = fixture.componentInstance;
    jest.spyOn(component.validationErrors, 'emit');
    fixture.detectChanges();

    focusEvents.next('keyboard');
    focusEvents.next(null);
    fixture.detectChanges();

    expect(component.validationErrors.emit).toHaveBeenCalledWith([{ datePickerRequired: 'Required date field' }]);
  });

  it('should be in valid state', async () => {
    const currentYear = new Date().getFullYear();
    const { fixture } = await render(NuverialDateRangePickerComponent, {
      ...dependencies,
      componentProperties: {
        formControl: new FormControl<DateRangePickerControl>({ endDate: new Date(currentYear, 12, 31), startDate: new Date(currentYear, 1, 1) }),
      },
    });
    const component = fixture.componentInstance;
    jest.spyOn(component.validationErrors, 'emit');
    fixture.detectChanges();

    focusEvents.next('keyboard');
    focusEvents.next(null);
    fixture.detectChanges();

    expect(component.validationErrors.emit).toBeCalledTimes(0);
  });

  it('should be in valid invalid max date', async () => {
    const { fixture } = await render(NuverialDateRangePickerComponent, {
      ...dependencies,
      componentProperties: {
        formControl: new FormControl<DateRangePickerControl>({ endDate: null, startDate: null }),
      },
    });
    const component = fixture.componentInstance;
    jest.spyOn(component.validationErrors, 'emit');

    component.startDate.setErrors({
      matDatepickerMax: {
        actual: '2024-01-01T00:00:00.000Z',
        max: '2023-01-01T00:00:00.000Z',
      },
    });

    focusEvents.next(null);
    fixture.detectChanges();
    expect(component.validationErrors.emit).toHaveBeenCalledWith([{ datePickerMax: 'Invalid maximum date' }]);
    expect(await screen.findByText('Invalid maximum date')).toBeVisible();
  });

  it('should be in valid invalid min date', async () => {
    const { fixture } = await render(NuverialDateRangePickerComponent, {
      ...dependencies,
      componentProperties: {
        formControl: new FormControl<DateRangePickerControl>({ endDate: null, startDate: null }),
      },
    });
    const component = fixture.componentInstance;
    jest.spyOn(component.validationErrors, 'emit');

    component.startDate.setErrors({
      matDatepickerMin: {
        actual: '2022-01-01T00:00:00.000Z',
        min: '2023-04-01T06:00:00.000Z',
      },
    });

    focusEvents.next(null);
    fixture.detectChanges();
    expect(component.validationErrors.emit).toHaveBeenCalledWith([{ datePickerMin: 'Invalid minimum date' }]);
    expect(await screen.findByText('Invalid minimum date')).toBeVisible();
  });

  it('should be in valid invalid date format', async () => {
    const { fixture } = await render(NuverialDateRangePickerComponent, {
      ...dependencies,
      componentProperties: {
        formControl: new FormControl<DateRangePickerControl>({ endDate: null, startDate: null }),
      },
    });
    const component = fixture.componentInstance;
    jest.spyOn(component.validationErrors, 'emit');

    component.startDate.setErrors({
      matDatepickerParse: {
        text: '01011970',
      },
    });

    focusEvents.next(null);
    fixture.detectChanges();
    expect(component.validationErrors.emit).toHaveBeenCalledWith([{ datePickerParse: 'Invalid date format' }]);
    expect(await screen.findByText('Invalid date format')).toBeVisible();
  });
});
