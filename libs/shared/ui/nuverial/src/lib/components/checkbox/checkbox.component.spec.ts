import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { MockBuilder, MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { NuverialIconComponent } from '../icon';
import { NuverialCheckboxComponent } from './checkbox.component';

const dependencies = MockBuilder(NuverialCheckboxComponent)
  .keep(MatCheckboxModule)
  .keep(MatFormFieldModule)
  .keep(NuverialIconComponent)
  .mock(
    FocusMonitor,
    MockService(FocusMonitor, {
      monitor: () => of(null),
    }),
  )
  .provide({
    provide: ChangeDetectorRef,
    useValue: {
      markForCheck: jest.fn(),
    },
  })
  .build();

const getFixture = async (props: Record<string, Record<string, string>>, inputString?: string) => {
  const { detectChanges, fixture } = await render(NuverialCheckboxComponent, {
    ...dependencies,
    ...props,
  });

  if (inputString) {
    await userEvent.click(screen.getByTestId('test-button-id'));
    detectChanges();
  }

  return { checkbox: screen.getByRole('checkbox'), fixture };
};

describe('CheckboxComponent', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });
  describe('Accessibility', () => {
    it('should have violations when ariaLabel is not set', async () => {
      const { fixture } = await getFixture({});
      fixture.detectChanges();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).not.toHaveNoViolations();
    });

    it('should have no violations when ariaLabel is set', async () => {
      const { fixture } = await getFixture({ componentProperties: { ariaLabel: 'testing' } });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('can define a default checkbox component', async () => {
    const { fixture } = await getFixture({});

    expect(fixture).toBeTruthy();
    expect(fixture.componentInstance.ariaLabel).toEqual(undefined);
    expect(fixture.componentInstance.ariaDescribedBy).toEqual(undefined);
    expect(fixture.componentInstance.checked).toEqual(false);
    expect(fixture.componentInstance.colorTheme).toEqual('primary');
    expect(fixture.componentInstance.disabled).toEqual(false);
    expect(fixture.componentInstance.required).toEqual(false);
    expect(fixture.componentInstance.indeterminate).toEqual(false);
  });

  it('aria-label default', async () => {
    const { checkbox } = await getFixture({});
    expect(checkbox.getAttribute('aria-label')).toEqual(null);
  });

  it('can set aria-label', async () => {
    const { checkbox } = await getFixture({ componentProperties: { ariaLabel: 'testing' } });
    expect(checkbox.getAttribute('aria-label')).toEqual('testing');
  });

  it('aria-describedby default', async () => {
    const { checkbox } = await getFixture({});
    expect(checkbox.getAttribute('aria-describedby')).toEqual(null);
  });

  it('can set aria-describedby', async () => {
    const { checkbox } = await getFixture({ componentProperties: { ariaDescribedBy: 'testing' } });
    expect(checkbox.getAttribute('aria-describedby')).toEqual('testing');
  });

  it('checked default', async () => {
    const { checkbox } = await getFixture({});
    expect(checkbox).not.toBeChecked();
  });

  it('can set checked', async () => {
    const { checkbox } = await getFixture({ componentProperties: { checked: 'true' } });
    expect(checkbox).toBeChecked();
  });

  it('color default', async () => {
    const { fixture } = await getFixture({});
    expect(fixture.nativeElement.querySelector('mat-checkbox.mat-primary')).toBeTruthy();
  });

  it('can set color accent', async () => {
    const { fixture } = await getFixture({ componentProperties: { colorTheme: 'accent' } });
    expect(fixture.nativeElement.querySelector('mat-checkbox.mat-primary')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('mat-checkbox.mat-accent')).toBeTruthy();
  });

  it('can set color warn', async () => {
    const { fixture } = await getFixture({ componentProperties: { colorTheme: 'warn' } });
    expect(fixture.nativeElement.querySelector('mat-checkbox.mat-primary')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('mat-checkbox.mat-warn')).toBeTruthy();
  });

  it('should mark for check', async () => {
    const { fixture } = await getFixture({});
    const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    const markForCheckSpy = jest.spyOn(changeDetectorRef.constructor.prototype, 'markForCheck');
    fixture.componentInstance.markForCheck();
    expect(markForCheckSpy).toBeCalled();
  });

  describe('validate', () => {
    it('should return required object', async () => {
      const { fixture } = await getFixture({});
      const control = new FormControl({ disabled: false, value: true });
      fixture.componentInstance.formControl = control;
      fixture.componentInstance.required = true;
      const isValid = fixture.componentInstance.validate(control);
      expect(isValid?.required).toBeTruthy();
    });

    it('should return null if not required', async () => {
      const { fixture } = await getFixture({});
      const control = new FormControl({ disabled: false, value: false });
      const isValid = fixture.componentInstance.validate(control);
      expect(isValid).toBeFalsy();
    });

    it('should return null if required and isValid', async () => {
      const { fixture } = await getFixture({});
      const control = new FormControl({ disabled: false, value: true });
      fixture.componentInstance.formControl = control;
      fixture.componentInstance.required = true;
      fixture.componentInstance.formControl.markAsTouched();
      const isValid = fixture.componentInstance.validate(control);
      expect(isValid?.required).toBeFalsy();
    });
  });

  it('should set checked to true', async () => {
    const { fixture } = await getFixture({});
    const control = new FormControl({ disabled: false, value: true });
    fixture.componentInstance.formControl = control;
    fixture.componentInstance.ngAfterViewInit();
    expect(fixture.componentInstance.checked).toBeTruthy();
  });

  it('can emit click event', async () => {
    let emitted = null;
    const { fixture } = await render(NuverialCheckboxComponent, {
      ...dependencies,
    });
    const checkbox = screen.getByRole('checkbox');
    const component = fixture.componentInstance;

    component.change.subscribe(status => (emitted = status));
    fireEvent.click(checkbox);
    expect(emitted).toEqual({ checked: true, value: undefined });
  });

  it('sets form control value when checked', async () => {
    const { fixture } = await render(NuverialCheckboxComponent, {
      ...dependencies,
    });
    const control = new FormControl({ disabled: false, value: false });
    const checkbox = screen.getByRole('checkbox');
    const component = fixture.componentInstance;
    component.formControl = control;

    fireEvent.click(checkbox);
    expect(component.formControl.value).toBeTruthy();
  });

  it('should mark form control as touched and display errors when touched', async () => {
    const { fixture } = await render(NuverialCheckboxComponent, {
      ...dependencies,
    });

    const control = new FormControl('', [Validators.required]);
    fixture.componentInstance.formControl = control;

    expect(control.touched).toBeFalsy();

    const checkbox = screen.getByRole('checkbox');
    checkbox.click();
    control.markAsTouched();

    expect(control.touched).toBeTruthy();

    setTimeout(() => {
      expect(control.hasError('required')).toBeTruthy();
      const errorElement = screen.getByText('Required input field', { selector: 'div.error-message' });
      expect(errorElement).toBeTruthy();
    }, 2000);
  });
});
