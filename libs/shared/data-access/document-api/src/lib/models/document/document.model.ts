import { SchemaModel } from '@dsg/shared/utils/http';

export interface IDocumentSchema {
  ['document_id']: string;
}

export class DocumentModel implements SchemaModel<IDocumentSchema> {
  public documentId = '';

  constructor(documentSchema?: IDocumentSchema) {
    if (documentSchema) {
      this.fromSchema(documentSchema);
    }
  }

  public fromSchema(documentSchema: IDocumentSchema) {
    this.documentId = documentSchema.document_id;
  }

  public toSchema(): IDocumentSchema {
    return {
      ['document_id']: this.documentId,
    };
  }
}
