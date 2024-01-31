import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { LoggingService } from '@dsg/shared/utils/logging';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockService } from 'ng-mocks';
import { MockDefaultComponentProperties, MockDefaultFormlyModuleConfiguration, MockTemplate } from '../../../test';
import { FormStateMode } from '../../forms';
import { FormlySelectComponent } from './formly-select.component';

const mockModel = {
  ariaLabel: 'Select',
  label: 'Select',
  placeholder: 'Select',
  required: false,
  selectOptions: [
    {
      disabled: false,
      displayTextValue: 'Alabama',
      key: 'AL',
      selected: false,
    },
    {
      disabled: true,
      displayTextValue: 'Alaska',
      key: 'AK',
      selected: false,
    },
    {
      disabled: false,
      displayChipValue: 'AS',
      displayTextValue: 'American Samoa',
      key: 'AS',
      selected: false,
    },
    {
      disabled: false,
      displayTextValue: 'Arizona',
      key: 'AZ',
      selected: false,
    },
    {
      disabled: false,
      displayChipValue: 'CA',
      displayTextValue: 'California',
      key: 'CA',
      selected: false,
    },
  ],
  selectedOptionIconName: 'check',
};

const mockFields: FormlyFieldConfig[] = [
  {
    key: 'select',
    props: {
      ariaLabel: 'Select',
      label: 'Select',
      placeholder: 'Select',
      required: false,
      selectOptions: [
        {
          disabled: false,
          displayTextValue: 'Alabama',
          key: 'AL',
          selected: false,
        },
        {
          disabled: true,
          displayTextValue: 'Alaska',
          key: 'AK',
          selected: false,
        },
        {
          disabled: false,
          displayChipValue: 'AS',
          displayTextValue: 'American Samoa',
          key: 'AS',
          selected: false,
        },
        {
          disabled: false,
          displayTextValue: 'Arizona',
          key: 'AZ',
          selected: false,
        },
        {
          disabled: false,
          displayChipValue: 'CA',
          displayTextValue: 'California',
          key: 'CA',
          selected: false,
        },
      ],
      selectedOptionIconName: 'check',
    },
    type: 'nuverialSelect',
  },
];

const getFixtureByTemplate = async (props?: Record<string, unknown>) => {
  const template = MockTemplate;
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
        types: [{ component: FormlySelectComponent, name: 'nuverialSelect' }],
      }),
    ],
    providers: [{ provide: LoggingService, useValue: MockService(LoggingService) }],
  });
  const component = fixture.debugElement.query(By.directive(FormlySelectComponent)).componentInstance;

  return { component, fixture };
};

describe('FormlySelectComponent', () => {
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

  it('should verify the dom', async () => {
    const { fixture } = await getFixtureByTemplate();

    expect(fixture.nativeElement.querySelector('dsg-formly-select').id).toBe('select-field');
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

  describe('Review Form', () => {
    it('should verify display text value is present in review form', async () => {
      const { fixture, component } = await getFixtureByTemplate();
      component.formControl.setValue('AK');
      fixture.detectChanges();
      component.formState.mode = FormStateMode.Review;
      fixture.detectChanges();
      expect(await screen.findByText('Alaska')).toBeInTheDocument();
    });
  });
});
