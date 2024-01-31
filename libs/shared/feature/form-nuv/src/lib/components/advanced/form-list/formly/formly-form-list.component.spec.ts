import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { ngMocks } from 'ng-mocks';
import { MockDefaultComponentProperties, MockDefaultFormlyModuleConfiguration, MockTemplate } from '../../../../test';
import { FormStateMode } from '../../../forms';
import { FormlyTextInputComponent } from '../../../text-input';
import { FormlyFormListComponent } from './formly-form-list.component';

const mockModel = {
  demo: [
    {
      firstName: 'George',
      lastName: 'Lucas',
      ssn: '123-45-6789',
    },
  ],
};

const mockFields: FormlyFieldConfig[] = [
  {
    className: 'flex-full',
    fieldGroup: [
      {
        className: 'flex-half',
        key: 'firstName',
        props: {
          label: 'First name',
          required: true,
          type: 'text',
        },
        type: 'nuverialTextInput',
      },
      {
        className: 'flex-half',
        key: 'lastName',
        props: {
          label: 'Last name',
          required: true,
          type: 'text',
        },
        type: 'nuverialTextInput',
      },
      {
        className: 'flex-half',
        key: 'ssn',
        props: {
          label: 'SSN',
          required: true,
          type: 'text',
        },
        type: 'nuverialTextInput',
      },
    ],
    key: 'demo',
    props: {
      addItemLabel: 'Add another',
      includeIndex: true,
      includeLabel: true,
      includeRemoveItemAction: true,
      label: 'Form list',
      removeItemLabel: 'Remove',
    },
    type: 'nuverialFormList',
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
        types: [
          { component: FormlyFormListComponent, name: 'nuverialFormList' },
          { component: FormlyTextInputComponent, name: 'nuverialTextInput' },
        ],
      }),
    ],
  });
  const component = fixture.debugElement.query(By.directive(FormlyFormListComponent)).componentInstance;
  component.formState.mode = FormStateMode.Edit;

  return { component, fixture };
};

describe('FormlyFormListComponent', () => {
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
      lastName: 'Lucas',
      ssn: '123-45-6789',
    };

    const firstNameInput = screen.getByDisplayValue(model.firstName);
    const lastNameInput = screen.getByDisplayValue(model.lastName);
    const ssnInput = screen.getByDisplayValue(model.ssn);

    expect(firstNameInput).toHaveValue(model.firstName);
    expect(lastNameInput).toHaveValue(model.lastName);
    expect(ssnInput).toHaveValue(model.ssn);
  });

  it('should verify review mode field matches input', async () => {
    const { component, fixture } = await getFixtureByTemplate();

    component.formState.mode = FormStateMode.Review;
    fixture.detectChanges();

    const model = {
      firstName: 'George',
      lastName: 'Lucas',
      ssn: '123-45-6789',
    };

    expect(screen.getByText(model.firstName)).toBeInTheDocument();
    expect(screen.getByText(model.lastName)).toBeInTheDocument();
    expect(screen.getByText(model.ssn)).toBeInTheDocument();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { fixture } = await getFixtureByTemplate();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should add and remove items when the add or remove actions are clicked', async () => {
    const { fixture, component } = await getFixtureByTemplate();
    const addItemElement = ngMocks.find(fixture, '.add-item__link');

    expect(component.model.length).toEqual(1);

    ngMocks.click(addItemElement);
    fixture.detectChanges();

    expect(component.model.length).toEqual(2);

    const removeItemElement = ngMocks.find(fixture, '.remove-item__link:last-of-type');

    ngMocks.click(removeItemElement);
    fixture.detectChanges();

    expect(component.model.length).toEqual(1);
  });
});
