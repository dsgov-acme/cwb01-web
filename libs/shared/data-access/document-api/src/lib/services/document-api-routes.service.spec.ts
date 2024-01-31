import { HttpHeaders } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpTestingModule } from '@dsg/shared/utils/http';
import { DocumentMock, DocumentModel, IAntivirusScannerResult, UploadedDocumentMock, UploadedDocumentModel } from '../models';
import { DocumentApiRoutesService } from './document-api-routes.service';
import { DocumentUtil } from './utils/document.util';

/* eslint-disable @typescript-eslint/dot-notation */
describe('DocumentApiService', () => {
  let service: DocumentApiRoutesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpTestingModule],
    });
    service = TestBed.inject(DocumentApiRoutesService);
    httpTestingController = TestBed.inject(HttpTestingController);

    jest.spyOn<any, any>(service, '_handlePost$');
    jest.spyOn<any, any>(service, '_handleGet$');
    jest.spyOn<any, any>(service, '_handlePut$');
    jest.spyOn<any, any>(service, '_handleDelete$');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('uploadDocument$', done => {
    const mockDocumentModel = new DocumentModel(DocumentMock);
    const file = new File([], 'test.doc', { type: 'text/plain' });

    service.uploadDocument$(file).subscribe(documentModel => {
      if (documentModel) {
        expect(documentModel).toEqual(mockDocumentModel);
        expect(service['_handlePost$']).toHaveBeenCalledWith(`/v1/documents`, DocumentUtil.createFormData(file), { observe: 'events', reportProgress: true });
        done();
      }
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/documents`);
    expect(req.request.method).toEqual('POST');
    req.flush(DocumentMock);
  });

  it('getUploadedDocument$', done => {
    const mockUploadDocumentModel = new UploadedDocumentModel(UploadedDocumentMock);

    service.getUploadedDocument$(mockUploadDocumentModel.id).subscribe(uploadDocumentModel => {
      expect(uploadDocumentModel).toEqual(mockUploadDocumentModel);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/documents/${mockUploadDocumentModel.id}`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/documents/${mockUploadDocumentModel.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(UploadedDocumentMock);
  });

  it('getProcessingResults$', done => {
    const mockResult = { code: '1234', message: 'test', shouldDisplayError: false, status: 0 } as IAntivirusScannerResult;
    const mockProcessingResults = [{ result: mockResult, timestamp: 'Jan 24, 2024' }];

    service.getProcessingResults$('15151').subscribe(processingResultSchema => {
      expect(processingResultSchema).toEqual(mockProcessingResults);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/documents/15151/processing-result`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/documents/15151/processing-result`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockProcessingResults);
  });

  it('getDocumentFileData$', done => {
    const blob = new Blob();
    const mockHeaders = new HttpHeaders({
      accept: 'application/octet-stream',
    });

    service.getDocumentFileData$('1234').subscribe(fileData => {
      expect(fileData).toEqual(blob);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/documents/1234/file-data`);
    expect(req.request.method).toEqual('GET');
    req.flush(blob, { headers: mockHeaders });
  });

  it('getDocumentProcessors$', done => {
    const mockProcessorInfo = [{ description: 'test document', id: '12345', name: 'test' }];

    service.getDocumentProcessors$().subscribe(processors => {
      expect(processors).toEqual(mockProcessorInfo);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/documents/processors`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/documents/processors`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockProcessorInfo);
  });
});
