import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LoggingService } from '@dsg/shared/utils/logging';
import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { axe } from 'jest-axe';
import { MockProvider } from 'ng-mocks';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject } from 'rxjs';
import { NUVERIAL_FILE_UPLOAD_STATUS } from '../../models/nuverial.models';
import { FileStatus, NuverialFileUploadComponent } from './file-upload.component';

const focusEvents = new Subject<FocusOrigin | null>();

const fileData = 'new file doc';
const fileName = 'file.doc';
const fileType = 'application/msword';

const file = new File([fileData], fileName, { type: fileType });

const fileStatusMock: FileStatus = {
  isLoading: false,
  isProcessing: false,
  isUploading: false,
  name: file.name,
  processingStatus: { failed: false, processors: [] },
  uploadProgress: 0,
};

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(NuverialFileUploadComponent, {
    ...props,
    providers: [
      MockProvider(DeviceDetectorService, {
        isMobile: jest.fn().mockReturnValue(false),
      }),
      MockProvider(FocusMonitor, {
        monitor: jest.fn().mockReturnValue(focusEvents.asObservable()),
        stopMonitoring: jest.fn(),
      }),
      MockProvider(LoggingService),
    ],
  });

  return { fixture };
};

describe('NuverialFileUploadComponent', () => {
  describe('Accessibility', () => {
    it('should have no violations when ariaLabel is set', async () => {
      const componentProperties = { ariaLabel: 'file upload' };
      const { fixture } = await getFixture({ componentProperties });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
      const fieldUpload = fixture.debugElement.query(By.css('.file-upload'));
      expect(fieldUpload.nativeElement.getAttribute('aria-label')).toEqual(componentProperties.ariaLabel);
    });
  });
  describe('Component Inputs', () => {
    it('should have default values', async () => {
      const { fixture } = await getFixture({});

      expect(fixture.componentInstance.ariaLabel).toBeFalsy();
      expect(fixture.componentInstance.ariaDescribedBy).toBeFalsy();
      expect(fixture.componentInstance.formControl).toBeTruthy();
      expect(fixture.componentInstance.documentTitle).toEqual(undefined);
      expect(fixture.componentInstance.maxFileSize).toEqual(15);
      expect(fixture.componentInstance.fileDragDropAvailable).toEqual(true);
      expect(fixture.componentInstance.validationMessages).toBeFalsy();

      const fieldUpload = fixture.debugElement.query(By.css('.file-upload'));
      expect(fieldUpload).toBeTruthy();
      expect(screen.getByText('Drag and drop your file, or')).toBeInTheDocument();
      expect(screen.getByText('browse')).toBeInTheDocument();
      expect(screen.getByText('The file must be 15MB or smaller in size.')).toBeInTheDocument();
    });
  });

  describe('Single file upload', () => {
    it('should handle the selected file', async () => {
      const { fixture } = await getFixture({});
      fixture.detectChanges();

      const fileList: FileList = Object.assign([file], {
        item: (index: number) => (index === 0 ? file : null),
      });
      const event: Partial<Event> = {
        stopPropagation: jest.fn(),
        target: {
          files: fileList,
        } as HTMLInputElement,
      };

      const addFileSpy = jest.spyOn(fixture.componentInstance.fileUploadControl, 'addFiles');
      const propagationSpy = jest.spyOn(event, 'stopPropagation');
      fixture.componentInstance.handleFileSelection(event as Event);

      expect(addFileSpy).toHaveBeenCalled();
      expect(propagationSpy).toHaveBeenCalled();
    });

    it('should reset file input value to empty string', async () => {
      const { fixture } = await getFixture({});
      fixture.detectChanges();

      const filePath = String.raw`C:\fakepath\file.doc`;
      const fileList: FileList = Object.assign([file], {
        item: (index: number) => (index === 0 ? file : null),
      });
      const fileInput = {
        files: fileList,
        value: filePath,
      } as HTMLInputElement;
      const event: Partial<Event> = {
        stopPropagation: jest.fn(),
        target: fileInput,
      };

      expect(fileInput.value).toEqual(filePath);

      fixture.componentInstance.handleFileSelection(event as Event);

      expect(fileInput.value).toEqual('');
    });

    it('should not set image if empty file is passed in', async () => {
      const { fixture } = await getFixture({});
      const readDataSpy = jest.spyOn(FileReader.prototype, 'readAsDataURL');

      fixture.componentInstance['_setImagePreview']({ ...file, size: 0 });
      expect(readDataSpy).not.toHaveBeenCalled();
    });

    it('should set image if file is passed in', async () => {
      const { fixture } = await getFixture({});
      const readDataSpy = jest.spyOn(FileReader.prototype, 'readAsDataURL');

      fixture.componentInstance['_setImagePreview'](file);
      expect(readDataSpy).toHaveBeenCalled();
    });

    it('should show required error', async () => {
      const { fixture } = await getFixture({});
      fixture.componentInstance.ngOnInit();
      fixture.componentInstance.formControl.setValidators(Validators.required);

      fixture.componentInstance.formControl.markAsTouched();
      fixture.componentInstance.formControl.setValue(undefined);
      fixture.componentInstance.formControl.updateValueAndValidity();

      fixture.detectChanges();

      expect(screen.getByText('Required')).toBeInTheDocument();
    });
    it('should return undefined from validate required if formcontrol has required error and value', async () => {
      const { fixture } = await getFixture({});
      fixture.componentInstance.formControl = new FormControl();
      fixture.componentInstance.formControl.setValue('test');
      fixture.componentInstance.formControl.setErrors({ required: true });
      const requiredError = fixture.componentInstance.validateRequired();

      expect(requiredError).toEqual(undefined);
    });
    it('should show file size error', async () => {
      const { fixture } = await getFixture({});
      fixture.componentInstance.formControl = new FormControl();
      fixture.componentInstance.formControl.setErrors({ fileSize: true });
      const fileSizeError = fixture.componentInstance.validateFileSizeError();

      expect(fileSizeError).toEqual({ fileSize: true });
    });
    it('should do nothing if no file is selected', async () => {
      const { fixture } = await getFixture({});
      fixture.detectChanges();
      const event: Partial<Event> = {
        stopPropagation: jest.fn(),
        target: null,
      };
      const addFileSpy = jest.spyOn(fixture.componentInstance.fileUploadControl, 'addFile');
      const propagationSpy = jest.spyOn(event, 'stopPropagation');
      fixture.componentInstance.handleFileSelection(event as Event);

      expect(addFileSpy).not.toHaveBeenCalled();
      expect(propagationSpy).toHaveBeenCalled();
    });
    it('should upload file', async () => {
      const { fixture } = await getFixture({});
      const uploadDocumentSpy = jest.spyOn(fixture.componentInstance.uploadDocument, 'emit');
      fixture.componentInstance.multiple = false;

      fixture.componentInstance.uploadFile(file);
      fixture.detectChanges();
      expect(uploadDocumentSpy).toHaveBeenCalledWith(file);
    });
    it('should return true if file size error is set', async () => {
      const { fixture } = await getFixture({});
      jest.spyOn(fixture.componentInstance.fileUploadControl, 'getErrors').mockImplementation(() => [{ errors: { fileSize: true }, name: file.name }]);
      let error = fixture.componentInstance.isFileSizeError();
      expect(error).toEqual(true);

      jest.spyOn(fixture.componentInstance.fileUploadControl, 'getErrors').mockImplementation(() => []);
      error = fixture.componentInstance.isFileSizeError();
      expect(error).toEqual(false);
    });
    it('should handle file changes', async () => {
      const { fixture } = await getFixture({});
      const uploadFileSpy = jest.spyOn(fixture.componentInstance, 'uploadFile');

      fixture.componentInstance.fileUploadControl.valueChanges$.subscribe(() => {
        expect(uploadFileSpy).toHaveBeenCalledWith(file);
      });

      fixture.componentInstance.fileUploadControl.addFile(file);
    });
    it('should set file size error if file is too large', async () => {
      const { fixture } = await getFixture({});
      const setErrorSpy = jest.spyOn(fixture.componentInstance, 'setFormControlFileSizeError');
      jest.spyOn(fixture.componentInstance, 'isFileSizeError').mockReturnValue(true);

      fixture.componentInstance.fileUploadControl.valueChanges$.subscribe(() => {
        expect(setErrorSpy).toHaveBeenCalled();
      });

      fixture.componentInstance.fileUploadControl.addFile(file);
      fixture.componentInstance.ngOnInit();
      fixture.detectChanges();
    });
    it('should set file size error if file is too large', async () => {
      const { fixture } = await getFixture({});
      const setErrorSpy = jest.spyOn(fixture.componentInstance, 'setFormControlFileSizeError');
      jest.spyOn(fixture.componentInstance, 'isFileSizeError').mockReturnValue(true);

      fixture.componentInstance.fileUploadControl.valueChanges$.subscribe(() => {
        expect(setErrorSpy).toHaveBeenCalled();
      });

      fixture.componentInstance.fileUploadControl.addFile(file);
      fixture.componentInstance.ngOnInit();
      fixture.detectChanges();
    });
    it('should reupload image', async () => {
      const { fixture } = await getFixture({});
      fixture.componentInstance.singleFilePreview$.subscribe(() => {
        expect(uploadFileSpy).toHaveBeenCalled();
        expect(getImageSpy).toHaveBeenCalled();
        expect(removeFileSpy).toHaveBeenCalled();
        expect(fileBrowseSpy).toHaveBeenCalled();
      });
      const removeFileSpy = jest.spyOn(fixture.componentInstance.fileUploadControl, 'removeFile');
      const fileBrowseSpy = jest.spyOn(fixture.componentInstance, 'handleFileBrowserOpen');
      const uploadFileSpy = jest.spyOn(fixture.componentInstance, 'uploadFile');
      const getImageSpy = jest.spyOn(fixture.componentInstance as any, '_setImagePreview');

      fixture.componentInstance.fileUploadControl.addFile(file);
      fixture.componentInstance.ngOnInit();
      fixture.componentInstance['_singleFilePreview'].next(file);
      fixture.detectChanges();
    });
    it('should stop current file upload if another file is selected', async () => {
      const { fixture } = await getFixture({});
      const stopUploadSpy = jest.spyOn(fixture.componentInstance, 'stopUpload');
      fixture.componentInstance.multiple = false;
      fixture.componentInstance.fileUploadControl.addFile(file);

      fixture.componentInstance.handleFileBrowserOpen(new MouseEvent('click'));

      expect(stopUploadSpy).toHaveBeenCalledWith(file.name);
    });
  });

  describe('Multiple file upload', () => {
    it('should not show document title if container is in multi-file mode', async () => {
      const { fixture } = await getFixture({});
      fixture.componentInstance.multiple = true;

      fixture.detectChanges();

      const documentTitle = fixture.debugElement.query(By.css('.document-title'));
      expect(documentTitle).toBeFalsy();
    });
  });

  it('should emit when user wants to stop file upload', async () => {
    const { fixture } = await getFixture({});

    fixture.componentInstance.fileUploadControl.addFile(file);
    fixture.componentInstance.filePreview.set(file.name, file);

    const cancelUploadSpy = jest.spyOn(fixture.componentInstance.removeDocument, 'emit');
    const fileUploadControlSpy = jest.spyOn(fixture.componentInstance.fileUploadControl, 'removeFile');

    fixture.componentInstance.stopUpload(file.name);
    expect(cancelUploadSpy).toHaveBeenCalled();
    expect(fileUploadControlSpy).toHaveBeenCalledWith(file.name);
  });

  it('should set the maxFileSize when the value is defined', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;

    component.maxFileSize = 20;

    expect(component['_maxFileSize']).toBe(20);
    expect(component.maxFileSize).toBe(20);
  });

  it('should set the maxFileSize when the value is undefined', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;

    component.maxFileSize = undefined;

    expect(component['_maxFileSize']).toBe(15);
    expect(component.maxFileSize).toBe(15);
  });

  describe('deviceService', () => {
    it('should detect mobile device', async () => {
      const { fixture } = await getFixture({});
      const service = fixture.debugElement.injector.get(DeviceDetectorService);
      const spy = jest.spyOn(service, 'isMobile').mockReturnValue(true);

      const component = fixture.componentInstance;
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      expect(component.isMobile).toBeTruthy();
    });

    it('should detect desktop device', async () => {
      const { fixture } = await getFixture({});
      const service = fixture.debugElement.injector.get(DeviceDetectorService);
      const spy = jest.spyOn(service, 'isMobile').mockReturnValue(false);

      const component = fixture.componentInstance;
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      expect(component.isMobile).toBeFalsy();
    });
  });

  describe('removeFile', () => {
    it('removeFile should emit removeDocument', async () => {
      const { fixture } = await getFixture({});
      const spy = jest.spyOn(fixture.componentInstance.removeDocument, 'emit');

      fixture.componentInstance.fileUploadControl.addFile(file);
      fixture.componentInstance.filePreview.set(file.name, file);
      fixture.componentInstance['_fileStatus'].set(file.name, {
        isLoading: false,
        isProcessing: false,
        isUploading: true,
        name: file.name,
        processingStatus: { failed: false, processors: [] },
        uploadProgress: 0,
      });
      fixture.componentInstance.removeFile(file.name);

      expect(spy).toHaveBeenCalledWith(file.name);
    });
  });

  describe('set fileStatus', () => {
    it('should update the file status correctly', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;
      const updatedFileStatus = new Map<string, FileStatus>();

      const fileProcessing: FileStatus = {
        isLoading: false,
        isProcessing: true,
        isUploading: false,
        name: 'file1',
        processingStatus: { failed: false, processors: [] },
        uploadProgress: 100,
      };
      const fileUploading: FileStatus = {
        isLoading: false,
        isProcessing: false,
        isUploading: true,
        name: 'file2',
        processingStatus: { failed: false, processors: [] },
        uploadProgress: 50,
      };
      const fileSuccess: FileStatus = {
        isLoading: false,
        isProcessing: false,
        isUploading: false,
        name: 'file3',
        processingStatus: { failed: false, processors: [] },
        uploadProgress: 100,
      };
      const fileFailure: FileStatus = {
        isLoading: false,
        isProcessing: false,
        isUploading: false,
        name: 'file4',
        processingStatus: { failed: true, processors: [] },
        uploadProgress: 100,
      };

      updatedFileStatus.set(fileProcessing.name, fileProcessing);
      updatedFileStatus.set(fileUploading.name, fileUploading);
      updatedFileStatus.set(fileSuccess.name, fileSuccess);
      updatedFileStatus.set(fileFailure.name, fileFailure);

      // Act
      component.fileStatus = updatedFileStatus;

      // Assert
      expect(component.isProcessing).toBeTruthy();
      expect(component['_fileStatus'].size).toBe(4);

      const updatedFile1 = component['_fileStatus'].get(fileProcessing.name);
      expect(updatedFile1?.progressWidth).toBe('100%');
      expect(updatedFile1?.status).toBe(NUVERIAL_FILE_UPLOAD_STATUS.processing);
      expect(updatedFile1?.statusMessage).toBe(component.getStatusMessage(NUVERIAL_FILE_UPLOAD_STATUS.processing));

      const updatedFile2 = component['_fileStatus'].get(fileUploading.name);
      expect(updatedFile2?.progressWidth).toBe('50%');
      expect(updatedFile2?.status).toBe(NUVERIAL_FILE_UPLOAD_STATUS.pending);
      expect(updatedFile2?.statusMessage).toBe(component.getStatusMessage(NUVERIAL_FILE_UPLOAD_STATUS.pending));

      const updatedFile3 = component['_fileStatus'].get(fileSuccess.name);
      expect(updatedFile3?.status).toBe(NUVERIAL_FILE_UPLOAD_STATUS.success);

      const updatedFile4 = component['_fileStatus'].get(fileFailure.name);
      expect(updatedFile4?.status).toBe(NUVERIAL_FILE_UPLOAD_STATUS.failure);
    });
  });

  describe('set filePreview', () => {
    it('should set filePreview', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;
      const filePreview = new Map<string, File>();

      filePreview.set(file.name, file);

      component.filePreview = filePreview;

      expect(component.filePreview.size).toEqual(1);
      expect(component.filePreview.get(file.name)).toEqual(file);
    });

    it('should call setExistingFiles', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;
      const filePreview = new Map<string, File>();
      const spy = jest.spyOn(component, 'setExistingFiles');

      filePreview.set(file.name, file);

      component.filePreview = filePreview;

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('setExistingFiles', () => {
    it('should add existing files to fileUploadControl', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;

      component.filePreview.set(file.name, file);
      component.setExistingFiles();

      expect(component.fileUploadControl.value).toEqual([file]);
    });

    it('should set preview if multiple is false', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;
      const spy = jest.spyOn(component as any, '_setImagePreview');

      component.multiple = false;
      component.filePreview.set(file.name, file);
      component.setExistingFiles();

      expect(spy).toHaveBeenCalledWith(file);
    });

    it('should not set preview if multiple is true', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;
      const spy = jest.spyOn(component as any, '_setImagePreview');

      component.multiple = true;
      component.filePreview.set(file.name, file);
      component.setExistingFiles();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('showUploadPlaceholder', () => {
    it('should return true if multiple is true', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;
      component.multiple = true;
      expect(component.showUploadPlaceholder).toBe(true);
    });

    it('should return true if fileStatus size is falsy', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;
      component.multiple = false;
      component.fileStatus = new Map();
      expect(component.showUploadPlaceholder).toBe(true);
    });

    it('should return false if multiple is false and fileStatus size is truthy', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;
      component.multiple = false;
      component.fileStatus.set(file.name, fileStatusMock);
      expect(component.showUploadPlaceholder).toBe(false);
    });
  });

  describe('fileList', () => {
    it('should return a list of file statuses', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;

      const status1 = { ...fileStatusMock, name: 'file1.doc' };
      const status2 = { ...fileStatusMock, name: 'file2.doc' };
      component.fileStatus.set('file1.doc', status1);
      component.fileStatus.set('file2.doc', status2);

      const fileList = component.fileList;
      expect(fileList).toEqual([status1, status2]);
    });
  });

  describe('getStatusMessage', () => {
    it('should return "Successful Upload" when status is NUVERIAL_FILE_UPLOAD_STATUS.success', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;

      const status = NUVERIAL_FILE_UPLOAD_STATUS.success;
      const message = component.getStatusMessage(status);
      expect(message).toEqual('Successful Upload');
    });

    it('should return an empty string when status is NUVERIAL_FILE_UPLOAD_STATUS.pending', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;

      const status = NUVERIAL_FILE_UPLOAD_STATUS.pending;
      const message = component.getStatusMessage(status);
      expect(message).toEqual('');
    });

    it('should return "Analyzing your upload to ensure it meets requirements" when status is NUVERIAL_FILE_UPLOAD_STATUS.processing', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;

      const status = NUVERIAL_FILE_UPLOAD_STATUS.processing;
      const message = component.getStatusMessage(status);
      expect(message).toEqual('Analyzing your upload to ensure it meets requirements');
    });

    it('should return an empty string when status is NUVERIAL_FILE_UPLOAD_STATUS.initial', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;

      const status = NUVERIAL_FILE_UPLOAD_STATUS.initial;
      const message = component.getStatusMessage(status);
      expect(message).toEqual('');
    });

    it('should return "Document issues detected" when status is NUVERIAL_FILE_UPLOAD_STATUS.failure', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;

      const status = NUVERIAL_FILE_UPLOAD_STATUS.failure;
      const message = component.getStatusMessage(status);
      expect(message).toEqual('Document issues detected');
    });

    it('should return an empty string for unknown status', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;

      const status = 'unknown';
      const message = component.getStatusMessage(status);
      expect(message).toEqual('');
    });
  });

  describe('single file getters', () => {
    describe('showSingleFileStatusBar', () => {
      it('should return false if there is no file or multiple files are allowed', async () => {
        const { fixture } = await getFixture({});
        const component = fixture.componentInstance;
        component.multiple = true;
        component['_fileStatus'] = new Map();

        const result = component.showSingleFileStatusBar;

        expect(result).toBeFalsy();
        component.multiple = false;
      });

      it('should return false if the file status is initial or pending', async () => {
        const { fixture } = await getFixture({});
        const component = fixture.componentInstance;
        component.multiple = false;

        component['_fileStatus'] = new Map([[file.name, { ...fileStatusMock, status: NUVERIAL_FILE_UPLOAD_STATUS.initial }]]);
        let result = component.showSingleFileStatusBar;

        expect(result).toBeFalsy();

        component['_fileStatus'] = new Map([[file.name, { ...fileStatusMock, status: NUVERIAL_FILE_UPLOAD_STATUS.pending }]]);
        result = component.showSingleFileStatusBar;

        expect(result).toBeFalsy();
      });

      it('should return true if the file status is not initial or pending', async () => {
        const { fixture } = await getFixture({});
        const component = fixture.componentInstance;
        component.multiple = false;

        component['_fileStatus'] = new Map([[file.name, { ...fileStatusMock, status: NUVERIAL_FILE_UPLOAD_STATUS.success }]]);
        const result = component.showSingleFileStatusBar;

        expect(result).toBeTruthy();
      });
    });

    describe('singleFileProgressWidth', () => {
      it('should return "0%" if no file is present', async () => {
        const { fixture } = await getFixture({});
        const component = fixture.componentInstance;
        const result = component.singleFileProgressWidth;
        expect(result).toEqual('0%');
      });

      it('should return the progress width of the file', async () => {
        const { fixture } = await getFixture({});
        const component = fixture.componentInstance;
        const fileStatus = new Map<string, FileStatus>();
        fileStatus.set(file.name, { ...fileStatusMock, progressWidth: '50%' });
        component['_fileStatus'] = fileStatus;

        const result = component.singleFileProgressWidth;
        expect(result).toEqual('50%');
      });
    });

    describe('showOverlayBackground', () => {
      it('should return false if file is not present or multiple is true', async () => {
        const { fixture } = await getFixture({});
        const component = fixture.componentInstance;
        component.multiple = true;

        const result = component.showOverlayBackground;

        expect(result).toBeFalsy();
        component.multiple = false;
      });

      it('should return true if file status is success, pending, or processing', async () => {
        const { fixture } = await getFixture({});
        const component = fixture.componentInstance;
        component.multiple = false;

        component['_fileStatus'] = new Map([[file.name, { ...fileStatusMock, status: NUVERIAL_FILE_UPLOAD_STATUS.success }]]);
        expect(component.showOverlayBackground).toBeTruthy();

        component['_fileStatus'] = new Map([[file.name, { ...fileStatusMock, status: NUVERIAL_FILE_UPLOAD_STATUS.pending }]]);
        expect(component.showOverlayBackground).toBeTruthy();

        component['_fileStatus'] = new Map([[file.name, { ...fileStatusMock, status: NUVERIAL_FILE_UPLOAD_STATUS.processing }]]);
        expect(component.showOverlayBackground).toBeTruthy();
      });

      it('should return true if imageError is true', async () => {
        const { fixture } = await getFixture({});
        const component = fixture.componentInstance;
        component['_fileStatus'] = new Map([[file.name, { ...fileStatusMock, status: NUVERIAL_FILE_UPLOAD_STATUS.success }]]);
        component.multiple = false;
        component.imageError = true;

        const result = component.showOverlayBackground;

        expect(result).toBeTruthy();
      });
    });

    describe('showPending', () => {
      it('should return false if there are no files or multiple files are allowed', async () => {
        const { fixture } = await getFixture({});
        const component = fixture.componentInstance;
        component.multiple = true;

        expect(component.showPending).toBeFalsy();
        component.multiple = false;
      });

      it('should return true if the file status is pending', async () => {
        const { fixture } = await getFixture({});
        const component = fixture.componentInstance;
        component.multiple = false;
        component['_fileStatus'] = new Map([[file.name, { ...fileStatusMock, status: NUVERIAL_FILE_UPLOAD_STATUS.pending }]]);

        expect(component.showPending).toBeTruthy();
      });
    });
  });

  it('should set file status and statusMessage to processing on formControl valueChanges', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;
    const formControlEntry = { documentId: '123', filename: file.name };

    component['_fileStatus'] = new Map([[file.name, { ...fileStatusMock, status: NUVERIAL_FILE_UPLOAD_STATUS.pending }]]);
    component.formControl.setValue(formControlEntry);

    expect(component.fileStatus.get(file.name)).toEqual({
      ...fileStatusMock,
      status: component.statusOptions.processing,
      statusMessage: component.getStatusMessage(component.statusOptions.processing),
    });
  });

  describe('setFormControlFileSizeError', () => {
    it('should set the fileSize error on the form control', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;
      const formControl = new FormControl();

      component.formControl = formControl;
      component.setFormControlFileSizeError();

      expect(formControl.hasError('fileSize')).toBeTruthy();
    });
  });

  describe('_isFormEmpty', () => {
    it('should return true if formControl value is empty', async () => {
      const { fixture } = await getFixture({});
      fixture.componentInstance.formControl = new FormControl('');

      const result = fixture.componentInstance['_isFormEmpty']();

      expect(result).toBe(true);
    });

    it('should return true if formControl value is an empty array', async () => {
      const { fixture } = await getFixture({});
      fixture.componentInstance.formControl = new FormControl([]);

      const result = fixture.componentInstance['_isFormEmpty']();

      expect(result).toBe(true);
    });

    it('should return false if formControl value is not empty', async () => {
      const { fixture } = await getFixture({});
      fixture.componentInstance.formControl = new FormControl({ name: 'file.doc' });

      const result = fixture.componentInstance['_isFormEmpty']();

      expect(result).toBe(false);
    });

    it('should return false if formControl value is a non-empty array', async () => {
      const { fixture } = await getFixture({});
      fixture.componentInstance.formControl = new FormControl([{ name: 'file.doc' }, { name: 'file2.doc' }]);

      const result = fixture.componentInstance['_isFormEmpty']();

      expect(result).toBe(false);
    });
  });

  describe('dropHandler', () => {
    it('should add files to fileUploadControl', async () => {
      const { fixture } = await getFixture({});

      const fileList: FileList = Object.assign([file], {
        item: (index: number) => (index === 0 ? file : null),
      });
      const dataTransfer: DataTransfer = { files: fileList } as DataTransfer;

      const event: Partial<DragEvent> = {
        dataTransfer,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        target: null,
      };

      const addFilesSpy = jest.spyOn(fixture.componentInstance.fileUploadControl, 'addFiles');
      const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
      const preventDefaultSpy = jest.spyOn(event, 'stopPropagation');

      fixture.componentInstance.dropHandler(event as DragEvent);
      fixture.detectChanges();

      expect(addFilesSpy).toHaveBeenCalledWith([file]);
      expect(stopPropagationSpy).toHaveBeenCalled();
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not add files if dataTransfer.files is undefined', async () => {
      const { fixture } = await getFixture({});

      const dataTransfer: DataTransfer = {} as DataTransfer;
      const event: Partial<DragEvent> = {
        dataTransfer,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        target: null,
      };

      const addFilesSpy = jest.spyOn(fixture.componentInstance.fileUploadControl, 'addFiles');

      fixture.componentInstance.dropHandler(event as DragEvent);
      fixture.detectChanges();

      expect(addFilesSpy).not.toHaveBeenCalled();
    });

    it('should stop upload if multiple is false and there is already a file', async () => {
      const { fixture } = await getFixture({});

      const fileList: FileList = Object.assign([file], {
        item: (index: number) => (index === 0 ? file : null),
      });
      const dataTransfer: DataTransfer = { files: fileList } as DataTransfer;
      const event: Partial<DragEvent> = {
        dataTransfer,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        target: null,
      };

      const stopUploadSpy = jest.spyOn(fixture.componentInstance, 'stopUpload');

      fixture.componentInstance.multiple = false;
      fixture.componentInstance.fileUploadControl.addFile(file);
      fixture.componentInstance.dropHandler(event as DragEvent);
      fixture.detectChanges();

      expect(stopUploadSpy).toHaveBeenCalled();
    });

    it('should not stop upload if multiple is false and there are no files', async () => {
      const { fixture } = await getFixture({});

      const fileList: FileList = Object.assign([file], {
        item: (index: number) => (index === 0 ? file : null),
      });
      const dataTransfer: DataTransfer = { files: fileList } as DataTransfer;
      const event: Partial<DragEvent> = {
        dataTransfer,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        target: null,
      };

      const stopUploadSpy = jest.spyOn(fixture.componentInstance, 'stopUpload');

      fixture.componentInstance.multiple = false;
      fixture.componentInstance.dropHandler(event as DragEvent);
      fixture.detectChanges();

      expect(stopUploadSpy).not.toHaveBeenCalled();
    });
  });

  describe('dragOverHandler', () => {
    it('should prevent default and stop propagation', async () => {
      const { fixture } = await getFixture({});

      const dataTransfer: DataTransfer = {} as DataTransfer;
      const event: Partial<DragEvent> = {
        dataTransfer,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        target: null,
      };

      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');

      fixture.componentInstance.dragOverHandler(event as DragEvent);
      fixture.detectChanges();

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  it('should download the file', async () => {
    const { fixture } = await getFixture({});
    const createObjectURLMock = jest.fn().mockReturnValue('mocked-url');
    global.URL.createObjectURL = createObjectURLMock;
    const createElementMock = jest.spyOn(document, 'createElement').mockReturnValue({ click: jest.fn() } as unknown as HTMLAnchorElement);
    const appendChildMock = jest.spyOn(document.body, 'appendChild').mockImplementation();
    const removeChildMock = jest.spyOn(document.body, 'removeChild').mockImplementation();
    const revokeObjectURLMock = jest.fn();
    Object.defineProperty(window, 'URL', { value: { createObjectURL: jest.fn(), revokeObjectURL: revokeObjectURLMock } });
    fixture.componentInstance.filePreview.set(file.name, file);
    fixture.componentInstance.downloadFile(file.name);

    expect(createElementMock).toHaveBeenCalledWith('a');
    expect(appendChildMock).toHaveBeenCalled();
    expect(removeChildMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalled();
  });
});
