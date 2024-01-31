import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT_CONFIGURATION, IEnvironment } from '@dsg/shared/utils/environment';
import { HttpBaseService } from '@dsg/shared/utils/http';
import { LoggingService } from '@dsg/shared/utils/logging';
import { Observable, map } from 'rxjs';
import { DocumentModel, IDocumentSchema, IProcessingResultSchema, ProcessorInfo } from '../models';
import { IUploadedDocumentSchema, UploadedDocumentModel } from '../models/uploaded-document/uploaded-document.model';
import { DocumentUtil } from './utils/document.util';

/**
 * This service is only used to expose endpoints, no logic should go in this service
 */
@Injectable({
  providedIn: 'root',
})
export class DocumentApiRoutesService extends HttpBaseService {
  constructor(
    protected override readonly _http: HttpClient,
    @Inject(ENVIRONMENT_CONFIGURATION) protected readonly _environment: IEnvironment,
    protected override readonly _loggingService: LoggingService,
  ) {
    super(_http, `${_environment.httpConfiguration.baseUrl}/dm/api`, _loggingService);
  }

  /**
   * Upload document to document manager
   */
  public uploadDocument$(file: File): Observable<DocumentModel | number | undefined> {
    return this._handlePost$<ProgressEvent | HttpResponse<IDocumentSchema>>(`/v1/documents`, DocumentUtil.createFormData(file), {
      observe: 'events',
      reportProgress: true,
    }).pipe(map(event => DocumentUtil.getEventResponse(event)));
  }

  /**
   * Retrieve uploaded document from document manager
   */
  public getUploadedDocument$(id: string): Observable<UploadedDocumentModel> {
    return this._handleGet$<IUploadedDocumentSchema>(`/v1/documents/${id}`).pipe(
      map(uploadedDocumentSchema => new UploadedDocumentModel(uploadedDocumentSchema)),
    );
  }

  /**
   * Get document processing results
   */
  public getProcessingResults$(documentId: string): Observable<IProcessingResultSchema[]> {
    return this._handleGet$<IProcessingResultSchema[]>(`/v1/documents/${documentId}/processing-result`).pipe(
      map(processingResultSchema => processingResultSchema),
    );
  }

  /**
   * Retrieve uploaded document from document manager
   */
  public getDocumentFileData$(id: string): Observable<Blob> {
    const headers = new HttpHeaders({
      accept: 'application/octet-stream',
    });

    return this._handleGet$<Blob>(`/v1/documents/${id}/file-data`, { headers: headers, responseType: 'blob' }).pipe(map(fileData => fileData));
  }

  /**
   * Retrieve available document processors
   */
  public getDocumentProcessors$(): Observable<ProcessorInfo[]> {
    return this._handleGet$<ProcessorInfo[]>(`/v1/documents/processors`);
  }
}
