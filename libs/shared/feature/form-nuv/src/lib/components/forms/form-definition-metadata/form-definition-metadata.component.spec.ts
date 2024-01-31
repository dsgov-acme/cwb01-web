import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormMetadataMock, FormioConfigurationMock, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingAdapter } from '@dsg/shared/utils/logging';
import { axe } from 'jest-axe';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { FormDefinitionMetaDataComponent } from './form-definition-metadata.component';
describe('FormDefinitionMetaDataComponent', () => {
  let component: FormDefinitionMetaDataComponent;
  let fixture: ComponentFixture<FormDefinitionMetaDataComponent>;
  const mockDialogRef = {
    close: jest.fn(),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDefinitionMetaDataComponent, NoopAnimationsModule, ReactiveFormsModule, FormsModule],
      providers: [
        MockProvider(LoggingAdapter),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockDialogRef },
        MockProvider(WorkApiRoutesService, {
          getFormConfigurationByKey$: jest.fn().mockImplementation(() => of(null)),
        }),
        MockProvider(NuverialSnackBarService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDefinitionMetaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const axeResults = await axe(fixture.nativeElement);
      expect(axeResults).toHaveNoViolations();
    });
  });

  describe('On Save', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    it('should set saving to false and close the dialog', () => {
      const mockMetaData = FormMetadataMock;
      const mockFormGroup = new FormGroup({
        createdBy: new FormControl(mockMetaData?.createdBy),
        description: new FormControl(mockMetaData?.description),
        lastUpdatedBy: new FormControl(mockMetaData?.lastUpdatedBy),
        name: new FormControl(mockMetaData?.name),
        schemaKey: new FormControl({ disabled: true, value: mockMetaData?.schemaKey }),
      });
      component.metaData = mockMetaData;
      component.formGroup = mockFormGroup;

      component.onSave();
      expect(component.loading).toBe(false);
      expect(mockDialogRef.close).toHaveBeenCalledWith({ metaData: component.metaData, save: true });
      expect(component.metaData.createdBy).toEqual(component.formGroup.value.createdBy);
      expect(component.metaData.lastUpdatedBy).toEqual(component.formGroup.value.lastUpdatedBy);
      expect(component.metaData.description).toEqual(component.formGroup.value.description);
      expect(component.metaData.name).toEqual(component.formGroup.value.name);
    });

    it('should close the dialog if form is pristine', () => {
      const mockMetaData = FormMetadataMock;
      const mockFormGroup = new FormGroup({
        createdBy: new FormControl(mockMetaData?.createdBy),
        description: new FormControl(mockMetaData?.description),
        lastUpdatedBy: new FormControl(mockMetaData?.lastUpdatedBy),
        name: new FormControl(mockMetaData?.name),
        schemaKey: new FormControl({ disabled: true, value: mockMetaData?.schemaKey }),
      });
      component.metaData = mockMetaData;
      component.formGroup = mockFormGroup;
      component.formGroup.markAsPristine();

      component.onSave();
      expect(component.loading).toBe(false);
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('validators should not accept a key with non-alphanumeric characters', () => {
      component.formGroup.patchValue({
        createdBy: 'createdBy',
        description: 'description',
        key: 'key-1',
        lastUpdatedBy: 'lastupdatedBy',
        mode: 'CREATE',
        name: 'name',
        schemaKey: 'schemaKey',
        transactionDefinitionKey: 'transactionKey',
      });
      component.onSave();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should close the modal even without description', () => {
      component.formGroup.patchValue({
        createdBy: 'createdBy',
        description: '',
        key: 'key',
        lastUpdatedBy: 'lastupdatedBy',
        mode: 'CREATE',
        name: 'name',
        schemaKey: 'schemaKey',
        transactionDefinitionKey: 'transactionKey',
      });

      component.onSave();
      expect(component.loading).toBe(false);
      expect(mockDialogRef.close).toHaveBeenCalledWith({ metaData: component.metaData, save: true });
    });

    it('should call openSnackbar with error when calling on save', () => {
      component.formGroup.patchValue({
        createdBy: 'createdBy',
        description: '',
        key: 'key',
        lastUpdatedBy: 'lastupdatedBy',
        mode: 'CREATE',
        name: 'name',
        schemaKey: 'schemaKey',
        transactionDefinitionKey: 'transactionKey',
      });

      component.metaData = {
        createdBy: '',
        description: '',
        key: '',
        lastUpdatedBy: '',
        mode: 'Create',
        name: '',
        schemaKey: '',
        transactionDefinitionKey: '',
      };

      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      jest.spyOn(workApiRoutesService, 'createFormConfiguration$').mockReturnValue(throwError(() => new Error('{status: 500}')));
      const nuverialSnackBarService = TestBed.inject(NuverialSnackBarService);
      const spyNotifyApplicationError = jest.spyOn(nuverialSnackBarService, 'notifyApplicationError');

      component.onSave();

      expect(spyNotifyApplicationError).toHaveBeenCalled();
    });

    it('should set keyExists error and not close the dialog if form configuration exists or form is invalid', () => {
      component.formGroup.patchValue({
        createdBy: 'createdBy',
        description: '',
        key: 'key',
        lastUpdatedBy: 'lastupdatedBy',
        mode: 'CREATE',
        name: 'name',
        schemaKey: 'schemaKey',
        transactionDefinitionKey: 'transactionKey',
      });

      component.metaData = {
        createdBy: '',
        description: '',
        key: '',
        lastUpdatedBy: '',
        mode: 'Create',
        name: '',
        schemaKey: '',
        transactionDefinitionKey: '',
      };

      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      jest.spyOn(workApiRoutesService, 'createFormConfiguration$').mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              error: { messages: ['Form Configuration already exists'] },
              status: 409,
            }),
        ),
      );

      component.onSave();

      expect(component.formGroup.controls['key'].errors).toEqual({ keyExists: true });
      expect(mockDialogRef.close).not.toHaveBeenCalled();
      expect(component.loading).toBe(false);
    });

    it('should not proceed if form is invalid and no server error occurs', () => {
      component.formGroup.controls['name'].setValue('-');

      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      jest.spyOn(workApiRoutesService, 'getFormConfigurationByKey$').mockReturnValue(
        of({
          configuration: {
            components: FormioConfigurationMock,
          },
          configurationSchema: '',
          createdBy: 'system',
          description: '',
          key: '',
          lastUpdatedBy: 'system',
          name: '',
          schemaKey: '',
          taskName: 'wizard',
          transactionDefinitionKey: '',
        }),
      );
      component.onSave();

      expect(component.formGroup.valid).toBe(false);
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should set keyExists error if case-insensitive key already exists', () => {
      component.formGroup.patchValue({
        createdBy: 'createdBy',
        description: '',
        key: 'key',
        lastUpdatedBy: 'lastupdatedBy',
        mode: 'CREATE',
        name: 'name',
        schemaKey: 'schemaKey',
        transactionDefinitionKey: 'transactionKey',
      });

      component.metaData = {
        createdBy: '',
        description: '',
        key: '',
        lastUpdatedBy: '',
        mode: 'Create',
        name: '',
        schemaKey: '',
        transactionDefinitionKey: '',
      };

      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      jest.spyOn(workApiRoutesService, 'createFormConfiguration$').mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              error: { messages: ['Case-insensitive key already exists for this type'] },
              status: 409,
            }),
        ),
      );
      component.onSave();

      expect(component.formGroup.controls['key'].errors).toEqual({ keyExists: true });
      expect(component.loading).toBe(false);
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should call notifyApplicationError on non-409 API error', () => {
      component.formGroup.patchValue({
        createdBy: 'createdBy',
        description: '',
        key: 'key',
        lastUpdatedBy: 'lastupdatedBy',
        mode: 'CREATE',
        name: 'name',
        schemaKey: 'schemaKey',
        transactionDefinitionKey: 'transactionKey',
      });

      component.metaData = {
        createdBy: '',
        description: '',
        key: '',
        lastUpdatedBy: '',
        mode: 'Create',
        name: '',
        schemaKey: '',
        transactionDefinitionKey: '',
      };

      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      jest.spyOn(workApiRoutesService, 'createFormConfiguration$').mockReturnValue(throwError(() => new Error('API Error')));

      const nuverialSnackBarService = TestBed.inject(NuverialSnackBarService);
      const spyNotifyApplicationError = jest.spyOn(nuverialSnackBarService, 'notifyApplicationError');

      component.onSave();

      expect(spyNotifyApplicationError).toHaveBeenCalled();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should call create form and close the form with response and save as false', () => {
      component.formGroup.patchValue({
        createdBy: 'createdBy',
        description: '',
        key: 'key',
        lastUpdatedBy: 'lastupdatedBy',
        mode: 'CREATE',
        name: 'name',
        schemaKey: 'schemaKey',
        transactionDefinitionKey: 'transactionKey',
      });

      component.metaData = {
        createdBy: '',
        description: '',
        key: '',
        lastUpdatedBy: '',
        mode: 'Create',
        name: '',
        schemaKey: '',
        transactionDefinitionKey: '',
      };

      const form = {
        configuration: {
          components: FormioConfigurationMock,
        },
        configurationSchema: '',
        createdBy: 'system',
        description: '',
        key: '',
        lastUpdatedBy: 'system',
        name: '',
        schemaKey: '',
        taskName: 'wizard',
        transactionDefinitionKey: '',
      };

      const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
      jest.spyOn(workApiRoutesService, 'createFormConfiguration$').mockReturnValue(of(form));

      const nuverialSnackBarService = TestBed.inject(NuverialSnackBarService);
      const spyNotifyApplicationError = jest.spyOn(nuverialSnackBarService, 'notifyApplicationError');

      component.onSave();

      expect(spyNotifyApplicationError).not.toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalledWith({ metaData: form, save: false });
    });
  });

  describe('TransactionDefinitionMetaDataComponent - Constructor', () => {
    it('constructor should have dialogRef and dialogData', async () => {
      expect(component.dialogData).toBeTruthy();
      expect(component.dialogRef).toBeTruthy();
    });

    it('should not have dialogData when not provided', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [FormDefinitionMetaDataComponent, NoopAnimationsModule, ReactiveFormsModule, FormsModule],
        providers: [MockProvider(LoggingAdapter)],
      }).compileComponents();
      expect(component.dialogData).toStrictEqual({});
    });

    it('should initialize with default values when dialog data is not provided', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [FormDefinitionMetaDataComponent, NoopAnimationsModule, ReactiveFormsModule, FormsModule],
        providers: [
          MockProvider(LoggingAdapter),
          MockProvider(WorkApiRoutesService),
          MockProvider(NuverialSnackBarService),
          { provide: MAT_DIALOG_DATA, useValue: {} },
          { provide: MatDialogRef, useValue: mockDialogRef },
        ],
      }).compileComponents();
      expect(component.dialogData).toStrictEqual({});
      expect(component.dialogRef).toBeTruthy();
      const localFixture = TestBed.createComponent(FormDefinitionMetaDataComponent);
      const componentInstance = localFixture.componentInstance;

      expect(componentInstance.metaData).toStrictEqual({});
      expect(componentInstance.formGroup.get('createdBy')?.value).toBeNull();
      expect(componentInstance.formGroup.get('description')?.value).toBeNull();
      expect(componentInstance.formGroup.get('lastUpdatedBy')?.value).toBeNull();
      expect(componentInstance.formGroup.get('name')?.value).toBeNull();
      expect(componentInstance.formGroup.get('schemaKey')?.value).toBeNull();
    });

    it('should initialize with provided values when dialog data is provided', () => {
      const mockMetaData = FormMetadataMock;

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [FormDefinitionMetaDataComponent, NoopAnimationsModule, ReactiveFormsModule, FormsModule],
        providers: [
          MockProvider(LoggingAdapter),
          MockProvider(WorkApiRoutesService),
          MockProvider(NuverialSnackBarService),
          { provide: MAT_DIALOG_DATA, useValue: mockMetaData },
          { provide: MatDialogRef, useValue: mockDialogRef },
        ],
      }).compileComponents();

      const localFixture = TestBed.createComponent(FormDefinitionMetaDataComponent);
      const componentInstance = localFixture.componentInstance;

      expect(componentInstance.metaData).toEqual(mockMetaData);
      expect(componentInstance.formGroup.get('createdBy')?.value).toEqual(mockMetaData.createdBy);
      expect(componentInstance.formGroup.get('description')?.value).toEqual(mockMetaData.description);
      expect(componentInstance.formGroup.get('lastUpdatedBy')?.value).toEqual(mockMetaData.lastUpdatedBy);
      expect(componentInstance.formGroup.get('name')?.value).toEqual(mockMetaData.name);
      expect(componentInstance.formGroup.get('schemaKey')?.value).toEqual(mockMetaData.schemaKey);
    });
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
});
