import * as dragDrop from '@angular/cdk/drag-drop';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  ConfiguredEnumsMock,
  FormListMock,
  IFormSelectionRule,
  TransactionDefinitionMock,
  TransactionDefinitionModel,
  WorkApiRoutesService,
  WorkflowTaskMock,
} from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { INuverialSelectOption, NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingAdapter } from '@dsg/shared/utils/logging';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { FormConfigurationService } from '../form-configurations/form-configurations.service';
import { FormSelectionRuleTableData, FormSelectionRulesComponent } from './form-selection-rules.component';

// Trying to directly spy on moveItemInArray causes TypeError: Cannot redefine property: moveItemInArray.
// This may be because @angular/cdk/drag-drop re-exports a bunch of functions,
// so the compiler produces an object with only get properties,
// causing jest.spyOn to fail when it tries to replace it with a spy.
// See more: https://stackoverflow.com/questions/53162001/typeerror-during-jests-spyon-cannot-set-property-getrequest-of-object-which
jest.mock('@angular/cdk/drag-drop', () => {
  return {
    /* eslint-disable @typescript-eslint/naming-convention */
    __esModule: true,
    ...jest.requireActual('@angular/cdk/drag-drop'),
  };
});

const options: INuverialSelectOption[] = [
  { disabled: false, displayTextValue: 'Display Text 1', key: 'key1', selected: false },
  { disabled: false, displayTextValue: 'Display Text 2', key: 'key2', selected: false },
];

const formSelectionRuleMock: IFormSelectionRule = { context: 'context', formConfigurationKey: 'key', task: 'task', viewer: 'viewer' };

describe('FormSelectionRulesComponent', () => {
  let component: FormSelectionRulesComponent;
  let fixture: ComponentFixture<FormSelectionRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSelectionRulesComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        MockProvider(ChangeDetectorRef),
        MockProvider(NuverialSnackBarService),
        MockProvider(UserStateService),
        MockProvider(LoggingAdapter),
        MockProvider(FormConfigurationService, {
          formConfigurationsList$: of(FormListMock),
          getFormConfigurations$: jest.fn().mockImplementation(() => of(FormListMock)),
        }),
        MockProvider(WorkApiRoutesService, {
          getEnumerations$: jest.fn().mockImplementation(() => of(ConfiguredEnumsMock)),
          getWorkflowTasks$: jest.fn().mockImplementation(() => of([WorkflowTaskMock])),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSelectionRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.transactionDefinition = new TransactionDefinitionModel(TransactionDefinitionMock);
    });

    it('should initialize formSelectionRulesList and dataSourceTable', () => {
      component.ngOnInit();

      expect(component.formSelectionRulesList).toEqual(component.transactionDefinition.formConfigurationSelectionRules);
      expect(component.dataSourceTable).toBeInstanceOf(MatTableDataSource);
    });

    it('should call the necessary methods', () => {
      const getWorkflowTasksSpy = jest.spyOn(component['_workApiRoutesService'], 'getWorkflowTasks$');
      const getEnumerationsSpy = jest.spyOn(component['_workApiRoutesService'], 'getEnumerations$');
      const getFormConfigurationsSpy = jest.spyOn(component['_formConfigurationService'], 'getFormConfigurations$');
      const notifyApplicationErrorSpy = jest.spyOn(component['_nuverialSnackBarService'], 'notifyApplicationError');

      component.ngOnInit();

      expect(getWorkflowTasksSpy).toHaveBeenCalledWith(component.transactionDefinition.processDefinitionKey);
      expect(getEnumerationsSpy).toHaveBeenCalled();
      expect(getFormConfigurationsSpy).toHaveBeenCalledWith(component.transactionDefinition.key);
      expect(notifyApplicationErrorSpy).toHaveBeenCalledTimes(0);
    });
  });

  it('should create a new form selection rule', () => {
    const initialFormSelectionRulesListLength = component.formSelectionRulesList.length;
    const ruleFormGroup = component.form.get('rules') as FormArray;
    const initialRuleFormGroupLength = ruleFormGroup.length;

    component.createNewFormSelectionRule();

    expect(component.formSelectionRulesList.length).toBe(initialFormSelectionRulesListLength + 1);
    expect(ruleFormGroup.length).toBe(initialRuleFormGroupLength + 1);
    expect(component.dataSourceTable.data).toEqual(component.formSelectionRulesList);
  });

  it('should return the index of the element in formSelectionRulesList', () => {
    component.formSelectionRulesList = [formSelectionRuleMock];
    const element = component.formSelectionRulesList[0];
    const index = component.getIndex(element);
    expect(index).toBe(0);
  });

  it('should return -1 if the element is not in formSelectionRulesList', () => {
    const element: IFormSelectionRule = formSelectionRuleMock;
    const index = component.getIndex(element);
    expect(index).toBe(-1);
  });

  it('should return the display text of the selected option', () => {
    component.form = new FormGroup({
      rules: new FormArray([
        new FormGroup({
          formConfigurationKey: new FormControl(null),
        }),
      ]),
    });

    const formControlIndex = 0;
    const element = 'formConfigurationKey';
    const formArray = component.form.get('rules') as FormArray;
    formArray.controls[formControlIndex].setValue({ [element]: 'key1' });

    const displayText = component.getDisplayText(formControlIndex, element, options);
    expect(displayText).toBe('Display Text 1');
  });

  it('should return the key if no options are provided', () => {
    component.form = new FormGroup({
      rules: new FormArray([
        new FormGroup({
          formConfigurationKey: new FormControl(null),
        }),
      ]),
    });

    const formControlIndex = 0;
    const element = 'formConfigurationKey';
    const formArray = component.form.get('rules') as FormArray;
    formArray.controls[formControlIndex].patchValue({ [element]: 'key1' });

    const displayText = component.getDisplayText(formControlIndex, element);
    expect(displayText).toBe('key1');
  });

  it('should return null if the selected option is not found', () => {
    component.form = new FormGroup({
      rules: new FormArray([
        new FormGroup({
          formConfigurationKey: new FormControl(null),
        }),
      ]),
    });

    const formControlIndex = 0;
    const element = 'formConfigurationKey';
    const formArray = component.form.get('rules') as FormArray;
    formArray.controls[formControlIndex].patchValue({});

    const displayText = component.getDisplayText(formControlIndex, element);
    expect(displayText).toBe(null);
  });

  it('should move item in formSelectionRulesList and form controls on drop and call updateValueAndValidity', () => {
    const event = {
      container: { data: jest.fn() } as any,
      currentIndex: 1,
      distance: { x: 0, y: 0 },
      isPointerOverContainer: true,
      item: { data: jest.fn() } as any,
      previousContainer: { data: jest.fn() } as any,
      previousIndex: 0,
    };

    const spy = jest.spyOn(dragDrop, 'moveItemInArray');

    const formArray = component.form.get('rules') as FormArray;
    const updateValueAndValiditySpy = jest.spyOn(formArray, 'updateValueAndValidity');

    component.drop(event as CdkDragDrop<string, string, string>);

    expect(spy).toHaveBeenCalledWith(component.formSelectionRulesList, event.previousIndex, event.currentIndex);
    expect(spy).toHaveBeenCalledWith(formArray.controls, event.previousIndex, event.currentIndex);
    expect(updateValueAndValiditySpy).toHaveBeenCalled();
  });

  it('should toggle editing of the element', () => {
    const element: FormSelectionRuleTableData = formSelectionRuleMock;
    element.editing = false;

    component.toggleEditing(element);

    expect(element.editing).toBe(true);
  });

  it('should return the index for trackByFn', () => {
    const index = 0;
    const result = component.trackByFn(index);
    expect(result).toBe(index);
  });
});

describe('FormSelectionRulesComponentFailed', () => {
  let component: FormSelectionRulesComponent;
  let fixture: ComponentFixture<FormSelectionRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSelectionRulesComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        MockProvider(ChangeDetectorRef),
        MockProvider(NuverialSnackBarService),
        MockProvider(UserStateService),
        MockProvider(LoggingAdapter),
        MockProvider(FormConfigurationService, {
          formConfigurationsList$: of(FormListMock),
          getFormConfigurations$: jest.fn().mockImplementation(() => of(FormListMock)),
        }),
        MockProvider(WorkApiRoutesService, {
          getEnumerations$: jest.fn().mockImplementation(() => of(ConfiguredEnumsMock)),
          getWorkflowTasks$: jest.fn().mockImplementation(() => throwError(() => new Error('an error'))),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSelectionRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.transactionDefinition = new TransactionDefinitionModel(TransactionDefinitionMock);
  });

  it('should notify failure if anything loading data fails', () => {
    const notifyApplicationErrorSpy = jest.spyOn(component['_nuverialSnackBarService'], 'notifyApplicationError');

    component.formData$.subscribe();

    expect(fixture.nativeElement.querySelector('nuverial-spinner')).toBeFalsy();
    expect(notifyApplicationErrorSpy).toHaveBeenCalledWith('Error loading Form Selection Rules');
  });
});
