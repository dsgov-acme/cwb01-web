import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { NuverialFormErrorsComponent } from './form-errors.component';
import { IFormError } from './form-errors.model';

const formErrors: IFormError[] = [
  {
    controlName: 'test',
    errorName: 'required',
    id: '1234',
    label: 'test label',
  },
];

const dependencies = MockBuilder(NuverialFormErrorsComponent).build();

const getFixture = async (props: Record<string, Record<string, any>>) => {
  const { fixture } = await render(NuverialFormErrorsComponent, {
    ...dependencies,
    ...props,
  });
  const component = fixture.componentInstance;

  return { component, fixture };
};

const getFixtureByTemplate = async () => {
  const { fixture } = await render(`<nuverial-form-errors [formErrors]="formErrors"></nuverial-form-errors>`, {
    ...dependencies,
    componentProperties: {
      formErrors,
    },
  });
  const component = fixture.componentInstance;

  return { component, fixture };
};

describe('FormFieldErrorComponent', () => {
  describe('Accessability', () => {
    it('should have no violations', async () => {
      const { fixture } = await getFixtureByTemplate();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should render the form error link', async () => {
    const { fixture } = await getFixtureByTemplate();

    expect(fixture.nativeElement.querySelector('nuverial-form-errors').getAttribute('role')).toBe('alert');
    expect(screen.getByRole('button').textContent).toBe('test label');
  });

  it('should focus the input element when handleFocus is called with a form error', async () => {
    const { component } = await getFixture({
      componentProperties: {
        formErrors,
      },
    });
    const inputElement = document.createElement('input');
    const focusSpy = jest.spyOn(inputElement, 'focus');
    const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue(inputElement);

    component.handleFocus(formErrors[0]);

    expect(querySelectorSpy).toHaveBeenCalledTimes(1);
    expect(querySelectorSpy).toHaveBeenCalledWith('#1234 input');
    expect(focusSpy).toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  it('should focus the textarea element when handleFocus is called with a form error', async () => {
    const { component } = await getFixture({
      componentProperties: {
        formErrors,
      },
    });
    const textareaElement = document.createElement('textarea');
    const focusSpy = jest.spyOn(textareaElement, 'focus');
    const querySelectorSpy = jest.spyOn(document, 'querySelector');
    querySelectorSpy.mockReturnValueOnce(null).mockReturnValueOnce(textareaElement);

    component.handleFocus(formErrors[0]);

    expect(querySelectorSpy).toHaveBeenCalledTimes(2);
    expect(querySelectorSpy).toHaveBeenCalledWith('#1234 textarea');
    expect(querySelectorSpy.mock.calls).toEqual([['#1234 input'], ['#1234 textarea']]);
    expect(focusSpy).toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  it('should not display "SHOW MORE" button when formErrors array length is 0', async () => {
    await getFixtureByTemplate();

    expect(screen.queryByText('SHOW MORE')).toBeNull();
  });

  it('should show "SHOW MORE" link when there are more than 3 errors', async () => {
    const { fixture } = await getFixture({
      componentProperties: {
        formErrors: [...formErrors, ...formErrors, ...formErrors, ...formErrors],
      },
    });

    const showMoreLink = fixture.nativeElement.querySelector('.show-more a');
    expect(showMoreLink).toBeInTheDocument();
    expect(showMoreLink.textContent.trim()).toBe('SHOW MORE');
  });

  it('should show additional errors when "SHOW MORE" link is clicked', async () => {
    const { fixture } = await getFixture({
      componentProperties: {
        formErrors: [...formErrors, ...formErrors, ...formErrors, ...formErrors],
      },
    });

    fixture.detectChanges();

    const initialErrors = screen.getAllByTestId(/^error-/);
    const initialErrorCount = initialErrors.length;

    const showMoreLink = fixture.nativeElement.querySelector('.show-more a');
    showMoreLink.click();

    fixture.detectChanges();

    const allErrors = screen.getAllByTestId(/^error-/);
    const additionalErrorCount = allErrors.length;

    expect(additionalErrorCount).toBeGreaterThan(initialErrorCount);
  });

  it('should show "SHOW LESS" link when additional errors are displayed', async () => {
    const { fixture } = await getFixture({
      componentProperties: {
        formErrors: [...formErrors, ...formErrors, ...formErrors, ...formErrors],
      },
    });

    fixture.detectChanges();

    const initialErrors = screen.getAllByTestId(/^error-/);
    const initialErrorCount = initialErrors.length;

    const showMoreLink = fixture.nativeElement.querySelector('.show-more a');
    showMoreLink.click();

    fixture.detectChanges();

    const showLessLink = fixture.nativeElement.querySelector('.show-more .show-more-text');

    expect(showLessLink).toBeTruthy();
    expect(showLessLink.textContent.trim()).toBe('SHOW LESS');

    showLessLink.click();

    fixture.detectChanges();

    const finalErrors = screen.getAllByTestId(/^error-/);
    const finalErrorCount = finalErrors.length;

    expect(finalErrorCount).toBe(initialErrorCount);
  });

  describe('ngAfterViewInit', () => {
    it('should call querySelector on ngAfterViewInit', async () => {
      const { component } = await getFixture({
        componentProperties: {
          formErrors,
        },
      });

      const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue(null);
      component.ngAfterViewInit();

      expect(querySelectorSpy).toHaveBeenCalledTimes(1);
      expect(querySelectorSpy).toHaveBeenCalledWith('ul.form-errors-list');
      jest.restoreAllMocks();
    });
    it('should focus on error list after view init', async () => {
      const { component } = await getFixture({
        componentProperties: {
          formErrors,
        },
      });

      const errorListElement = document.createElement('ul.form-errors-list');
      const focusSpy = jest.spyOn(errorListElement, 'focus');
      const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue(errorListElement);

      component.ngAfterViewInit();

      expect(querySelectorSpy).toHaveBeenCalledTimes(1);
      expect(querySelectorSpy).toHaveBeenCalledWith('ul.form-errors-list');
      expect(focusSpy).toHaveBeenCalled();

      jest.restoreAllMocks();
    });
  });
});
