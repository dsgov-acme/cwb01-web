import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { LoggingService } from '@dsg/shared/utils/logging';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockService } from 'ng-mocks';
import { MockDefaultComponentProperties, MockDefaultFormlyModuleConfiguration, MockTemplate } from '../../../test';
import { FormlyCheckboxComponent } from './formly-checkbox.component';

const mockModel = {
  checkboxValue: '',
};

const mockFields: FormlyFieldConfig[] = [
  {
    key: 'key-checkbox',
    props: {
      label: 'Checkbox Label',
      required: true,
    },
    type: 'nuverialCheckbox',
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
      ReactiveFormsModule,
      FormlyModule.forRoot({
        ...MockDefaultFormlyModuleConfiguration,
        types: [{ component: FormlyCheckboxComponent, name: 'nuverialCheckbox' }],
      }),
    ],
    providers: [{ provide: LoggingService, useValue: MockService(LoggingService) }],
  });

  return { fixture };
};

describe('FormlyCheckboxComponent', () => {
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

    expect(fixture.nativeElement.querySelector('dsg-formly-checkbox').id).toBe('key-checkbox-field');
  });
  it.skip('should have asterisk in label when required is true', async () => {
    const { fixture } = await getFixtureByTemplate();

    expect(fixture.nativeElement.querySelector('span.mat-mdc-form-field-required-marker')).toBeTruthy();
  });
});
