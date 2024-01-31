import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DocumentModel, IProcessingResultSchema } from '@dsg/shared/data-access/document-api';
import { ProcessDocumentsMock } from '@dsg/shared/data-access/work-api';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockProvider, ngMocks } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { DocumentFormService, FormRendererService } from '../../../../services';
import { MockDefaultComponentProperties, MockDefaultFormlyModuleConfiguration, MockTemplate } from '../../../../test';
import { FormlyFileUploaderComponent } from './file-uploader.component';

global.structuredClone = jest.fn(obj => obj);

const mockModel = {};

const mockFields: FormlyFieldConfig[] = [
  {
    className: 'flex-half',
    key: 'documents.document1',
    props: {
      label: 'Document 1',
      multiple: false,
    },
    type: 'nuverialFileUploader',
  },
];

const mockReadyProcessingResult: IProcessingResultSchema[] = [
  {
    processorId: 'antivirus-scanner',
    result: {
      code: 'READY',
      message: 'Document is available for download',
      shouldDisplayError: false,
      status: 200,
    },
    status: 'COMPLETE',
    timestamp: '2023-08-02T16:03:26.925543Z',
  },
];

const emptyProcessingStatus = { failed: false, processors: [] };

const documentModel = new DocumentModel({ ['document_id']: '1' });
const file = new File([], 'test.doc', { type: 'text/plain' });
const mockFormControl = new FormControl({ disabled: false, value: '123' });

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
        types: [{ component: FormlyFileUploaderComponent, name: 'nuverialFileUploader' }],
      }),
    ],
    providers: [
      MockProvider(LoggingService),
      MockProvider(NuverialSnackBarService),
      MockProvider(DocumentFormService, {
        getDocumentFileDataById$: jest.fn().mockImplementation(() => of(file)),
        getProcessingResultsById$: jest.fn().mockImplementation(() => of(mockReadyProcessingResult)),
        openDocument$: jest.fn().mockImplementation(() => of(new Blob())),
        processDocument$: jest.fn().mockImplementation(() => of(ProcessDocumentsMock)),
        uploadDocument$: jest.fn().mockImplementation(() => of(documentModel)),
      }),
      MockProvider(FormRendererService, {
        transactionId: 'testId',
      }),
    ],
  });
  const component: FormlyFileUploaderComponent = fixture.debugElement.query(By.directive(FormlyFileUploaderComponent)).componentInstance;

  return { component, fixture };
};

describe('FormlyFileUploaderComponent', () => {
  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      { teardown: { destroyAfterEach: false } }, // required in formly tests
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  describe('Component Inputs', () => {
    it('should have default values', async () => {
      const { component } = await getFixtureByTemplate();

      expect(component.field).toBeDefined();
      expect(component.loading).toBeFalsy();
      expect(component.field?.formControl?.value).toBeUndefined();
      expect(component.filePreview.size).toEqual(0);
      expect(component.fileStatus.size).toEqual(0);
    });
  });

  describe('File upload', () => {
    it('should upload document', fakeAsync(async () => {
      const { component } = await getFixtureByTemplate();

      component.field = { formControl: mockFormControl, key: 'testGroupControl', props: { label: 'testLabel' } };
      const service = ngMocks.findInstance(DocumentFormService);
      const uploadSpy = jest.spyOn(service, 'uploadDocument$');
      const processSpy = jest.spyOn(service, 'processDocument$');

      component.formControl.setValue(undefined);
      component.onUploadDocument(file);
      tick(1000);

      expect(uploadSpy).toBeCalledWith(file);
      expect(processSpy).toBeCalledWith('testId', '1', 'testGroupControl');
    }));

    it('should add to fileStatus with correct progress when document is uploaded', fakeAsync(async () => {
      const { component } = await getFixtureByTemplate();

      const service = ngMocks.findInstance(DocumentFormService);
      const spy = jest.spyOn(service, 'uploadDocument$').mockImplementation(() => of(80));

      component.onUploadDocument(file);
      tick(1000);

      expect(spy).toBeCalledWith(file);

      expect(component.fileStatus.values().next().value).toEqual({
        isLoading: false,
        isProcessing: false,
        isUploading: true,
        name: file.name,
        processingStatus: emptyProcessingStatus,
        uploadProgress: 80,
      });
      expect(component.field?.formControl?.value).toBeFalsy();
    }));

    it('should add to filePreview when document is uploaded', fakeAsync(async () => {
      const { component } = await getFixtureByTemplate();

      const service = ngMocks.findInstance(DocumentFormService);
      const spy = jest.spyOn(service, 'uploadDocument$').mockImplementation(() => of(80));

      component.onUploadDocument(file);
      tick(1000);

      expect(spy).toBeCalledWith(file);

      expect(component.filePreview.values().next().value).toEqual(file);
      expect(component.field?.formControl?.value).toBeFalsy();
    }));

    it('should add to formControl array when document finishes uploading and multiple is true', fakeAsync(async () => {
      const { component } = await getFixtureByTemplate();

      const service = ngMocks.findInstance(DocumentFormService);
      const spy = jest.spyOn(component.formControl, 'setValue');
      jest.spyOn(service, 'uploadDocument$').mockImplementation(() => of(documentModel));
      component.field.props.multiple = true;
      component.formControl.setValue([]);

      component.onUploadDocument(file);
      tick(1000);

      expect(spy).toHaveBeenCalledWith([{ documentId: '1', filename: 'test.doc' }]);

      component.formControl.setValue(undefined);
    }));

    it('should emit _cancelUpload$ with file name and cancel the corresponding file upload', async () => {
      const { component } = await getFixtureByTemplate();

      const cancelSpy = jest.spyOn(component['_cancelUpload$'], 'next');
      component.filePreview.set(file.name, file);
      component.fileStatus.set(file.name, {
        isLoading: false,
        isProcessing: false,
        isUploading: true,
        name: file.name,
        processingStatus: emptyProcessingStatus,
        uploadProgress: 80,
      });

      component.onRemoveDocument(file.name);

      expect(cancelSpy).toBeCalledWith(file.name);
      expect(component.filePreview.size).toEqual(0);
      expect(component.fileStatus.size).toEqual(0);
    });

    it('should emit _cancelUpload$ with file name and cancel the correct upload among multiple uploads', fakeAsync(async () => {
      const { component } = await getFixtureByTemplate();
      const file2: File = { ...file, name: 'test2.doc' };

      component.field.props.multiple = true;
      const cancelSpy = jest.spyOn(component['_cancelUpload$'], 'next');
      component.onUploadDocument(file);
      component.onUploadDocument(file2);

      component.onRemoveDocument(file2.name);

      expect(cancelSpy).toBeCalledWith(file2.name);
      expect(component.filePreview.size).toEqual(1);
      expect(component.filePreview.values().next().value.name).toEqual(file.name);
      expect(component.fileStatus.size).toEqual(1);
      expect(component.fileStatus.values().next().value.name).toEqual(file.name);
    }));

    it('should open the document', async () => {
      const { component } = await getFixtureByTemplate();
      const service = ngMocks.findInstance(DocumentFormService);
      const spy = jest.spyOn(service, 'openDocument$');

      component.field.props.multiple = false;
      component.formControl.setValue({ documentId: 'testId' });
      component.openDocument(0);

      expect(spy).toBeCalled();

      component.formControl.setValue(undefined);
    });

    it('should keep file in formcontrol even if processing returns an error', async () => {
      const { component } = await getFixtureByTemplate();

      const snackbarService = ngMocks.findInstance(NuverialSnackBarService);
      const snackbarSpy = jest.spyOn(snackbarService, 'notifyApplicationError');
      const service = ngMocks.findInstance(DocumentFormService);
      jest.spyOn(service, 'processDocument$').mockReturnValue(throwError(() => new Error('test error')));

      component.field.props.multiple = true;
      component.onUploadDocument(file);

      expect(snackbarSpy).toHaveBeenCalled();
      expect(component.formControl.value).toEqual([{ documentId: '1', filename: 'test.doc' }]);
    });
  });

  describe('get documentList', () => {
    it('should return an empty array if formControl value is falsy', async () => {
      const { component } = await getFixtureByTemplate();
      component.formControl.setValue(undefined);

      const result = component.documentList;

      expect(result).toEqual([]);
    });

    it('should return an array with the formControl value if multiple is false', async () => {
      const { component } = await getFixtureByTemplate();
      component.formControl.setValue({
        documentId: 'testId',
        filename: 'test.doc',
      });
      component.field.props.multiple = false;

      const result = component.documentList;

      expect(result).toEqual([
        {
          documentId: 'testId',
          filename: 'test.doc',
        },
      ]);

      component.formControl.setValue(undefined);
    });

    it('should return the formControl value if multiple is true and formControl value is an array', async () => {
      const { component } = await getFixtureByTemplate();
      component.formControl.setValue([
        {
          documentId: 'testId1',
          filename: 'test.doc1',
        },
        {
          documentId: 'testId2',
          filename: 'test.doc2',
        },
      ]);
      component.field.props.multiple = true;

      const result = component.documentList;

      expect(result).toEqual([
        {
          documentId: 'testId1',
          filename: 'test.doc1',
        },
        {
          documentId: 'testId2',
          filename: 'test.doc2',
        },
      ]);

      component.formControl.setValue(undefined);
    });
  });

  describe('_initFilePreview', () => {
    it('should call getDocumentFileDataById$ only once for single file upload', async () => {
      const { component } = await getFixtureByTemplate();
      const service = ngMocks.findInstance(DocumentFormService);
      const spy = jest.spyOn(service, 'getDocumentFileDataById$');

      component.field.props.multiple = false;
      component.formControl.setValue({
        documentId: 'testId1',
        filename: 'test.doc1',
      });

      component['_initFilePreview']();

      expect(spy).toBeCalledTimes(1);

      component.formControl.setValue(undefined);
    });

    it('should call getDocumentFileDataById$ for each document in formControl value', async () => {
      const { component } = await getFixtureByTemplate();
      const service = ngMocks.findInstance(DocumentFormService);
      const spy = jest.spyOn(service, 'getDocumentFileDataById$');

      component.field.props.multiple = true;
      component.formControl.setValue([
        {
          documentId: 'testId1',
          filename: 'test.doc1',
        },
        {
          documentId: 'testId2',
          filename: 'test.doc2',
        },
      ]);

      component['_initFilePreview']();

      expect(spy).toBeCalledTimes(2);

      component.formControl.setValue(undefined);
    });

    it('should set fileStatus and filePreview with the existing file', async () => {
      const { component } = await getFixtureByTemplate();
      const service = ngMocks.findInstance(DocumentFormService);
      jest.spyOn(service, 'getDocumentFileDataById$').mockReturnValue(of(file));
      jest.spyOn(service, 'getProcessingResultsById$').mockReturnValue(of(mockReadyProcessingResult));

      component.field.props.multiple = false;
      component.formControl.setValue({
        documentId: 'testId',
        filename: 'test.doc',
      });

      component['_initFilePreview']();

      expect(component.fileStatus.get('test.doc')).toEqual({
        isLoading: false,
        isProcessing: false,
        isUploading: false,
        name: 'test.doc',
        processingStatus: { failed: false, processors: mockReadyProcessingResult },
        uploadProgress: 100,
      });

      component.formControl.setValue(undefined);
    });

    it('should set isLoading to true initially', async () => {
      const { component } = await getFixtureByTemplate();
      const service = ngMocks.findInstance(DocumentFormService);
      jest.spyOn(service, 'getDocumentFileDataById$').mockReturnValue(of());
      jest.spyOn(service, 'getProcessingResultsById$').mockReturnValue(of());

      component.field.props.multiple = false;
      component.formControl.setValue({
        documentId: 'testId',
        filename: 'test.doc',
      });

      component['_initFilePreview']();

      expect(component.fileStatus.get('test.doc')).toEqual({
        isLoading: true,
        isProcessing: false,
        isUploading: false,
        name: 'test.doc',
        processingStatus: { failed: false, processors: [] },
        uploadProgress: 100,
      });

      component.formControl.setValue(undefined);
    });

    it('should handle errors', async () => {
      const { component } = await getFixtureByTemplate();
      const service = ngMocks.findInstance(DocumentFormService);
      const snackbarService = ngMocks.findInstance(NuverialSnackBarService);
      const spy = jest.spyOn(snackbarService, 'notifyApplicationError');
      jest.spyOn(service, 'getDocumentFileDataById$').mockReturnValue(throwError(() => new Error('test error')));

      component.field.props.multiple = false;
      component.formControl.setValue({
        documentId: 'testId',
        filename: 'test.doc',
      });

      component['_initFilePreview']();

      expect(spy).toHaveBeenCalled();
      component.formControl.setValue(undefined);
    });
  });

  describe('removeDocument', () => {
    it('should remove the correct document from the formControl value', async () => {
      const { component } = await getFixtureByTemplate();

      component.field.props.multiple = true;
      component.formControl.setValue([
        {
          documentId: 'testId1',
          filename: 'test.doc1',
        },
        {
          documentId: 'testId2',
          filename: 'test.doc2',
        },
      ]);

      component.removeDocument('test.doc1');

      expect(component.formControl.value).toEqual([{ documentId: 'testId2', filename: 'test.doc2' }]);

      component.formControl.setValue(undefined);
    });

    it('should set formControl value as null if single file', async () => {
      const { component } = await getFixtureByTemplate();

      component.field.props.multiple = false;
      component.formControl.setValue({
        documentId: 'testId1',
        filename: 'test.doc1',
      });

      component.removeDocument('test.doc1');

      expect(component.formControl.value).toEqual(null);

      component.formControl.setValue(undefined);
    });
  });

  describe('validation', () => {
    it('should raise uploading error if file is uploading', fakeAsync(async () => {
      const { component } = await getFixtureByTemplate();

      const service = ngMocks.findInstance(DocumentFormService);
      jest.spyOn(service, 'uploadDocument$').mockImplementation(() => of(80));

      component.onUploadDocument(file);
      tick(1000);

      expect(component.fileStatus.values().next().value).toEqual({
        isLoading: false,
        isProcessing: false,
        isUploading: true,
        name: file.name,
        processingStatus: emptyProcessingStatus,
        uploadProgress: 80,
      });
      expect(component.formControl.errors).toEqual({ uploading: true });
    }));

    it('should remove uploading error when file is done uploading', fakeAsync(async () => {
      const { component } = await getFixtureByTemplate();

      const service = ngMocks.findInstance(DocumentFormService);
      jest.spyOn(component.formControl, 'setValue');
      jest.spyOn(service, 'uploadDocument$').mockImplementation(() => of(documentModel));
      component.field.props.multiple = true;
      component.formControl.setValue([]);

      component.onUploadDocument(file);
      tick(1000);

      expect(component.formControl.errors).toBeFalsy();
    }));
  });
});
