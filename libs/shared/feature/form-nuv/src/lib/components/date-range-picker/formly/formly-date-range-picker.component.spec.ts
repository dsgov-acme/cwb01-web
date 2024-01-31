import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { LoggingService } from '@dsg/shared/utils/logging';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockService } from 'ng-mocks';
import { MockDefaultComponentProperties, MockDefaultFormlyModuleConfiguration, MockTemplate } from '../../../test';
import { FormlyDateRangePickerComponent } from './formly-date-range-picker.component';

const mockModel = {
  disabled: false,
  startView: 'month',
};

const mockFields: FormlyFieldConfig[] = [
  {
    key: 'date-range-picker',
    props: {
      ariaLabel: 'date-range-picker',
      disabled: false,
      startView: 'month',
    },
    type: 'nuverialDateRangePicker',
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
      ReactiveFormsModule,
      MatNativeDateModule,
      FormlyModule.forRoot({
        ...MockDefaultFormlyModuleConfiguration,
        types: [{ component: FormlyDateRangePickerComponent, name: 'nuverialDateRangePicker' }],
      }),
    ],
    providers: [{ provide: LoggingService, useValue: MockService(LoggingService) }],
  });

  return { fixture };
};

// TODO: fix tests when we update the date range picker
describe.skip('FormlyDateRangePickerComponent', () => {
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
    fixture.detectChanges();

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

    expect(fixture.nativeElement.querySelector('dsg-formly-date-range-picker').id).toBe('date-range-picker-field');
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
