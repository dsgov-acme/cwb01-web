import { Renderer2 } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import {
  FormMock,
  FormioConfigurationTestMock,
  FormlyConfigurationTestMock,
  SchemaTreeDefinitionMock,
  TransactionDefinitionModelMock,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import { mockBreadCrumbs } from '@dsg/shared/ui/nuverial';
import { render } from '@testing-library/angular';
import { IOutputData } from 'angular-split';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { lastValueFrom, of, throwError } from 'rxjs';
import { SchemaTreeService } from '../../../services';
import { FormBuilderService } from '../../../services/form-builder.service';
import { FormBuilderComponent } from './form-builder.component';
global.structuredClone = jest.fn(obj => obj);

let renderer: Renderer2;

const dependencies = MockBuilder(FormBuilderComponent)
  .mock(FormBuilderService, {
    builderFormFields$: of({
      components: FormioConfigurationTestMock,
      display: 'wizard',
    }),
    getFormConfigurationByKey$: jest.fn().mockImplementation(() =>
      of({
        components: FormioConfigurationTestMock,
        display: 'wizard',
      }),
    ),
    reviewFormFields$: of([
      {
        className: 'flex-full',
        fieldGroup: FormioConfigurationTestMock,
        type: 'nuverialSteps',
      },
    ]),

    updateFormComponents: jest.fn().mockReturnValue({
      formioJson: FormioConfigurationTestMock,
      formlyJson: FormlyConfigurationTestMock,
    }),
  })
  .mock(ActivatedRoute, {
    paramMap: of(
      convertToParamMap({
        key: 'sample-form-key',
        transactionDefinitionKey: 'sample-transaction-key',
      }),
    ),
  })
  .mock(SchemaTreeService, {
    getFormSchemaTree$: jest.fn().mockImplementation(() => of(SchemaTreeDefinitionMock)),
    getSchemaKeySelectorSchemaTree$: jest.fn().mockImplementation(() => of(SchemaTreeDefinitionMock)),
    setComponentKey: jest.fn(),
    setComponentUpdateFormConfig: jest.fn(),
  })
  .mock(WorkApiRoutesService, {
    getTransactionDefinitionByKey$: jest.fn().mockImplementation(() =>
      of({
        ...TransactionDefinitionModelMock,
      }),
    ),
  })
  .build();

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(FormBuilderComponent, {
    ...dependencies,
    ...props,
  });
  const component = fixture.componentInstance;

  return { component, fixture };
};

describe('FormBuilderComponent', () => {
  it('should create', async () => {
    const { fixture } = await getFixture({});

    expect(fixture).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const { fixture } = await getFixture({});
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });

  describe('updateForm', () => {
    it('should have form configuration set on load', async () => {
      const { component } = await getFixture({});

      expect(component.formioJson).toBeDefined();
      expect(component.formlyJson).toBeDefined();
    });
    it('should update the form json', async () => {
      const { component } = await getFixture({});

      component.updateFormRendering(FormioConfigurationTestMock);
      expect(component.formioJson).toBe(FormioConfigurationTestMock);
      expect(component.formlyJson).toBe(FormlyConfigurationTestMock);
    });

    it('should set jsonForm', async () => {
      const { component } = await getFixture({});

      component.onTabSelect('visual', {
        components: FormioConfigurationTestMock,
      });
      expect(component.currentSelectorTab).toEqual('visual');
      expect(component.jsonForm).toEqual(FormioConfigurationTestMock);
    });

    it('should call updateFormRendering from updateJson', async () => {
      const { component } = await getFixture({});

      component.updateJson(FormioConfigurationTestMock);

      const updateFormRenderingSpy = jest.spyOn(component, 'updateFormRendering');

      component.updateJson(FormioConfigurationTestMock);

      expect(updateFormRenderingSpy).toHaveBeenCalledWith(FormioConfigurationTestMock);
    });

    it('trackByFn', async () => {
      const { component } = await getFixture({});

      const results = component.trackByFn(1);

      expect(results).toEqual(1);
    });
  });

  describe('reviewFormFields$', () => {
    it('should return a formly form configuration', async () => {
      const { component } = await getFixture({});
      const formConfiguration = await lastValueFrom(component.reviewFormFields$);

      expect(formConfiguration).toEqual([
        {
          className: 'flex-full',
          fieldGroup: FormioConfigurationTestMock,
          type: 'nuverialSteps',
        },
      ]);
    });
  });

  describe('builderFormFields$', () => {
    it('should return a builderFormFields form', async () => {
      const { component } = await getFixture({ componentProperties: { breadCrumbs: mockBreadCrumbs } });
      const formConfiguration = await lastValueFrom(component.builderFormFields$);

      expect(formConfiguration).toEqual({
        components: FormioConfigurationTestMock,
        display: 'wizard',
      });
    });

    it('should call getFormConfigurationByKey and set BreadCrumb', async () => {
      const { component } = await getFixture({ componentProperties: { breadCrumbs: mockBreadCrumbs } });

      const getFormConfigurationByKeySpy = jest
        .spyOn(component['_workApiRoutesService'], 'getTransactionDefinitionByKey$')
        .mockReturnValue(of(TransactionDefinitionModelMock));
      await lastValueFrom(component.builderFormFields$);
      expect(getFormConfigurationByKeySpy).toHaveBeenCalledWith(component['_transactionDefinitionKey']);
      expect(component.breadCrumbs[1].label).toEqual(TransactionDefinitionModelMock.name);
      expect(component.breadCrumbs[1].navigationPath).toContain(component['_transactionDefinitionKey']);
    });
  });

  describe('saveChanges', () => {
    it('should call updateFormConfiguration when formComponents are provided', async () => {
      const mockFormComponents = {
        components: FormioConfigurationTestMock,
      };

      const { component } = await getFixture({});

      const updateFormSpy = jest.spyOn(component['_formBuilderService'], 'updateFormConfiguration').mockReturnValue(of(FormMock));

      component.saveChanges(mockFormComponents as any);

      expect(updateFormSpy).toHaveBeenCalledWith(expect.anything(), component['_transactionDefinitionKey'], component['_formConfigurationKey']);
      updateFormSpy.mockRestore();
    });

    it('should not call updateFormConfiguration when formComponents are not provided', async () => {
      const { component } = await getFixture({});
      const updateFormSpy = jest.spyOn(component['_formBuilderService'], 'updateFormConfiguration').mockReturnValue(of(FormMock));
      component.saveChanges();
      expect(updateFormSpy).not.toHaveBeenCalled();
      updateFormSpy.mockRestore();
    });

    it('should handle error when call fails', async () => {
      const mockFormComponents = {
        components: FormioConfigurationTestMock,
      };
      const { component } = await getFixture({});
      jest
        .spyOn(component['_formBuilderService'], 'updateFormConfiguration')
        .mockReturnValue(throwError(() => ({ error: { formioValidationErrors: [{ errorMessage: 'Some error message' }] }, status: 404 })));

      const notifyApplicationErrorSpy = jest.spyOn(component['_nuverialSnackBarService'], 'notifyApplicationError');
      component.saveChanges(mockFormComponents as any);
      expect(notifyApplicationErrorSpy).toHaveBeenCalled();
    });
  });

  describe('onTabSelect', () => {
    it('should update the currentSelectorTab with the provided event string', async () => {
      const { component } = await getFixture({});

      const sampleEventString = 'sample-event';
      component.onTabSelect(sampleEventString);

      expect(component.currentSelectorTab).toEqual(sampleEventString);
    });
  });

  describe('onPreviewTabSelect', () => {
    it('should update the currentPreviewSelectorTab with the provided event string', async () => {
      const { component } = await getFixture({});

      const sampleEventString = 'sample-event';
      component.onPreviewTabSelect(sampleEventString);

      expect(component.currentPreviewSelectorTab).toEqual(sampleEventString);
    });
  });
  describe('ngOnDestroy', () => {
    it('should call cleanUp on ngOnDestroy', async () => {
      const { component } = await getFixture({});

      const spy = jest.spyOn(component['_formBuilderService'], 'cleanUp');

      component.ngOnDestroy();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('ngDoCheck', () => {
    it('should set max-width style on header container if it does not exist', async () => {
      const { fixture, component } = await getFixture({});
      component.togglePreview();
      fixture.detectChanges();

      renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as any);
      const headerContainer = document.createElement('div');

      expect(component.splitAreaRef).toBeTruthy();
      if (component.splitAreaRef) {
        jest.spyOn(component.splitAreaRef.nativeElement, 'querySelector').mockReturnValue(headerContainer);

        jest.spyOn(headerContainer, 'querySelector').mockReturnValue(null);
        jest.spyOn(renderer, 'setStyle');

        component.ngDoCheck();

        expect(renderer.setStyle).toHaveBeenCalledWith(
          headerContainer,
          'max-width',
          `${component.splitAreaRef.nativeElement.querySelector('.second-area')?.getBoundingClientRect().width}px`,
        );
      }
    });

    it('should not set max-width style on header container if it already exists', async () => {
      const { fixture, component } = await getFixture({});
      component.togglePreview();
      fixture.detectChanges();

      renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as any);
      const headerContainer = document.createElement('div');
      headerContainer.style.maxWidth = '100px';
      if (component.splitAreaRef) {
        jest.spyOn(component.splitAreaRef.nativeElement, 'querySelector').mockReturnValue(headerContainer);
      }
      jest.spyOn(headerContainer, 'querySelector').mockReturnValue(headerContainer);
      jest.spyOn(renderer, 'setStyle');

      component.ngDoCheck();

      expect(component.splitAreaRef).toBeTruthy();
      expect(renderer.setStyle).not.toHaveBeenCalled();
    });
  });

  describe('onSplitDrag', () => {
    it('should set max-width style on header container', async () => {
      const { fixture, component } = await getFixture({});
      component.togglePreview();
      fixture.detectChanges();

      renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as any);
      const headerContainer = document.createElement('div');
      if (component.splitAreaRef) {
        jest.spyOn(component.splitAreaRef.nativeElement, 'querySelector').mockReturnValue(headerContainer);
      }
      jest.spyOn(renderer, 'setStyle');

      component.onSplitDrag({ sizes: [0, 100] } as IOutputData);

      expect(component.splitAreaRef).toBeTruthy();
      expect(renderer.setStyle).toHaveBeenCalledWith(headerContainer, 'max-width', '100px');
    });

    it('should not set max-width style on header container if it does not exist', async () => {
      const { fixture, component } = await getFixture({});
      component.togglePreview();
      fixture.detectChanges();

      renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as any);
      if (component.splitAreaRef) {
        jest.spyOn(component.splitAreaRef.nativeElement, 'querySelector').mockReturnValue(null);
      }
      jest.spyOn(renderer, 'setStyle');

      component.onSplitDrag({ sizes: [0, 100] } as IOutputData);

      expect(component.splitAreaRef).toBeTruthy();
      expect(renderer.setStyle).not.toHaveBeenCalled();
    });
  });

  describe('togglePreview', () => {
    it('should set area2InitialSize to half of window width minus 56 if window is currently closed', async () => {
      const { component } = await getFixture({});
      Object.defineProperty(window, 'innerWidth', { value: 1000 });

      jest.spyOn(component['_splitArea'], 'setArea2Width');

      component.togglePreview();

      expect(component['_splitArea'].setArea2Width).toHaveBeenCalledWith(444);
    });

    it('should set area2InitialSize to 0 if window is currently open', async () => {
      const { component } = await getFixture({});
      component.showPreview = true;

      jest.spyOn(component['_splitArea'], 'setArea2Width');

      component.togglePreview();

      expect(component['_splitArea'].setArea2Width).toHaveBeenCalledWith(0);
    });

    it('should toggle showPreview', async () => {
      const { component } = await getFixture({});
      component.showPreview = false;

      component.togglePreview();

      expect(component.showPreview).toBe(true);

      component.togglePreview();

      expect(component.showPreview).toBe(false);
    });
  });

  describe('toggleDataModel', () => {
    it('should toggle showDataModel', async () => {
      const { component } = await getFixture({});
      component.showDataModel = false;

      component.toggleDataModel();

      expect(component.showDataModel).toBe(true);

      component.toggleDataModel();

      expect(component.showDataModel).toBe(false);
    });
  });

  describe('onModelChange', () => {
    it('should push new formData on change', async () => {
      const { component } = await getFixture({});
      const testModel = { test: 'test' };

      component.onModelChange(testModel);

      expect(component['_jsonFormData'].value).toStrictEqual(testModel);
    });
  });

  describe('loadForm', () => {
    it('should call getSchemaTree$ with the transactionDefinitionKey from the route', async () => {
      const { component } = await getFixture({});
      const spy = jest.spyOn(component['_schemaTreeService'], 'getFormSchemaTree$');

      component.loadForm$.subscribe();

      expect(spy).toHaveBeenCalledWith('FinancialBenefit'); // Mocked return object has FinancialBenefit as schema key
    });
  });
});
