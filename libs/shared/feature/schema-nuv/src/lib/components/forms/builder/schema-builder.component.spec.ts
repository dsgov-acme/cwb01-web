import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { SchemaDefinitionMock, SchemaDefinitionModel, SchemaTreeDefinitionModel } from '@dsg/shared/data-access/work-api';
import { SelectorTabsKeys } from '@dsg/shared/feature/form-nuv';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { ENVIRONMENT_CONFIGURATION, mockEnvironment } from '@dsg/shared/utils/environment';
import { LoggingService } from '@dsg/shared/utils/logging';
import { FormBuilderComponent } from '@formio/angular';
import { axe } from 'jest-axe';
import { MockProvider, ngMocks } from 'ng-mocks';
import { Subject, of, throwError } from 'rxjs';
import { SchemaBuilderComponent } from './schema-builder.component';
import { SchemaBuilderService } from './schema-builder.service';

global.structuredClone = jest.fn(obj => obj);

const mockSchemaBuilderService = {
  discardChanges: jest.fn(),
  getSchemaTreeAtrributes: jest.fn(() => []),
  getSchemaTreeByKey$: jest.fn(() => of(new SchemaTreeDefinitionModel())),
  toSchemaDefinition: jest.fn(() => new SchemaDefinitionModel(SchemaDefinitionMock)),
  updateFormComponents: jest.fn(() => of(null)),
  updateSchemaDefinition: jest.fn(() => of(null)),
};

const mockSchemaKey = 'mock-schema-key';

enum Actions {
  Save = 'save',
  Cancel = 'cancel',
}

describe('SchemaBuilderComponent', () => {
  let component: SchemaBuilderComponent;
  let fixture: ComponentFixture<SchemaBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemaBuilderComponent, NoopAnimationsModule],
      providers: [
        MockProvider(LoggingService),
        MockProvider(HttpClient),
        MockProvider(NuverialSnackBarService),
        {
          provide: SchemaBuilderService,
          useValue: mockSchemaBuilderService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(
              convertToParamMap({
                schemaKey: mockSchemaKey,
              }),
            ),
          },
        },
        { provide: ENVIRONMENT_CONFIGURATION, useValue: mockEnvironment },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemaBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no violations', async () => {
    const axeResults = await axe(fixture.nativeElement);
    expect(axeResults).toHaveNoViolations();
  });

  it('should update schemaAttributes and call updateFormRendering on formio change', fakeAsync(() => {
    const changeSubject = new Subject();
    const mockFormIOBuilderComponent: Partial<FormBuilderComponent> = {
      change: changeSubject as any,
      form: { components: [] },
    };

    component['formio'] = mockFormIOBuilderComponent as FormBuilderComponent;

    changeSubject.next({ type: 'addComponent' });
    tick();

    expect(mockSchemaBuilderService.toSchemaDefinition).toHaveBeenCalledWith(mockFormIOBuilderComponent.form);
  }));

  describe('loadSchemaTree$', () => {
    it('should load the schema tree', async () => {
      const service = ngMocks.findInstance(SchemaBuilderService);
      const spy = jest.spyOn(service, 'getSchemaTreeByKey$');

      component.loadSchemaTree$.subscribe();

      expect(spy).toBeCalledWith(mockSchemaKey);
    });

    it('should handle error loading the schema tree', async () => {
      const service = ngMocks.findInstance(SchemaBuilderService);
      const snackbarService = ngMocks.findInstance(NuverialSnackBarService);
      const spy = jest.spyOn(service, 'getSchemaTreeByKey$').mockImplementation(() => throwError(() => new Error('an error')));
      const snackBarSpy = jest.spyOn(snackbarService, 'notifyApplicationError');

      component.loadSchemaTree$.subscribe();

      expect(spy).toHaveBeenCalledWith(mockSchemaKey);
      expect(snackBarSpy).toHaveBeenCalled();
    });
  });

  describe('onTabSelect', () => {
    it('should set jsonForm and currentSelectorTab when clicking into JSON', () => {
      const service = ngMocks.findInstance(SchemaBuilderService);
      const mockEvent = SelectorTabsKeys.JSON;
      const mockFormComponents = {};
      const expectedAttributes = { attributes: new SchemaDefinitionModel(SchemaDefinitionMock).attributes };
      const spy = jest.spyOn(service, 'toSchemaDefinition');

      component.onTabSelect(mockEvent, mockFormComponents);

      expect(spy).toBeCalledWith(mockFormComponents);
      expect(component.jsonForm).toEqual(expectedAttributes);
      expect(component.currentSelectorTab).toEqual(mockEvent);
    });

    it('should call updateFormRendering and set currentSelectorTab when clicking into Visual', () => {
      const service = ngMocks.findInstance(SchemaBuilderService);
      const mockEvent = SelectorTabsKeys.VISUAL;
      const spy = jest.spyOn(service, 'updateFormComponents');

      component.onTabSelect(mockEvent);

      expect(spy).toBeCalledWith(component['_updatedJsonForm']);
      expect(component.currentSelectorTab).toEqual(mockEvent);
    });
  });

  describe('updateJson', () => {
    it('should update _updatedJsonForm', () => {
      const mockFormComponents = new SchemaDefinitionModel(SchemaDefinitionMock);
      const mockAttributes = [{ constraints: [], name: 'mock-name', type: 'mock-type' }];
      mockFormComponents.attributes = mockAttributes;

      component.updateJson(mockFormComponents);

      expect(component['_updatedJsonForm'].attributes).toEqual(mockAttributes);
    });

    it('should not update _updatedJsonForm if undefined', () => {
      const initialAttributes = component['_updatedJsonForm'].attributes;

      component.updateJson(undefined);

      expect(component['_updatedJsonForm'].attributes).toEqual(initialAttributes);
    });
  });

  describe('updateFormRendering', () => {
    it('should call updateFormComponents', () => {
      const service = ngMocks.findInstance(SchemaBuilderService);
      const mockFormComponents = new SchemaDefinitionModel(SchemaDefinitionMock);
      const updateFormComponentsSpy = jest.spyOn(service, 'updateFormComponents');

      component.updateFormRendering(mockFormComponents);

      expect(updateFormComponentsSpy).toHaveBeenCalledWith(mockFormComponents);
    });
  });

  describe('onActionClick', () => {
    it('should not call updateSchemaDefinition when event is "Save" and form has no components', async () => {
      const service = ngMocks.findInstance(SchemaBuilderService);
      const spy = jest.spyOn(service, 'updateSchemaDefinition');
      const mockFormUndefined = {
        components: undefined,
      };

      component.onActionClick(Actions.Save, mockFormUndefined);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should call updateSchemaDefinition when event is "Save" and form has components', async () => {
      const service = ngMocks.findInstance(SchemaBuilderService);
      const spy = jest.spyOn(service, 'updateSchemaDefinition');
      const mockForm = {
        components: [{}],
      };

      component.onActionClick(Actions.Save, mockForm);

      expect(spy).toHaveBeenCalledWith(mockForm, mockSchemaKey);
    });

    it('should call discardChanges when event is "Cancel"', async () => {
      const service = ngMocks.findInstance(SchemaBuilderService);
      const spy = jest.spyOn(service, 'discardChanges');
      const mockForm = {
        components: [{}],
      };

      component.onActionClick(Actions.Cancel, mockForm);

      expect(spy).toHaveBeenCalled();
    });

    it('should notify application error when updateSchemaDefinition fails', async () => {
      const service = ngMocks.findInstance(SchemaBuilderService);
      jest.spyOn(service, 'updateSchemaDefinition').mockImplementation(() => throwError(() => new Error()));
      const spy = jest.spyOn(component['_nuverialSnackbarService'], 'notifyApplicationError');
      const mockForm = {
        components: [{}],
      };

      component.onActionClick(Actions.Save, mockForm);

      expect(spy).toHaveBeenCalled();
    });
  });
});
