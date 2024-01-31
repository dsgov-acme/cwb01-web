import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActiveTaskAction,
  CONFIRMATION_STEP_KEY,
  FormConfigurationModel,
  ITransactionActiveTask,
  TransactionMock,
  TransactionModel,
} from '@dsg/shared/data-access/work-api';
import { IStep, MarkAllControlsAsTouched, NuverialSnackBarService, TitleService, UnsavedStepModalReponses } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockProvider, MockService, ngMocks } from 'ng-mocks';
import { of, ReplaySubject, throwError } from 'rxjs';
import { FormRendererService } from '../../../services';
import { MockDefaultComponentProperties, MockDefaultFormlyModuleConfiguration, MockTemplate } from '../../../test';
import { FormStateMode, FormStateWorkflow, PublicPortalIntakeRendererOptions } from '../../forms';
import { FormlySimpleChoiceQuestionsComponent } from '../../simple-choice-questions';
import { FormlyTextInputComponent } from '../../text-input';
import { FormlyStepFieldProperties } from './formly-step.model';
import { FormlyStepsComponent } from './formly-steps.component';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  disconnect: jest.fn(),
  observe: jest.fn(),
  unobserve: jest.fn(),
}));

const mockModel = {
  firstName: 'George',
};

const mockPartialFields = [
  {
    components: [
      {
        key: 'step1.firstName',
        props: {
          label: 'First Name',
          placeholder: 'Enter first name',
        },
        type: 'nuverialTextInput',
      },
    ],
    props: {
      label: 'Step 1',
      stepKey: 'step1',
    },
  },
  {
    components: [
      {
        key: 'flatKey',
        props: {
          label: 'flat',
          required: true,
        },
        type: 'nuverialTextInput',
      },
      {
        key: 'step2.lastName',
        props: {
          label: 'Last Name',
          placeholder: 'Enter last name',
          required: true,
        },
        type: 'nuverialTextInput',
      },
      {
        key: 'step2.someBooleanQuestion',
        props: {
          formErrorLabel: 'a custom label',
          label: 'radio card',
          radioCardGroupLegend: 'a legend',
          radioCards: [
            {
              title: 'Yes',
              value: 'yes',
            },
            {
              title: 'No',
              value: 'no',
            },
          ],
          required: true,
        },
        type: 'nuverialRadioCards',
      },
    ],
    props: {
      label: 'Step 2',
      stepKey: 'step2',
    },
  },
  {
    components: [],
    expressions: {
      // hide: '!model.country',
      ['props.disabled']: '!model.country',
    },
    props: {
      label: 'Step 3',
      stepKey: CONFIRMATION_STEP_KEY,
    },
  },
];

const STEPS: IStep[] = [
  { label: 'Step 1', stepKey: 'step1' },
  { label: 'Step 2', stepKey: 'step2' },
  { label: 'Step 3', stepKey: 'step3' },
];

const mockFields = [
  {
    className: 'flex-full',
    components: [...mockPartialFields],
    type: 'nuverialSteps',
  },
];

const fieldMock = {
  fieldGroup: [
    { hide: false, props: { stepKey: STEPS[0].stepKey } },
    { hide: true, props: { stepKey: STEPS[1].stepKey } },
    { hide: false, props: { stepKey: STEPS[2].stepKey } },
  ],
};

const submitButtonLabel = 'Submit Test';

const mockSubmitAction: ActiveTaskAction = {
  key: 'SubmitTest',
  uiClass: 'Primary',
  uiLabel: submitButtonLabel,
};

const mockSubmitActiveTask: ITransactionActiveTask = {
  actions: [mockSubmitAction],
  key: 'digitalintaketest',
  name: 'Digital Intake Test',
};

const transactionModelMock = new TransactionModel(TransactionMock);
const mockConfigurationModel = new FormConfigurationModel(mockFields);
let transaction: ReplaySubject<TransactionModel>;

const getFixtureByTemplate = async (props?: Record<string, unknown>) => {
  transaction = new ReplaySubject(1);
  transaction.next(transactionModelMock);

  const template = MockTemplate;
  const { fixture } = await render(template, {
    componentProperties: {
      ...MockDefaultComponentProperties,
      fields: mockConfigurationModel.toFormlyJson(),
      model: mockModel,
      options: {
        ...PublicPortalIntakeRendererOptions,
        formState: {
          ...PublicPortalIntakeRendererOptions.formState,
        },
      },
      ...props,
    },
    imports: [
      ReactiveFormsModule,
      FormlyModule.forRoot({
        ...MockDefaultFormlyModuleConfiguration,
        types: [
          { component: FormlyStepsComponent, name: 'nuverialSteps' },
          { component: FormlyTextInputComponent, name: 'nuverialTextInput' },
          { component: FormlySimpleChoiceQuestionsComponent, name: 'nuverialRadioCards' },
        ],
      }),
    ],
    providers: [
      {
        provide: LoggingService,
        useValue: MockService(LoggingService),
      },
      MockProvider(Router, {
        navigate: jest.fn(),
      }),
      MockProvider(LoggingService),
      {
        provide: ActivatedRoute,
        useValue: mockActivatedRoute,
      },
      MockProvider(NuverialSnackBarService),
      MockProvider(FormRendererService, {
        formConfiguration: mockConfigurationModel,
        setFormErrors: jest.fn(),
        transaction: transactionModelMock,
        transaction$: transaction.asObservable(),
        updateTransaction$: jest.fn().mockImplementation(() => of(new TransactionModel(TransactionMock))),
      }),
      MockProvider(MatDialog, {
        open: jest.fn().mockReturnValue({
          afterClosed: () => of(UnsavedStepModalReponses.SaveAndcontinue),
        }),
      }),
      MockProvider(TitleService),
    ],
  });
  const component = fixture.debugElement.query(By.directive(FormlyStepsComponent)).componentInstance;

  return { component, fixture };
};

const mockActivatedRoute = {
  snapshot: {
    queryParams: {},
  },
};

const confirmationTestSetup = () => {
  mockActivatedRoute.snapshot = { queryParams: { resume: 'true' } };
  if (mockPartialFields.length > 1) {
    const fieldConfig: any = mockPartialFields[1];
    if (fieldConfig.components !== undefined) {
      for (const group of fieldConfig.components) {
        if (group.props !== undefined) {
          group.props.required = false;
        }
      }
    }
  }
};

const confirmationTestTeardown = () => {
  mockActivatedRoute.snapshot = { queryParams: {} };
  if (mockPartialFields.length > 1) {
    const fieldConfig: any = mockPartialFields[1];
    if (fieldConfig.components !== undefined) {
      for (const group of fieldConfig.components) {
        if (group.props !== undefined) {
          group.props.required = true;
        }
      }
    }
  }
};

describe('FormlyStepsComponent', () => {
  let router: Router;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      { teardown: { destroyAfterEach: false } }, // required in formly tests
    );

    router = TestBed.get(Router);
    router.initialNavigation();
  });

  it('should create', async () => {
    const { fixture } = await getFixtureByTemplate();

    expect(fixture).toBeTruthy();
  });

  it('should reset formState.mode on destroy', async () => {
    const { component } = await getFixtureByTemplate();
    component.formState.mode = FormStateMode.Review;
    component['initialFormStateMode'] = FormStateMode.Edit;

    component.ngOnDestroy();

    expect(component.formState.mode).toEqual(FormStateMode.Edit);
  });

  describe('Accessibility', () => {
    /**
     * Accessibility Mat Stepper test isn't passing because of a known bug with * Angular 15. https://github.com/angular/components/issues/26444  Skipping * this test for now
     */
    it.skip('should have no violations', async () => {
      const { fixture } = await getFixtureByTemplate({
        componentProperties: { steps: STEPS },
      });
      fixture.detectChanges();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should return active field groups', async () => {
    const { component } = await getFixtureByTemplate();

    component.field = {
      fieldGroup: [
        { hide: false, props: { stepKey: STEPS[0].stepKey } },
        { hide: true, props: { stepKey: STEPS[1].stepKey } },
        { hide: false, props: { stepKey: STEPS[2].stepKey } },
      ],
    };

    const activeFieldGroups = component.activeFieldGroups;

    expect(activeFieldGroups.length).toBe(2);
    expect(activeFieldGroups[0].props.stepKey).toBe(STEPS[0].stepKey);
    expect(activeFieldGroups[1].props.stepKey).toBe(STEPS[2].stepKey);
  });

  it('should check the step 1 elements are in the dom and step 2 elements are not in the dom', async () => {
    const { component, fixture } = await getFixtureByTemplate({
      componentProperties: { steps: STEPS },
    });

    fixture.detectChanges();

    const step1 = await screen.findAllByText('Step 1');
    expect(step1.at(1)).toBeInTheDocument();

    expect(await screen.findByText('First Name')).toBeInTheDocument();
    expect(screen.queryByText('Last Name')).toBeFalsy();
    expect(component.nuvStepper.stepper.selectedIndex).toEqual(0);
    expect(fixture.nativeElement.querySelector('mat-step:nth-of-type(1) active')).toBeFalsy();
  });

  it('should check the step 2 elements are in the dom and step 1 elements are not in the dom', async () => {
    mockActivatedRoute.snapshot = { queryParams: { resume: 'true' } };

    const { component, fixture } = await getFixtureByTemplate({
      componentProperties: { steps: STEPS },
    });

    fixture.detectChanges();

    const step2 = await screen.findAllByText('Step 2');
    expect(step2.at(1)).toBeInTheDocument();

    expect(await screen.findByText('Last Name')).toBeInTheDocument();
    expect(component.nuvStepper.stepper.selectedIndex).toEqual(1);
  });

  it('should check the confirmation step is in the the dom', async () => {
    confirmationTestSetup();

    const { component, fixture } = await getFixtureByTemplate({
      componentProperties: { steps: STEPS },
    });

    fixture.detectChanges();

    const step3 = await screen.findAllByText('Step 3');
    expect(step3.at(0)).toBeInTheDocument();

    expect(component.nuvStepper.stepper.selectedIndex).toEqual(2);

    // restoring default config for all other tests
    confirmationTestTeardown();
  });

  it('should update the html title onInit to contain the initial step label', async () => {
    const { component } = await getFixtureByTemplate();

    const formRendererService = ngMocks.findInstance(FormRendererService);
    const titleService = ngMocks.findInstance(TitleService);

    const transactionName = formRendererService.transaction.transactionDefinitionName;
    const stepField: FormlyFieldConfig<FormlyStepFieldProperties> = component.field.fieldGroup?.[component.nuvStepper.stepper.selectedIndex] || {};
    const titleSpy = jest.spyOn(titleService, 'setHtmlTitle');

    component.ngOnInit();

    expect(titleSpy).toHaveBeenCalledWith(`${transactionName} - ${stepField?.props?.label}`);
  });

  describe('_saveTransaction', () => {
    it('should save transaction', fakeAsync(async () => {
      const { component } = await getFixtureByTemplate();
      const service = ngMocks.findInstance(FormRendererService);

      MarkAllControlsAsTouched(component.field.fieldGroup[1].form);

      expect(component.field.fieldGroup[1].form.touched).toBeTruthy();
      expect(component.field.fieldGroup[1].form.valid).toBeFalsy();

      jest.spyOn(service, 'updateTransaction$');
      jest.spyOn(service, 'resetFormErrors');

      component._saveTransaction().subscribe(() => {
        expect(service.resetFormErrors).toHaveBeenCalled();
        expect(service.updateTransaction$).toHaveBeenCalled();
      });
      expect(component.nuvStepper.stepper.selectedIndex).toEqual(0);

      expect(component.steps[component.nuvStepper.stepper.selectedIndex].state).toEqual('SAVED');
      expect(component.steps[component.nuvStepper.stepper.selectedIndex + 1].state).toEqual('UNLOCKED');
      tick(1000);
    }));
    it('should save transaction and update state as "SAVED" when on the last step', fakeAsync(async () => {
      const { component } = await getFixtureByTemplate();
      const service = ngMocks.findInstance(FormRendererService);

      component.nuvStepper.stepper.selectedIndex = component.steps.length - 1;
      component.steps[component.nuvStepper.stepper.selectedIndex].state = 'SAVED';

      jest.spyOn(service, 'updateTransaction$');
      jest.spyOn(service, 'resetFormErrors');

      component._saveTransaction().subscribe(() => {
        expect(service.resetFormErrors).toHaveBeenCalled();
        expect(service.updateTransaction$).toHaveBeenCalled();
      });

      expect(component.steps[component.nuvStepper.stepper.selectedIndex].state).toEqual('SAVED');
      tick(1000);
    }));

    it('should save transaction and update state as "UNLOCKED" when on the last step and previous step is complete', fakeAsync(async () => {
      const { component } = await getFixtureByTemplate();
      const service = ngMocks.findInstance(FormRendererService);

      component.nuvStepper.stepper.selectedIndex = component.steps.length - 2;
      component.steps[component.nuvStepper.stepper.selectedIndex].state = 'SAVED';

      jest.spyOn(service, 'updateTransaction$');
      jest.spyOn(service, 'resetFormErrors');

      component._saveTransaction().subscribe(() => {
        expect(service.resetFormErrors).toHaveBeenCalled();
        expect(service.updateTransaction$).toHaveBeenCalled();
      });

      expect(component.steps[component.nuvStepper.stepper.selectedIndex].state).toEqual('SAVED');
      expect(component.steps[component.nuvStepper.stepper.selectedIndex + 1].state).toEqual('UNLOCKED');

      tick(1000);
    }));
  });

  describe('saveTransaction', () => {
    it('should handle errors', async () => {
      const { component } = await getFixtureByTemplate();
      const service = ngMocks.findInstance(FormRendererService);
      jest.spyOn(service, 'updateTransaction$').mockImplementation(() => {
        return throwError(() => ({
          error: {
            formioValidationErrors: [
              {
                controlName: 'personalInformation.email',
                errorName: 'email',
                label: 'Email',
              },
            ],
          },
        }));
      });
      jest.spyOn(service, 'setFormErrors');

      component._saveTransaction().subscribe(() => {
        expect(service.setFormErrors).toHaveBeenCalled();
      });
    });

    it('should handle errors that are not of type formioValidationErrors', async () => {
      const { component } = await getFixtureByTemplate();
      const service = ngMocks.findInstance(FormRendererService);
      const snackbarService = ngMocks.findInstance(NuverialSnackBarService);

      jest.spyOn(service, 'updateTransaction$').mockImplementation(() =>
        throwError(() => {
          'notFormioError';
        }),
      );
      jest.spyOn(snackbarService, 'notifyApplicationError');

      component._saveTransaction().subscribe(() => {
        expect(service.setFormErrors).toHaveBeenCalled();
        expect(snackbarService.notifyApplicationError).toHaveBeenCalled();
      });
    });

    it.skip('should route to dashboard', async () => {
      const { component } = await getFixtureByTemplate();
      const spy = jest.spyOn(router, 'navigate');
      component._saveTransaction();
      expect(spy).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('onSave', () => {
    it('previous should decrement selectedIndex', async () => {
      const { component, fixture } = await getFixtureByTemplate();

      component.nuvStepper.stepper.selectedIndex = 1;
      fixture.detectChanges();
      component.returnToReviewStep = false;
      component.onSave('previous');
      fixture.detectChanges();
      expect(component.nuvStepper.stepper.selectedIndex).toEqual(0);
    });

    it('previous should return to review', async () => {
      const { component, fixture } = await getFixtureByTemplate();

      component.nuvStepper.stepper.selectedIndex = 1;
      fixture.detectChanges();
      component.returnToReviewStep = true;
      component.onSave('previous');
      fixture.detectChanges();
      expect(component.nuvStepper.stepper.selectedIndex).toEqual(1);
    });

    it('next should increment activeStep, because the step is valid', async () => {
      const { component } = await getFixtureByTemplate();

      component.form.get('step1').status = 'VALID';
      component.nuvStepper.stepper.selectedIndex = 0;
      component.onSave('next');

      expect(component.nuvStepper.stepper.selectedIndex).toEqual(1);
    });

    it('next should return to review if the step is valid', async () => {
      const { component } = await getFixtureByTemplate();

      const spy = jest.spyOn(component, '_goToFirstInvalidStep');

      component.form.get('step1').status = 'VALID';
      component.returnToReviewStep = true;
      component.nuvStepper.stepper.selectedIndex = 0;
      component.onSave('next');

      expect(component.nuvStepper.stepper.selectedIndex).toEqual(1);
      expect(spy).toHaveBeenCalled();
    });

    it('next should not increment activeStep if step is invalid', async () => {
      const { component } = await getFixtureByTemplate();

      jest.spyOn(component, '_getAllControlsFromStep').mockImplementation(() => {
        const form = new FormGroup({
          test: new FormControl({ required: true }),
        });

        form.controls['test'].setErrors({ required: true });

        return form;
      });

      component.nuvStepper.stepper.selectedIndex = 0;
      component.onSave('next');

      expect(component.nuvStepper.stepper.selectedIndex).toEqual(0);
    });

    it('should go to a specific step if this is provided', async () => {
      const { component } = await getFixtureByTemplate();

      component.nuvStepper.stepper.selectedIndex = 1;

      component.form.get('step1').status = 'VALID';
      component.form.get('step2').status = 'VALID';
      const stepField: FormlyFieldConfig<FormlyStepFieldProperties> = component.field.fieldGroup?.[component.nuvStepper.stepper.selectedIndex] || {};
      const stepForm = component._getAllControlsFromStep(stepField);
      Object.values(stepForm.controls).forEach((control: any) => {
        if (control instanceof FormControl) {
          control.markAsTouched();
          control.setErrors(null);
        }
      });

      component.onSave('stepChange', 0);

      expect(component.nuvStepper.stepper.selectedIndex).toEqual(0);
    });

    it('should handle form errors', async () => {
      const { component } = await getFixtureByTemplate();
      const service = ngMocks.findInstance(FormRendererService);
      jest.spyOn(service, 'setFormErrors');

      component.nuvStepper.stepper.selectedIndex = 1;
      component.onSave('next');

      expect(service.setFormErrors).toBeCalledWith([
        {
          controlName: 'flatKey',
          errorName: 'required',
          id: 'flatKey-field',
          label: 'flat',
        },
        {
          controlName: 'step2.lastName',
          errorName: 'required',
          id: 'step2.lastName-field',
          label: 'Last Name',
        },
        {
          controlName: 'step2.someBooleanQuestion',
          errorName: 'required',
          id: 'step2.someBooleanQuestion-field',
          label: 'a custom label',
        },
      ]);
    });

    it('should route to submitted view, after submission when form is valid', async () => {
      const { component } = await getFixtureByTemplate();
      const myRouter = ngMocks.findInstance(Router);
      const route = ngMocks.findInstance(ActivatedRoute);
      const spy = jest.spyOn(myRouter, 'navigate');

      component.steps.forEach((step: IStep) => {
        if (!step.form) return;

        jest.spyOn(step.form, 'valid', 'get').mockReturnValue(true);
      });

      component.onSave('complete');

      expect(spy).toHaveBeenCalledWith(['submitted'], { relativeTo: route });
    });

    it('should not route to dashboard, after submission when form is invalid', async () => {
      const { component } = await getFixtureByTemplate();
      const myRouter = ngMocks.findInstance(Router);
      const spy = jest.spyOn(myRouter, 'navigate');

      component.steps.forEach((step: IStep) => {
        if (!step.form) return;

        jest.spyOn(step.form, 'valid', 'get').mockReturnValue(false);
      });

      component.onSave('complete');

      expect(spy).not.toHaveBeenCalled();
    });

    it('should mark form as dirty', async () => {
      const { component, fixture } = await getFixtureByTemplate();

      const handleFormErrorsSpy = jest.spyOn(component, '_handleFormErrors');

      component.nuvStepper.stepper.selectedIndex = 1;
      component.onSave('next');
      fixture.detectChanges();

      expect(handleFormErrorsSpy).toHaveBeenCalled();
      expect(fixture.nativeElement.querySelector(`#step2\\.lastName-field`)).toHaveTextContent('Required');
      expect(fixture.nativeElement.querySelector(`#flatKey-field`)).toHaveTextContent('Required');
    });

    it('should handle form errors and mark as dirty on validate', async () => {
      const { component, fixture } = await getFixtureByTemplate();

      const service = ngMocks.findInstance(FormRendererService);
      const handleFormErrorsSpy = jest.spyOn(component, '_handleFormErrors');

      component.nuvStepper.stepper.selectedIndex = 1;
      component.onSave('validate');
      fixture.detectChanges();

      expect(handleFormErrorsSpy).toHaveBeenCalled();
      expect(fixture.nativeElement.querySelector(`#step2\\.lastName-field`)).toHaveTextContent('Required');
      expect(fixture.nativeElement.querySelector(`#flatKey-field`)).toHaveTextContent('Required');
      expect(service.setFormErrors).toBeCalledWith([
        {
          controlName: 'flatKey',
          errorName: 'required',
          id: 'flatKey-field',
          label: 'flat',
        },
        {
          controlName: 'step2.lastName',
          errorName: 'required',
          id: 'step2.lastName-field',
          label: 'Last Name',
        },
        {
          controlName: 'step2.someBooleanQuestion',
          errorName: 'required',
          id: 'step2.someBooleanQuestion-field',
          label: 'a custom label',
        },
      ]);
    });

    it('should update the step hidden on stepChange', async () => {
      const { component } = await getFixtureByTemplate({
        componentProperties: { steps: STEPS },
      });

      component.field = fieldMock;

      component.onSave('next');
      expect(component.steps[1].hidden).toBe(true);
    });
  });

  describe('activeStep', () => {
    it('should set formState on confirmationStep', async () => {
      const { component, fixture } = await getFixtureByTemplate();

      component.formState.mode = FormStateMode.Edit;
      component._initialFormStateMode = FormStateMode.Edit;
      component.isConfirmationStep = false;
      component.updateMode(STEPS.length - 1);
      fixture.detectChanges();

      expect(component.stepperMode).toEqual(FormStateMode.Edit);
      expect(component.formState.mode).toEqual(FormStateMode.Review);
      expect(component.isConfirmationStep).toBeTruthy();
      expect(component.returnToReviewStep).toBeFalsy();
    });

    it('should set formState on step other than confirmationStep', async () => {
      // call update mode function, change step 3 step key to confirmation step key
      const { component, fixture } = await getFixtureByTemplate();

      component.formState.mode = FormStateMode.Edit;
      component._initialFormStateMode = FormStateMode.Edit;
      component.formState.formWorkflow = FormStateWorkflow.PublicPortal;
      component.isConfirmationStep = true;
      component.updateMode(1);
      fixture.detectChanges();

      expect(component.formState.mode).toEqual(FormStateMode.Edit);
      expect(component.stepperMode).toEqual('edit');
      expect(component.formWorkflow).toEqual('public-portal');
      expect(component.isConfirmationStep).toBeFalsy();
      expect(component.returnToReviewStep).toBeFalsy();
    });

    it('should update the html title on step to contain the step label', async () => {
      const { component, fixture } = await getFixtureByTemplate();

      const titleService = ngMocks.findInstance(TitleService);
      const titleSpy = jest.spyOn(titleService, 'setHtmlTitle');

      component.updateMode(1);

      const stepField: FormlyFieldConfig<FormlyStepFieldProperties> = component.field.fieldGroup?.[1] || {};

      const formRendererService = ngMocks.findInstance(FormRendererService);
      const transactionName = formRendererService.transaction.transactionDefinitionName;

      fixture.detectChanges();
      expect(titleSpy).toHaveBeenCalledWith(`${transactionName} - ${stepField?.props?.label}`);
    });
  });

  describe('confirmationPanelList', () => {
    it('should set confirmationPanelList', async () => {
      const { component } = await getFixtureByTemplate();

      const confirmationPanelListMock = [
        { expanded: true, id: 'step1', panelTitle: 'Step 1' },
        { expanded: true, id: 'step2', panelTitle: 'Step 2' },
      ];

      expect(component.confirmationPanelList).toEqual(confirmationPanelListMock);
    });
  });

  describe('reviewModePanelList', () => {
    it('should set reviewModePanelList', async () => {
      const { component } = await getFixtureByTemplate();

      const reviewModePanelListMock = [
        { expanded: true, id: 'step1', panelTitle: 'Step 1' },
        { expanded: true, id: 'step2', panelTitle: 'Step 2' },
        { expanded: true, id: 'confirmation', panelTitle: 'Step 3' },
      ];

      expect(component.reviewModePanelList).toEqual(reviewModePanelListMock);
    });
  });

  describe('goToStep', () => {
    it('should set mat stepper index and returnToReviewStep', async () => {
      confirmationTestSetup();
      const { component, fixture } = await getFixtureByTemplate({
        componentProperties: { steps: STEPS },
      });
      const transactionModelWithSubmit = new TransactionModel({ ...transactionModelMock, activeTasks: [mockSubmitActiveTask] });
      transaction.next(transactionModelWithSubmit);
      const updateModeByStepSpy = jest.spyOn(component, 'updateModeByStep');
      fixture.detectChanges();

      component.goToStepByKey('step2');
      fixture.detectChanges();

      expect(component.nuvStepper.stepper.selectedIndex).toEqual(1);
      expect(updateModeByStepSpy).toHaveBeenCalled();
      expect(component.returnToReviewStep).toBeTruthy();

      confirmationTestTeardown();
    });
    it('should not go to step if the step does not exist', async () => {
      const { component, fixture } = await getFixtureByTemplate();
      component.nuvStepper.stepper.selectedIndex = 0;
      component.goToStepByKey('noStep');
      fixture.detectChanges();

      expect(component.nuvStepper.stepper.selectedIndex).toEqual(0);
    });
    it('should reset the model and call updateMode when select index changes', async () => {
      const { component, fixture } = await getFixtureByTemplate();
      const spyResetForm = jest.spyOn(component.options, 'resetModel');
      const spyUpdateMode = jest.spyOn(component, 'updateMode');
      component.nuvStepper.stepper.selectedIndex = 0;
      component.nuvStepper.stepper.selectedIndex = 1;
      fixture.detectChanges();

      expect(spyResetForm).toBeCalled();
      expect(spyUpdateMode).toBeCalledWith(1);
    });
    it('should call reset form when selectedIndex', async () => {
      const { component, fixture } = await getFixtureByTemplate();
      component.nuvStepper.stepper.selectedIndex = 0;
      component.goToStepByKey('noStep');
      fixture.detectChanges();

      expect(component.nuvStepper.stepper.selectedIndex).toEqual(0);
    });

    it('should create a formGroup from a step field', async () => {
      const { component } = await getFixtureByTemplate();
      const field: FormlyFieldConfig<FormlyStepFieldProperties> = component.field.fieldGroup?.[1];
      const form = component._getAllControlsFromStep(field);

      expect(form.status).toEqual('INVALID');
      expect(form.get('flatKey')).toBeTruthy();
      expect(form.controls['step2.lastName']).toBeTruthy();
    });
  });

  describe('_activeTaskActions', () => {
    it('should be empty', async () => {
      const { component } = await getFixtureByTemplate();

      expect(component._activeTaskActions).toEqual([]);
    });

    it('should have action from the activeTasks', async () => {
      const { component } = await getFixtureByTemplate();
      const transactionModelWithAction = new TransactionModel({ ...transactionModelMock, activeTasks: [mockSubmitActiveTask] });
      transaction.next(transactionModelWithAction);

      component.loadFooterActions$.subscribe(() => {
        expect(component._activeTaskActions).toEqual([mockSubmitAction]);
      });
    });
  });

  describe('footer action buttons', () => {
    it('should render only the save and continue button on the first step', async () => {
      const { component, fixture } = await getFixtureByTemplate({
        componentProperties: { steps: STEPS },
      });
      const transactionModelWithSubmit = new TransactionModel({ ...transactionModelMock, activeTasks: [mockSubmitActiveTask] });
      transaction.next(transactionModelWithSubmit);

      component.loadFooterActions$.subscribe(async () => {
        fixture.detectChanges();

        expect(await screen.findByText('Save & Continue')).toBeInTheDocument();
        expect(screen.queryByText('Back')).toBeFalsy();
        expect(screen.queryByText(submitButtonLabel)).toBeFalsy();
      });
    });

    it('should render the back button on any step other than the first', async () => {
      const { component, fixture } = await getFixtureByTemplate({
        componentProperties: { steps: STEPS },
      });
      const transactionModelWithSubmit = new TransactionModel({ ...transactionModelMock, activeTasks: [mockSubmitActiveTask] });
      transaction.next(transactionModelWithSubmit);

      component.loadFooterActions$.subscribe(async () => {
        fixture.detectChanges();

        // Check the first step
        expect(screen.queryByText('Back')).toBeFalsy();

        // Check middle step
        component.form.get('step1').status = 'VALID';
        component.nuvStepper.stepper.selectedIndex = 0;
        component.onSave('next');
        fixture.detectChanges();

        expect(await screen.findByText('Back')).toBeInTheDocument();

        // Check last step
        component.form.get('step2').status = 'VALID';
        component.nuvStepper.stepper.selectedIndex = 1;
        component.onSave('next');
        fixture.detectChanges();

        expect(await screen.findByText('Back')).toBeInTheDocument();
      });
    });

    // Write a test to check if the rightmost button is rendered as 'Submit' on the last step
    it('should render the submit button on the last step', async () => {
      confirmationTestSetup();

      const { component, fixture } = await getFixtureByTemplate({
        componentProperties: { steps: STEPS },
      });
      const transactionModelWithSubmit = new TransactionModel({ ...transactionModelMock, activeTasks: [mockSubmitActiveTask] });
      transaction.next(transactionModelWithSubmit);

      component.loadFooterActions$.subscribe(async () => {
        fixture.detectChanges();

        expect(component.nuvStepper.stepper.selectedIndex).toEqual(2);
        expect(await screen.findByText('Submit Test')).toBeInTheDocument();
      });

      confirmationTestTeardown();
    });
  });

  // Write three tests for each event 'next', previous', and 'complete' of onActionClick(event)
  describe('onActionClick', () => {
    it('should call onSave with next', async () => {
      const { component } = await getFixtureByTemplate();
      const spy = jest.spyOn(component, 'onSave');
      component.onActionClick('next');
      expect(spy).toHaveBeenCalledWith('next');
    });

    it('should call onSave with previous', async () => {
      const { component } = await getFixtureByTemplate();
      const spy = jest.spyOn(component, 'onSave');
      component.onActionClick('previous');
      expect(spy).toHaveBeenCalledWith('previous');
    });

    it('should call onSave with complete', async () => {
      const { component } = await getFixtureByTemplate();
      const spy = jest.spyOn(component, 'onSave');
      component.onActionClick('complete');
      expect(spy).toHaveBeenCalledWith('complete');
    });
  });

  describe('_validateStep', () => {
    it('should return false and handle form errors if the step form is invalid', async () => {
      const { component } = await getFixtureByTemplate();
      const stepForm = new FormGroup({
        firstName: new FormControl('John', Validators.required),
      });
      const stepField = {
        props: { stepKey: 'step1' },
      };

      jest.spyOn(component, '_getAllControlsFromStep').mockReturnValue(stepForm);
      jest.spyOn(component, '_handleFormErrors');
      jest.spyOn(component, '_updateHiddenSteps');

      stepForm.setErrors({ required: true });

      const result = component['_validateStep'](stepField);

      expect(result).toBe(false);
      expect(component['_handleFormErrors']).toHaveBeenCalledWith(stepField, stepForm);
      expect(component._updateHiddenSteps).not.toHaveBeenCalled();
    });

    it('should update the step form and hidden steps if the step form is valid', async () => {
      const { component } = await getFixtureByTemplate();
      const stepForm = new FormGroup({
        firstName: new FormControl('John', Validators.required),
      });
      const stepField = {
        props: { stepKey: 'step1' },
      };

      jest.spyOn(component, '_getAllControlsFromStep').mockReturnValue(stepForm);
      jest.spyOn(component, '_handleFormErrors');
      jest.spyOn(component, '_updateHiddenSteps');

      const result = component['_validateStep'](stepField);

      expect(result).toBe(true);
      expect(component._updateHiddenSteps).toHaveBeenCalled();
    });
  });

  describe('_partialSaveAndChangeStep', () => {
    const stepField = {
      props: { stepKey: 'step1' },
    };

    const formErrorElement = document.createElement('nuverial-form-errors');
    formErrorElement.appendChild(document.createElement('ul.form-errors-list'));
    it('should call focus() on form errors element if step is not valid', async () => {
      const { component } = await getFixtureByTemplate();
      const validatespy = jest.spyOn(component, '_validateStep').mockReturnValue(false);
      const focusSpy = jest.spyOn(formErrorElement, 'focus');
      const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue(formErrorElement);

      component['_partialSaveAndChangeStep'](stepField);

      expect(validatespy).toHaveBeenCalledWith(stepField);
      expect(querySelectorSpy).toHaveBeenCalledTimes(1);
      expect(querySelectorSpy).toHaveBeenCalledWith('nuverial-form-errors ul.form-errors-list');
      expect(focusSpy).toHaveBeenCalled();
      jest.restoreAllMocks();
    });

    it('should not call focus() if step is valid', async () => {
      const { component } = await getFixtureByTemplate();
      const validatespy = jest.spyOn(component, '_validateStep').mockReturnValue(true);
      const focusSpy = jest.spyOn(formErrorElement, 'focus');
      const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue(formErrorElement);

      component['_partialSaveAndChangeStep'](stepField);

      expect(validatespy).toHaveBeenCalledWith(stepField);
      expect(querySelectorSpy).not.toHaveBeenCalled();
      expect(focusSpy).not.toHaveBeenCalled();
      jest.restoreAllMocks();
    });
  });

  describe('test formly formatted control names', () => {
    it.each([
      ['personalInformationList[0].info[1].name', 'personalInformationList.0.info.1.name'],
      ['array[5].lastName', 'array.5.lastName'],
      ['some[10].currentAddress.addressLine1[4].street', 'some.10.currentAddress.addressLine1.4.street'],
      ['car.array1[9].text', 'car.array1.9.text'],
    ])('should format %s to %s', async (controlName, expected) => {
      const { component } = await getFixtureByTemplate();
      const result = component['_formlyFormatControlName'].call(component, controlName);
      expect(result).toBe(expected);
    });
  });
});
