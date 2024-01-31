import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface DocumentModel {
  documentId: string;
}
/**
 * This service is only used to expose endpoints, no logic should go in this service
 */
@Injectable({
  providedIn: 'root',
})
export class MockDocumentApiRoutesService {
  /**
   * Upload document to document manager
   */
  public uploadDocument$(file: File): Observable<DocumentModel> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return of({ documentId: '1234' });
  }
}
