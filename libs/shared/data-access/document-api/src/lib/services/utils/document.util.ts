import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DocumentModel, IDocumentSchema } from '../../models';

export class DocumentUtil {
  public static getEventResponse(event: ProgressEvent | HttpResponse<IDocumentSchema>): DocumentModel | number | undefined {
    if (event.type === HttpEventType.Response) {
      return this._getDocumentModel(event);
    } else if ('total' in event) {
      return this._getProgress(event);
    } else {
      return;
    }
  }

  public static createFormData(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return formData;
  }
  private static _getDocumentModel(event: HttpResponse<IDocumentSchema>): DocumentModel | undefined {
    if (event.body) {
      return new DocumentModel(event.body);
    }

    return undefined;
  }

  private static _getProgress(event: ProgressEvent): number {
    const progress = Math.round((event.loaded / event.total) * 100);

    return progress;
  }
}
