import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import {
  SchemaDefinitionListMock,
  SchemaDefinitionListSchemaMock,
  TransactionDefinitionMock,
  TransactionDefinitionMock2,
  TransactionDefinitionModel,
  TransactionDefinitionModelMock,
  WorkApiRoutesService,
  WorkflowListSchemaMock,
} from '@dsg/shared/data-access/work-api';
import { NuverialCrudActions, NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { Subject, of, throwError } from 'rxjs';
import { TransactionDefinitionsFormComponent } from './transaction-definitions-form.component';
import { TransactionDefinitionsFormService } from './transaction-definitions-form.service';

describe('TransactionDefinitionsFormComponent', () => {
  let component: TransactionDefinitionsFormComponent;
  let fixture: ComponentFixture<TransactionDefinitionsFormComponent>;
  let activatedRouteSpy: { snapshot: any; paramMap: any };
  const transactionDefinitionKey = 'transactionDefinitionKey';

  beforeEach(async () => {
    activatedRouteSpy = {
      paramMap: new Subject(),
      snapshot: {
        queryParams: convertToParamMap({
          pageNumber: 3,
          pageSize: 10,
          sortBy: 'key',
          sortOrder: 'ASC',
        }),
      },
    };

    await TestBed.configureTestingModule({
      imports: [TransactionDefinitionsFormComponent, NoopAnimationsModule],
      providers: [
        MockProvider(LoggingService),
        MockProvider(Router),
        MockProvider(NuverialSnackBarService),
        {
          provide: ActivatedRoute,
          useValue: activatedRouteSpy,
        },
        MockProvider(WorkApiRoutesService, {
          createTransactionDefinition$: jest.fn().mockImplementation(() => of(TransactionDefinitionMock)),
          getSchemaDefinitionsList$: jest.fn().mockImplementation(() => of(SchemaDefinitionListSchemaMock)),
          getTransactionDefinitionByKey$: jest.fn().mockImplementation(() => of(null)),
          getWorkflowsList$: jest.fn().mockImplementation(() => of(WorkflowListSchemaMock)),
          updateTransactionDefinition$: jest.fn().mockImplementation(() => of(TransactionDefinitionMock)),
        }),
        MockProvider(TransactionDefinitionsFormService, {
          loadSchemas$: jest.fn().mockImplementation(() => of(SchemaDefinitionListSchemaMock)),
          schemas$: of(SchemaDefinitionListMock),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDefinitionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return schema types', () => {
    component.schemaOptions$.subscribe(schemaOptions => {
      expect(schemaOptions).toEqual(SchemaDefinitionListSchemaMock);
    });
  });

  it('should return workflow types', () => {
    component.workflowOptions$.subscribe(workflowOptions => {
      expect(workflowOptions).toEqual(WorkflowListSchemaMock);
    });
  });

  it('should call getSchemasList$ when handleSearchSchema is called with a non-empty string', () => {
    const search = 'test';
    const filters = [
      { field: 'key', value: search },
      { field: 'name', value: search },
    ];
    const getSchemasListSpy = jest.spyOn(component, 'getSchemasList$');

    component.handleSearchSchema(search);

    expect(getSchemasListSpy).toHaveBeenCalledWith(filters);
  });

  it('should not call getSchemasList$ when handleSearchSchema is called with an empty string', () => {
    const search = '';
    const getSchemasListSpy = jest.spyOn(component, 'getSchemasList$');

    component.handleSearchSchema(search);

    expect(getSchemasListSpy).not.toHaveBeenCalled();
  });

  it('should call patchValue with an empty string when handleClearSchema is called', () => {
    const patchValueSpy = jest.spyOn(component.formGroup, 'patchValue');

    component.handleClearSchema();

    expect(patchValueSpy).toHaveBeenCalledWith({ schemaKey: '' });
  });

  it('should call patchValue with an empty string when handleClearWorkflow is called', () => {
    const patchValueSpy = jest.spyOn(component.formGroup, 'patchValue');

    component.handleClearWorkflow();

    expect(patchValueSpy).toHaveBeenCalledWith({ processDefinitionKey: '' });
  });

  describe('Create TransactionDefinition', () => {
    beforeEach(() => {
      component.mode = NuverialCrudActions.CREATE;

      const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;
      paramMapSubject.next(convertToParamMap({ transactionDefinitionKey: '' }));
    });

    it('should call createTransactionDefinition from service when creating a transaction definition', () => {
      component.formGroup.patchValue({
        category: 'application',
        description: 'description',
        key: 'FinancialBenefit',
        name: 'Financial Benefit',
        processDefinitionKey: 'test_process',
        schemaKey: 'FinancialBenefit',
      });
      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      const spy = jest.spyOn(workApiRoutesService, 'createTransactionDefinition$');
      component.saveTransactionDefinition(NuverialCrudActions.CREATE);

      expect(spy).toHaveBeenCalledWith(TransactionDefinitionModelMock);
    });

    it('validators should not accept a key with non-alphanumeric characters', () => {
      component.formGroup.patchValue({
        category: 'application',
        description: 'description',
        key: 'Financial-Benefit',
        name: 'Financial Benefit',
        processDefinitionKey: 'test_process',
        schemaKey: 'FinancialBenefit',
      });
      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      const spy = jest.spyOn(workApiRoutesService, 'createTransactionDefinition$');
      component.saveTransactionDefinition(NuverialCrudActions.CREATE);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should set formErrors and showErrorHeader when creating a transaction definition with key that already exists', () => {
      component.formGroup.patchValue({
        category: 'application',
        description: 'description',
        key: 'FinancialBenefit',
        name: 'Financial Benefit',
        processDefinitionKey: 'test_process',
        schemaKey: 'FinancialBenefit',
      });
      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      const createUpdateTransactionDefinition$Spy = jest.spyOn(workApiRoutesService, 'createTransactionDefinition$').mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              error: { messages: ['Transaction Definition already exists'] },
              status: 409,
            }),
        ),
      );

      component.saveTransactionDefinition(NuverialCrudActions.CREATE);

      expect(component.formErrors.length).toEqual(1);
      expect(component.formErrors[0].errorName).toEqual('keyExists');
      expect(createUpdateTransactionDefinition$Spy).toHaveBeenCalled();
    });

    it('should set formErrors and showErrorHeader when creating a transaction definition with case insensitive key that already exists', () => {
      component.formGroup.patchValue({
        category: 'application',
        description: 'description',
        key: 'FinancialBenefit',
        name: 'Financial Benefit',
        processDefinitionKey: 'test_process',
        schemaKey: 'FinancialBenefit',
      });
      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      const createUpdateTransactionDefinition$Spy = jest.spyOn(workApiRoutesService, 'createTransactionDefinition$').mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              error: { messages: ['Case-insensitive key already exists for this type'] },
              status: 409,
            }),
        ),
      );

      component.saveTransactionDefinition(NuverialCrudActions.CREATE);

      expect(component.formErrors.length).toEqual(1);
      expect(component.formErrors[0].errorName).toEqual('keyExists');
      expect(createUpdateTransactionDefinition$Spy).toHaveBeenCalled();
    });

    it('should not create a transaction definition if form is invalid', () => {
      component.formGroup.patchValue({
        category: 'application',
        description: 'description',
        key: 'FinancialBenefit',
        name: '',
        processDefinitionKey: 'test_process',
        schemaKey: 'FinancialBenefit',
      });
      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      const spy = jest.spyOn(workApiRoutesService, 'createTransactionDefinition$');

      component.saveTransactionDefinition(NuverialCrudActions.CREATE);

      expect(component.formErrors.length).toBeGreaterThan(0);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call createTransactionDefinition even without description', () => {
      component.formGroup.patchValue({
        category: 'application',
        description: '',
        key: 'FinancialBenefit',
        name: 'Financial Benefit',
        processDefinitionKey: 'test_process',
        schemaKey: 'FinancialBenefit',
      });
      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      const spy = jest.spyOn(workApiRoutesService, 'createTransactionDefinition$');
      component.saveTransactionDefinition(NuverialCrudActions.CREATE);

      const TransactionDefinitionMockNoDescription = { ...TransactionDefinitionMock2 };
      TransactionDefinitionMockNoDescription.description = '';
      expect(spy).toHaveBeenCalledWith(new TransactionDefinitionModel(TransactionDefinitionMockNoDescription));
    });

    it('should call openSnackbar with error when creating a transaction definition', () => {
      component.formGroup.patchValue({
        category: 'Test category',
        description: 'Test description',
        key: 'Testkey',
        name: 'Test name',
        processDefinitionKey: 'Test processDefinitionKey',
        schemaKey: 'Test schemaKey',
      });
      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      jest.spyOn(workApiRoutesService, 'createTransactionDefinition$').mockReturnValue(throwError(() => new Error('')));

      const nuverialSnackBarService = TestBed.inject(NuverialSnackBarService);
      const spyNotifyApplicationError = jest.spyOn(nuverialSnackBarService, 'notifyApplicationError');

      component.saveTransactionDefinition(NuverialCrudActions.CREATE);

      expect(spyNotifyApplicationError).toHaveBeenCalled();
    });

    it('create - should set formErrors and showErrorHeader when form is invalid', () => {
      component.formGroup.patchValue({
        category: 'Test category',
        description: 'Test description',
        key: 'Test key',
        name: '',
        processDefinitionKey: 'Test processDefinitionKey',
        schemaKey: 'Test schemaKey',
      });
      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      const spy = jest.spyOn(workApiRoutesService, 'createTransactionDefinition$');
      component.saveTransactionDefinition(NuverialCrudActions.CREATE);

      expect(component.formErrors.length).toBeGreaterThan(0);
      expect(spy).not.toHaveBeenCalled();
    });

    it('update - should set formErrors and showErrorHeader when form is invalid', () => {
      component.formGroup.patchValue({
        category: 'Test category',
        description: 'Test description',
        key: 'Test key',
        name: '',
        processDefinitionKey: 'Test processDefinitionKey',
        schemaKey: 'Test schemaKey',
      });
      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      const spy = jest.spyOn(workApiRoutesService, 'updateTransactionDefinition$');
      component.saveTransactionDefinition(NuverialCrudActions.UPDATE);

      expect(component.formErrors.length).toBeGreaterThan(0);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should set formErrors and showErrorHeader when creating a transaction definition with key having space characters', () => {
      component.formGroup.patchValue({
        category: 'Test category',
        description: 'Test description',
        key: 'Test key',
        name: 'Test name',
        processDefinitionKey: 'Test processDefinitionKey',
        schemaKey: 'Test schemaKey',
      });
      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      const createUpdateTransactionDefinition$Spy = jest.spyOn(workApiRoutesService, 'createTransactionDefinition$');
      component.saveTransactionDefinition(NuverialCrudActions.CREATE);

      expect(component.formErrors.length).toBeGreaterThan(0);
      expect(createUpdateTransactionDefinition$Spy).not.toHaveBeenCalled();
    });

    it('should call the create method when using "create" action', () => {
      const spy = jest.spyOn(component, 'saveTransactionDefinition');

      component.onActionClick('create');

      expect(spy).toHaveBeenCalledWith(NuverialCrudActions.CREATE);
    });

    it('should call the navigate method when the "cancel" action is clicked', () => {
      const router = TestBed.inject(Router);
      const navigateSpy = jest.spyOn(router, 'navigate');
      const spy = jest.spyOn(component, 'navigateToTransactionDefinitions');

      component.onActionClick('cancel');

      expect(spy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/admin', 'transaction-definitions']);
    });
  });

  describe('Edit TransactionDefinition', () => {
    beforeEach(() => {
      component.mode = NuverialCrudActions.UPDATE;

      const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;
      paramMapSubject.next(convertToParamMap({ transactionDefinitionKey }));
    });

    it('should call the edit method when using "edit" action', () => {
      const spy = jest.spyOn(component, 'saveTransactionDefinition');

      component.onActionClick('edit');

      expect(spy).toHaveBeenCalledWith(NuverialCrudActions.UPDATE);
    });

    it('should call updateTransactionDefinition from service when editing a transaction definition', () => {
      component.formGroup.patchValue({
        category: 'application',
        description: 'description',
        key: transactionDefinitionKey,
        name: 'Financial Benefit',
        processDefinitionKey: 'test_process',
        schemaKey: 'FinancialBenefit',
      });
      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      const spy = jest.spyOn(workApiRoutesService, 'updateTransactionDefinition$');
      component.saveTransactionDefinition(NuverialCrudActions.UPDATE);

      const transactionDefinitionMock = { ...TransactionDefinitionMock2 };
      transactionDefinitionMock.key = transactionDefinitionKey;
      expect(spy).toHaveBeenCalledWith(transactionDefinitionKey, new TransactionDefinitionModel(transactionDefinitionMock));
    });

    it('should call getTransactionDefinitionByKey when transactionDefinitionKey is present in URL', () => {
      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      const spy = jest.spyOn(workApiRoutesService, 'getTransactionDefinitionByKey$');

      expect(spy).toHaveBeenCalledWith(transactionDefinitionKey);
    });

    it('should call error and return to transaction definitions page when getTransactionDefinitionByKey errors', () => {
      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      const spy = jest.spyOn(workApiRoutesService, 'getTransactionDefinitionByKey$').mockReturnValue(throwError(() => new Error('')));
      const nuverialSnackBarService = TestBed.inject(NuverialSnackBarService);
      const spyNotifyApplicationError = jest.spyOn(nuverialSnackBarService, 'notifyApplicationError');

      component.transactionDefinition$.subscribe(_ => {
        expect(spyNotifyApplicationError).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(transactionDefinitionKey);
      });
    });

    it('should call patchValue with the correct defaultFormConfigurationKey', () => {
      const defaultFormConfigurationKey = 'test';
      component.formGroup.patchValue({
        category: 'application',
        defaultFormConfigurationKey: defaultFormConfigurationKey,
        description: 'description',
        key: transactionDefinitionKey,
        name: 'Financial Benefit',
        processDefinitionKey: 'test_process',
        schemaKey: 'FinancialBenefit',
      });
      const patchValueSpy = jest.spyOn(component.formGroup, 'patchValue');

      component.handleChangeDefaultFormConfiguration(defaultFormConfigurationKey);
      expect(patchValueSpy).toHaveBeenCalledWith({ defaultFormConfigurationKey: defaultFormConfigurationKey });
    });
  });

  it('should call patchValue with the correct defaultFormConfigurationKey', () => {
    const formConfigurationSelectionRules = [{ context: 'context', formConfigurationKey: 'key', task: 'task', viewer: 'viewer' }];
    component.formGroup.patchValue({
      category: 'application',
      defaultFormConfigurationKey: 'defaultFormConfigurationKey',
      description: 'description',
      formConfigurationSelectionRules: [],
      key: transactionDefinitionKey,
      name: 'Financial Benefit',
      processDefinitionKey: 'test_process',
      schemaKey: 'FinancialBenefit',
    });
    const patchValueSpy = jest.spyOn(component.formGroup, 'patchValue');

    component.handleChangeFormSelectionRules(formConfigurationSelectionRules);
    expect(patchValueSpy).toHaveBeenCalledWith({ formConfigurationSelectionRules: formConfigurationSelectionRules });
  });

  it('should call getSchemasList$ with both name and key if transactionDefinition is present when schemaOptions is fetched', () => {
    const filters = [
      { field: 'key', value: TransactionDefinitionModelMock.key },
      { field: 'name', value: TransactionDefinitionModelMock.key },
    ];

    const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
    const getTransactionDefinitionByKeySpy = jest
      .spyOn(workApiRoutesService, 'getTransactionDefinitionByKey$')
      .mockReturnValue(of(TransactionDefinitionModelMock));
    const getSchemasListSpy = jest.spyOn(component, 'getSchemasList$');

    const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;
    paramMapSubject.next(convertToParamMap({ transactionDefinitionKey: TransactionDefinitionModelMock.key }));

    expect(getSchemasListSpy).toHaveBeenCalledWith(filters);
    expect(getTransactionDefinitionByKeySpy).toHaveBeenCalledWith(TransactionDefinitionModelMock.key);
  });

  it('should call getSchemasList$ with empty params if transactionDefinition is not present when schemaOptions is fetched', () => {
    const filters = [
      { field: 'key', value: '' },
      { field: 'name', value: '' },
    ];

    const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
    const getTransactionDefinitionByKeySpy = jest.spyOn(workApiRoutesService, 'getTransactionDefinitionByKey$');
    const getSchemasListSpy = jest.spyOn(component, 'getSchemasList$');

    const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;
    paramMapSubject.next(convertToParamMap({ transactionDefinitionKey: '' }));

    expect(getSchemasListSpy).toHaveBeenCalledWith(filters);
    expect(getTransactionDefinitionByKeySpy).not.toHaveBeenCalled();
  });

  describe('validators', () => {
    it('should validate maxLength for key', () => {
      const keyControl = component.formGroup.get('key');
      keyControl?.setValue('a'.repeat(201));
      expect(keyControl?.valid).toBeFalsy();
    });

    it('should validate maxLength for name', () => {
      const keyControl = component.formGroup.get('name');
      keyControl?.setValue('a'.repeat(201));
      expect(keyControl?.valid).toBeFalsy();
    });

    it('should require key', () => {
      const keyControl = component.formGroup.get('key');
      keyControl?.setValue('');
      expect(keyControl?.valid).toBeFalsy();
      expect(keyControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate pattern for key', () => {
      const keyControl = component.formGroup.get('key');
      keyControl?.setValue('invalid-key!');
      expect(keyControl?.valid).toBeFalsy();
      expect(keyControl?.errors?.['alphaNumeric']).toBeTruthy();
    });
  });

  it('should error when getting transaction definitions by route params', async () => {
    const workService = ngMocks.findInstance(WorkApiRoutesService);
    const workSpy = jest.spyOn(workService, 'getTransactionDefinitionByKey$').mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })));

    const snackService = ngMocks.findInstance(NuverialSnackBarService);
    const snackSpy = jest.spyOn(snackService, 'notifyApplicationError');

    const componentSpy = jest.spyOn(component, 'navigateToTransactionDefinitions');

    component.transactionDefinition$.subscribe();

    const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;
    paramMapSubject.next(convertToParamMap({ transactionDefinitionKey }));

    expect(workSpy).toHaveBeenCalled();
    expect(snackSpy).toHaveBeenCalled();
    expect(componentSpy).toHaveBeenCalled();
  });

  it('should return an empty transaction definition if no transaction key is given', async () => {
    const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;
    paramMapSubject.next(convertToParamMap({ transactionDefinitionKey: '' }));

    component.transactionDefinition$.subscribe(transactionDefinition => {
      expect(transactionDefinition).toEqual(new TransactionDefinitionModel());
    });
  });
});
