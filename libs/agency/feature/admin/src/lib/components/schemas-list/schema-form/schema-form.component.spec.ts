import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ISchemaDefinition, SchemaDefinitionModel, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingAdapter } from '@dsg/shared/utils/logging';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MockProvider, ngMocks } from 'ng-mocks';
import { Subject, of, throwError } from 'rxjs';
import { SchemaFormComponent } from './schema-form.component';

const mockLoggingService = {
  error: jest.fn(),
  log: jest.fn(),
};

const SchemaDefinitionMock: ISchemaDefinition = {
  attributes: [],
  createdBy: '',
  createdTimestamp: '',
  description: 'description',
  id: '',
  key: 'key',
  lastUpdatedBy: '',
  lastUpdatedTimestamp: '',
  name: 'name',
  status: '',
};

describe('SchemaFormComponent', () => {
  let component: SchemaFormComponent;
  let fixture: ComponentFixture<SchemaFormComponent>;
  let workApiRoutesService: WorkApiRoutesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SchemaFormComponent],
      providers: [
        MockProvider(NuverialSnackBarService),
        MockProvider(WorkApiRoutesService, {
          createSchemaDefinition$: jest.fn().mockReturnValue(of(new SchemaDefinitionModel())),
          getSchemaDefinitionByKey$: jest.fn().mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 }))),
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: new Subject(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
        {
          provide: LoggingAdapter,
          useValue: mockLoggingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    workApiRoutesService = TestBed.inject(WorkApiRoutesService);
  });

  describe('Accessability', () => {
    it('should have no violations', async () => {
      const axeResults = await axe(fixture.nativeElement);
      expect.extend(toHaveNoViolations);
      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createSchemaDefinition from service when saving the schema', fakeAsync(() => {
    component.schemaFormGroup.setValue({
      description: 'description',
      key: 'key',
      name: 'name',
    });

    const spy = jest.spyOn(workApiRoutesService, 'createSchemaDefinition$');

    component.createSchema();
    tick();

    expect(spy).toHaveBeenCalledWith(SchemaDefinitionMock);
  }));

  it('should notify if error saving schema', fakeAsync(() => {
    component.schemaFormGroup.setValue({
      description: 'description',
      key: 'key',
      name: 'name',
    });
    jest.spyOn(workApiRoutesService, 'createSchemaDefinition$').mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    const workSpy = jest.spyOn(workApiRoutesService, 'createSchemaDefinition$');

    const snackService = ngMocks.findInstance(NuverialSnackBarService);
    const snackSpy = jest.spyOn(snackService, 'notifyApplicationError');

    component.createSchema();
    tick();

    expect(workSpy).toHaveBeenCalled();
    expect(snackSpy).toHaveBeenCalled();
  }));

  it('should set formErrors if schema key already exists', fakeAsync(() => {
    component.schemaFormGroup.setValue({
      description: 'Test body',
      key: 'key',
      name: 'Test Name',
    });
    jest.spyOn(workApiRoutesService, 'createSchemaDefinition$').mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: { messages: ['Schema already exists'] },
            status: 409,
          }),
      ),
    );
    jest.spyOn(workApiRoutesService, 'createSchemaDefinition$');

    component.createSchema();
    tick();

    expect(component.formErrors.length).toEqual(1);
    expect(component.formErrors[0].errorName).toEqual('keyExists');
  }));

  it('should set formErrors if schema case-insensitive key already exists', fakeAsync(() => {
    component.schemaFormGroup.setValue({
      description: 'Test body',
      key: 'key',
      name: 'Test Name',
    });
    jest.spyOn(workApiRoutesService, 'createSchemaDefinition$').mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: { messages: ['Case-insensitive key already exists for this type'] },
            status: 409,
          }),
      ),
    );
    jest.spyOn(workApiRoutesService, 'createSchemaDefinition$');

    component.createSchema();
    tick();

    expect(component.formErrors.length).toEqual(1);
    expect(component.formErrors[0].errorName).toEqual('keyExists');
  }));

  it('should call openSnackbar if createSchemaDefinition returns error', fakeAsync(() => {
    component.schemaFormGroup.setValue({
      description: 'Test body',
      key: 'anothertest',
      name: 'Test Name',
    });
    jest.spyOn(workApiRoutesService, 'createSchemaDefinition$').mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    const nuverialSnackBarService = TestBed.inject(NuverialSnackBarService);
    const spyNotifyApplicationError = jest.spyOn(nuverialSnackBarService, 'notifyApplicationError');

    component.createSchema();
    tick();

    expect(spyNotifyApplicationError).toHaveBeenCalled();
  }));

  it('validators should not accept a key with non-alphanumeric characters', fakeAsync(() => {
    component.schemaFormGroup.setValue({
      description: 'Test body',
      key: 'another-test',
      name: 'Test Name',
    });
    jest.spyOn(workApiRoutesService, 'createSchemaDefinition$').mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    const nuverialSnackBarService = TestBed.inject(NuverialSnackBarService);
    const spyNotifyApplicationError = jest.spyOn(nuverialSnackBarService, 'notifyApplicationError');

    component.createSchema();
    tick();

    expect(spyNotifyApplicationError).not.toHaveBeenCalled();
  }));

  it('should set formErrors and showErrorHeader when form is invalid', () => {
    component.schemaFormGroup.setValue({
      description: 'Test body',
      key: '',
      name: 'Test type',
    });
    const spy = jest.spyOn(workApiRoutesService, 'createSchemaDefinition$');
    component.createSchema();

    expect(component.formErrors.length).toBeGreaterThan(0);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call the createSchema method when the "save" action is clicked', () => {
    const spy = jest.spyOn(component, 'createSchema');

    component.onActionClick('save');

    expect(spy).toHaveBeenCalled();
  });

  it('should call the navigateToSchemas method when the "cancel" action is clicked', () => {
    const spy = jest.spyOn(component, 'navigateToSchemas');

    component.onActionClick('cancel');

    expect(spy).toHaveBeenCalled();
  });

  it('should call navigate on schemaKey to builder', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToSchemaBuilder('key');
    expect(navigateSpy).toHaveBeenCalledWith(['/admin', 'schemas', 'key']);
  });

  it('schema model should have description, name, and key non null', async () => {
    component.schemaFormGroup.setValue({
      description: null,
      key: null,
      name: null,
    });

    const spy = jest.spyOn(workApiRoutesService, 'createSchemaDefinition$');

    const mockSchema = new SchemaDefinitionModel();
    mockSchema.description = '';
    mockSchema.key = '';
    mockSchema.name = '';

    component.createSchema();

    expect(spy).not.toHaveBeenCalled();
  });

  describe('validators', () => {
    it('should validate maxLength for key', () => {
      const keyControl = component.schemaFormGroup.get('key');
      keyControl?.setValue('a'.repeat(201));
      expect(keyControl?.valid).toBeFalsy();
    });

    it('should validate maxLength for name', () => {
      const keyControl = component.schemaFormGroup.get('name');
      keyControl?.setValue('a'.repeat(201));
      expect(keyControl?.valid).toBeFalsy();
    });

    it('should require key', () => {
      const keyControl = component.schemaFormGroup.get('key');
      keyControl?.setValue('');
      expect(keyControl?.valid).toBeFalsy();
      expect(keyControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate pattern for key', () => {
      const keyControl = component.schemaFormGroup.get('key');
      keyControl?.setValue('invalid-key!');
      expect(keyControl?.valid).toBeFalsy();
      expect(keyControl?.errors?.['alphaNumeric']).toBeTruthy();
    });
  });
});
