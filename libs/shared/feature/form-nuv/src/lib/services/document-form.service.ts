import { Injectable } from '@angular/core';
import {
  DocumentApiRoutesService,
  DocumentModel,
  IProcessingResultSchema,
  PROCESSING_RESULT_ID,
  UploadedDocumentModel,
} from '@dsg/shared/data-access/document-api';
import { ProcessDocumentsModel, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { Observable, last, retry, switchMap, takeWhile, tap, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentFormService {
  constructor(private readonly _documentApiService: DocumentApiRoutesService, private readonly _workApiService: WorkApiRoutesService) {}

  public openDocument$(documentId: string): Observable<Blob> {
    return this._documentApiService.getDocumentFileData$(documentId).pipe(
      tap(data => {
        const fileURL = window.URL.createObjectURL(data);
        const tab = window.open() || window;
        tab.location.href = fileURL;
      }),
    );
  }

  public getDocumentFileDataById$(documentId: string): Observable<Blob> {
    return this._documentApiService.getDocumentFileData$(documentId);
  }

  public uploadDocument$(file: File): Observable<DocumentModel | number | undefined> {
    return this._documentApiService.uploadDocument$(file);
  }

  public processDocument$(transactionId: string, documentId: string, path: string): Observable<IProcessingResultSchema[]> {
    const processingDocumentsModel = new ProcessDocumentsModel({
      documents: [documentId],
      path,
    });

    return this._workApiService.processDocuments$(transactionId, processingDocumentsModel).pipe(
      retry({
        count: 5,
        delay: 1000,
      }),
      switchMap(({ processors }) =>
        timer(0, 3000).pipe(
          switchMap(_ => this._documentApiService.getProcessingResults$(documentId)),
          takeWhile(
            processingStatus =>
              processingStatus.some(process => process.processorId === PROCESSING_RESULT_ID.antivirus && process.status === 'PENDING') ||
              !processors.every(processorId =>
                processingStatus.some(process => process.processorId === processorId && (process.status === 'COMPLETE' || process.status === 'UNPROCESSABLE')),
              ),
            true,
          ),
          last(),
        ),
      ),
    );
  }

  /**
   * Get document processing results. If the pending callback is defined, it will be called when the status is PENDING.
   */
  public getProcessingResultsById$(documentId: string, pending?: () => void): Observable<IProcessingResultSchema[]> {
    return timer(0, 3000).pipe(
      switchMap(_ => this._documentApiService.getProcessingResults$(documentId)),
      tap((processingStatus: IProcessingResultSchema[]) => {
        if (pending && processingStatus.some(process => process.status === 'PENDING')) {
          pending();
        }
      }),
      takeWhile((processingStatus: IProcessingResultSchema[]) => {
        return processingStatus.some(process => process.status !== 'COMPLETE' && process.status !== 'UNPROCESSABLE');
      }, true),
      last(),
    );
  }

  public getDocumentById$(documentId: string): Observable<UploadedDocumentModel> {
    return this._documentApiService.getUploadedDocument$(documentId);
  }
}
