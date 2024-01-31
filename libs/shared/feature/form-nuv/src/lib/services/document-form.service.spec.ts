import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  DocumentApiRoutesService,
  DocumentModel,
  IProcessingResultSchema,
  UploadedDocumentMock,
  UploadedDocumentModel,
} from '@dsg/shared/data-access/document-api';
import { WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { HttpTestingModule } from '@dsg/shared/utils/http';
import { MockProvider, ngMocks } from 'ng-mocks';
import { of, ReplaySubject } from 'rxjs';
import { DocumentFormService } from './document-form.service';

global.URL.createObjectURL = jest.fn();

const fileMock = new File([], 'test.doc', { type: 'text/plain' });
const uploadedDocumentModelMock = new UploadedDocumentModel(UploadedDocumentMock);
const processingDetails: ReplaySubject<IProcessingResultSchema[]> = new ReplaySubject<IProcessingResultSchema[]>(1);
const processors: ReplaySubject<{ processors: string[] }> = new ReplaySubject<{ processors: string[] }>(1);

const ProcessingResultCompleteMock: IProcessingResultSchema[] = [
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

const ProcessingResultPendingMock: IProcessingResultSchema[] = [
  {
    processorId: 'antivirus-scanner',
    result: {
      code: 'READY',
      message: 'Document is available for download',
      shouldDisplayError: false,
      status: 200,
    },
    status: 'PENDING',
    timestamp: '2023-08-02T16:03:26.925543Z',
  },
];

describe('DocumentFormService', () => {
  let service: DocumentFormService;

  beforeEach(() => {
    processors.next({ processors: ['antivirus-scanner'] });

    TestBed.configureTestingModule({
      imports: [HttpTestingModule],
      providers: [
        MockProvider(WorkApiRoutesService, {
          processDocuments$: jest.fn().mockImplementation(() => processors.asObservable()),
        }),
        MockProvider(DocumentApiRoutesService, {
          getDocumentFileData$: jest.fn().mockImplementation(() => of(fileMock)),
          getProcessingResults$: jest.fn().mockImplementation(() => processingDetails.asObservable()),
          getUploadedDocument$: jest.fn().mockImplementation(() => of(uploadedDocumentModelMock)),
          uploadDocument$: jest.fn().mockImplementation(() => of(new DocumentModel({ ['document_id']: 'testId' }))),
        }),
      ],
    });
    service = TestBed.inject(DocumentFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDocumentFileDataById$', () => {
    it('should get a file', done => {
      service.getDocumentFileDataById$('testId').subscribe(file => {
        expect(file).toBeTruthy();

        done();
      });
    });
  });

  describe('uploadDocument$', () => {
    it('should upload the document', done => {
      service.uploadDocument$(fileMock).subscribe(documentModel => {
        expect((documentModel as DocumentModel).documentId).toEqual('testId');

        done();
      });
    });
  });

  describe('uploadDocument$', () => {
    it('should upload the document', done => {
      service.uploadDocument$(fileMock).subscribe(documentModel => {
        expect((documentModel as DocumentModel).documentId).toEqual('testId');

        done();
      });
    });
  });

  describe('getProcessingResultsById$', () => {
    it('should upload the document', fakeAsync(() => {
      const documentApiService = ngMocks.findInstance(DocumentApiRoutesService);
      const processingSpy = jest.spyOn(documentApiService, 'getProcessingResults$');

      let result;

      service.getProcessingResultsById$('testId').subscribe(_processingDetails => {
        result = _processingDetails;
      });
      processingDetails.next(ProcessingResultPendingMock);
      tick(6000);
      processingDetails.next(ProcessingResultCompleteMock);

      expect(processingSpy).toHaveBeenCalledTimes(3);
      expect(result).toEqual(ProcessingResultCompleteMock);
    }));
  });

  describe('getDocumentById$', () => {
    it('should upload the document', done => {
      service.getDocumentById$('testId').subscribe(documentModel => {
        expect(documentModel).toEqual(uploadedDocumentModelMock);

        done();
      });
    });
  });

  describe('processDocument$', () => {
    it('should continue fetching processing details until complete', fakeAsync(() => {
      const documentApiService = ngMocks.findInstance(DocumentApiRoutesService);
      const processingSpy = jest.spyOn(documentApiService, 'getProcessingResults$');

      let result;

      service.processDocument$('transactionId', 'documentId', 'path').subscribe(_processingDetails => {
        result = _processingDetails;
      });
      processingDetails.next(ProcessingResultPendingMock);
      tick(6000);
      processingDetails.next(ProcessingResultCompleteMock);

      expect(processingSpy).toHaveBeenCalledTimes(3);
      expect(result).toEqual(ProcessingResultCompleteMock);
    }));

    it('should continue fetching processing details if no processors are defined but antivirus is processing', fakeAsync(() => {
      const documentApiService = ngMocks.findInstance(DocumentApiRoutesService);
      const processingSpy = jest.spyOn(documentApiService, 'getProcessingResults$');
      processors.next({ processors: [] });

      let result;

      service.processDocument$('transactionId', 'documentId', 'path').subscribe(_processingDetails => {
        result = _processingDetails;
      });
      processingDetails.next(ProcessingResultPendingMock);
      tick(6000);
      processingDetails.next(ProcessingResultCompleteMock);

      expect(processingSpy).toHaveBeenCalledTimes(3);
      expect(result).toEqual(ProcessingResultCompleteMock);
    }));
  });

  describe('openDocument$', () => {
    it('should open window with the file', done => {
      const documentApiService = ngMocks.findInstance(DocumentApiRoutesService);
      const spy = jest.spyOn(documentApiService, 'getDocumentFileData$');
      const windowSpy = jest.spyOn(window.URL, 'createObjectURL');

      service.openDocument$('testId').subscribe(data => {
        expect(spy).toHaveBeenCalledWith('testId');
        expect(windowSpy).toHaveBeenCalledWith(data);

        done();
      });
    });
  });
});
