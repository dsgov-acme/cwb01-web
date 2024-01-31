import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { axe } from 'jest-axe';
import { MockDefaultComponentProperties, MockDefaultFormlyModuleConfiguration, MockTemplate } from '../../../test';
import { FormStateMode } from '../../forms';
import { FormlyTextInputComponent } from './formly-text-input.component';

const mockModel = {
  firstName: 'George',
  phone: '5557763322',
};

const mockFields: FormlyFieldConfig[] = [
  {
    key: 'firstName',
    props: {
      label: 'First Name',
      placeholder: 'Enter first name',
      required: true,
    },
    type: 'nuverialTextInput',
  },
  {
    key: 'phone',
    props: {
      label: 'Phone',
      mask: '(000) 000-0000',
      required: true,
    },
    type: 'nuverialTextInput',
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
        types: [{ component: FormlyTextInputComponent, name: 'nuverialTextInput' }],
      }),
    ],
  });
  const component = fixture.debugElement.query(By.directive(FormlyTextInputComponent)).componentInstance;
  component.formState.mode = FormStateMode.Edit;

  return { component, fixture };
};

describe('FormlyTextInputComponent', () => {
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

  it('should verify edit mode field matches input', async () => {
    const { component, fixture } = await getFixtureByTemplate();

    component.formState.mode = FormStateMode.Edit;
    fixture.detectChanges();

    const model = {
      firstName: 'George',
      phone: '(555) 776-3322',
    };

    expect(screen.getByDisplayValue(model.firstName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(model.firstName)).toBeInTheDocument();
  });

  it('should verify review mode field matches input', async () => {
    const { component, fixture } = await getFixtureByTemplate();

    component.formState.mode = FormStateMode.Review;
    fixture.detectChanges();

    const model = {
      firstName: 'George',
      phone: '(555) 776-3322',
    };

    expect(screen.getByText(model.firstName)).toBeInTheDocument();
    expect(screen.getByText(model.phone)).toBeInTheDocument();
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

    expect(fixture.nativeElement.querySelector('dsg-formly-text-input').id).toBe('firstName-field');
  });

  it('should have asterisk in label when required is true', async () => {
    const { fixture } = await getFixtureByTemplate();
    expect(fixture.nativeElement.querySelector('span.ng-star-inserted')).toBeTruthy();
  });
});
