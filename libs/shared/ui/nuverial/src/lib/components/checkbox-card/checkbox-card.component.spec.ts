import { FocusMonitor } from '@angular/cdk/a11y';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { MockBuilder, MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { NuverialIconComponent } from '../icon';
import { NuverialCheckboxCardComponent } from './checkbox-card.component';

const VALIDATION_MESSAGES = { required: 'Checkbox card required' };

const dependencies = MockBuilder(NuverialCheckboxCardComponent)
  .keep(MatCheckboxModule)
  .keep(MatFormFieldModule)
  .keep(NuverialIconComponent)
  .mock(
    FocusMonitor,
    MockService(FocusMonitor, {
      monitor: () => of(null),
    }),
  )
  .build();

const getFixture = async (props: Record<string, Record<string, string>>, inputString?: string) => {
  const { detectChanges, fixture } = await render(NuverialCheckboxCardComponent, {
    ...dependencies,
    ...props,
  });

  if (inputString) {
    await userEvent.click(screen.getByTestId('test-button-id'));
    detectChanges();
  }

  return { checkbox: screen.getByRole('checkbox'), fixture };
};

describe('CheckboxCardComponent', () => {
  describe('Accessibility', () => {
    it('should have no violations when ariaLabel is not set', async () => {
      const { fixture } = await getFixture({});
      fixture.detectChanges();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });

    it('should have no violations when ariaLabel is set', async () => {
      const { fixture } = await getFixture({ componentProperties: { ariaLabel: 'testing' } });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('can define a default checkbox card component', async () => {
    const { fixture } = await getFixture({});

    expect(fixture).toBeTruthy();
    expect(fixture.componentInstance.ariaLabel).toEqual(undefined);
    expect(fixture.componentInstance.ariaDescribedBy).toEqual(undefined);
    expect(fixture.componentInstance.checked).toEqual(false);
    expect(fixture.componentInstance.colorTheme).toEqual('primary');
    expect(fixture.componentInstance.disabled).toEqual(false);
    expect(fixture.componentInstance.indeterminate).toEqual(false);
    expect(fixture.componentInstance.value).toEqual('');
    expect(fixture.componentInstance.validationMessages).toBeFalsy();
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
    expect(checkbox.getAttribute('aria-describedby')).toEqual('');
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

  it('can set color', async () => {
    const { fixture } = await getFixture({ componentProperties: { colorTheme: 'accent' } });
    expect(fixture.nativeElement.querySelector('mat-checkbox.mat-primary')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('mat-checkbox.mat-accent')).toBeTruthy();
  });

  it('can set disabled false', async () => {
    const { checkbox } = await getFixture({});
    expect(checkbox.getAttribute('disabled')).toEqual(null);
  });

  it('can set indeterminate true', async () => {
    const { checkbox } = await getFixture({ componentProperties: { disabled: 'true' } });
    expect(checkbox.getAttribute('disabled')).toEqual('');
  });

  it('can set indeterminate false', async () => {
    const { checkbox } = await getFixture({ componentProperties: { disabled: 'false' } });
    expect(checkbox.getAttribute('disabled')).toEqual(null);
  });

  it('can emit click event', async () => {
    let emitted = null;
    const { fixture } = await render(NuverialCheckboxCardComponent, {
      ...dependencies,
    });
    const checkbox = screen.getByRole('checkbox');
    const component = fixture.componentInstance;

    component.change.subscribe(status => (emitted = status));
    fireEvent.click(checkbox);
    expect(emitted).toEqual({ checked: true, pointValue: 0, value: '' });
  });

  it('can set validation message', async () => {
    const { fixture } = await render(NuverialCheckboxCardComponent, {
      ...dependencies,
      componentProperties: {
        validationMessages: VALIDATION_MESSAGES,
      },
    });
    expect(fixture.componentInstance.validationMessages).toEqual(VALIDATION_MESSAGES);
  });
});
