import { SchemaModel } from '@dsg/shared/utils/http';

export interface IProcessDocuments {
  documents: string[];
  path: string;
}

export interface IProcessDocumentsResponse {
  processors: string[];
}

export class ProcessDocumentsModel implements SchemaModel<IProcessDocuments> {
  private _documents: string[] = [];
  private _path = '';

  constructor(processDocumentsSchema?: IProcessDocuments) {
    if (processDocumentsSchema) {
      this.fromSchema(processDocumentsSchema);
    }
  }

  public fromSchema(processDocumentsSchema: IProcessDocuments) {
    this._documents = processDocumentsSchema.documents;
    this._path = processDocumentsSchema.path;
  }

  public toSchema(): IProcessDocuments {
    return {
      documents: this._documents,
      path: this._path,
    };
  }
}
