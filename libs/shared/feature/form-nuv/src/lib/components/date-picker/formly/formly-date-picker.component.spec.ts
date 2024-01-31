import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { axe } from 'jest-axe';
import { MockDefaultComponentProperties, MockDefaultFormlyModuleConfiguration, MockTemplate } from '../../../test';
import { FormStateMode } from '../../forms';
import { FormlyDatePickerComponent } from './formly-date-picker.component';

const mockModel = {
  dateOfBirth: '2001-12-12',
  disabled: false,
  startView: 'month',
};

const mockFields: FormlyFieldConfig[] = [
  {
    key: 'date-picker',
    props: {
      disabled: false,
      startView: 'month',
    },
    type: 'nuverialDatePicker',
  },
  {
    key: 'dateOfBirth',
    props: {
      startView: 'month',
    },
    type: 'nuverialDatePicker',
  },
];

const getFixtureByTemplate = async (props?: Record<string, unknown>) => {
  const template = MockTemplate;
  // const mockLogging = jest.spyOn(LoggingService.prototype, 'warn').mockImplementation();
  const { fixture } = await render(template, {
    componentProperties: {
      ...MockDefaultComponentProperties,
      fields: mockFields,
      model: mockModel,
      ...props,
    },
    imports: [
      MatNativeDateModule,
      ReactiveFormsModule,
      FormlyModule.forRoot({
        ...MockDefaultFormlyModuleConfiguration,
        types: [{ component: FormlyDatePickerComponent, name: 'nuverialDatePicker' }],
      }),
    ],
  });
  const component = fixture.debugElement.query(By.directive(FormlyDatePickerComponent)).componentInstance;
  component.formState.mode = FormStateMode.Edit;
  fixture.detectChanges();

  return { component, fixture };
};

describe('FormlyDatePickerComponent', () => {
  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      { teardown: { destroyAfterEach: false } }, // required in formly tests
    );
  });

  it('should create', async () => {
    const { fixture } = await getFixtureByTemplate();

    expect(fixture).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { fixture } = await getFixtureByTemplate();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should verify edit mode field matches input', async () => {
    const { component, fixture } = await getFixtureByTemplate();

    component.formState.mode = FormStateMode.Edit;
    fixture.detectChanges();

    const model = {
      dateOfBirth: '12/12/2001',
    };

    expect(screen.getByDisplayValue(model.dateOfBirth)).toBeInTheDocument();
  });

  it('should verify review mode field matches input', async () => {
    const { component, fixture } = await getFixtureByTemplate();

    component.formState.mode = FormStateMode.Review;
    fixture.detectChanges();

    const model = {
      dateOfBirth: '12/12/2001',
    };

    expect(screen.getByText(model.dateOfBirth)).toBeInTheDocument();
  });

  it('should verify the dom', async () => {
    const { fixture } = await getFixtureByTemplate();

    expect(fixture.nativeElement.querySelector('dsg-formly-date-picker').id).toBe('date-picker-field');
  });
  it('should have asterisk in label when required is true', async () => {
    const { fixture } = await getFixtureByTemplate();

    expect(fixture.nativeElement.querySelector('span.mat-mdc-form-field-required-marker')).toBeFalsy();

    if (mockFields[0].props) {
      mockFields[0].props.required = true;
    }
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('span.mat-mdc-form-field-required-marker')).toBeTruthy();
  });
});
