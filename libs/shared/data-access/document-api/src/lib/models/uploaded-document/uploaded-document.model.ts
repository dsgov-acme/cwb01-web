import { SchemaModel } from '@dsg/shared/utils/http';

export interface IUploadedDocumentSchema {
  id: string;
  scanStatus: 'READY' | 'AWAITING_SCAN' | 'FAILED_SCAN';
  filename: string;
  uploadedBy: string;
}

export class UploadedDocumentModel implements SchemaModel<IUploadedDocumentSchema> {
  public id = '';
  public scanStatus!: 'READY' | 'AWAITING_SCAN' | 'FAILED_SCAN';
  public filename = '';
  public uploadedBy = '';

  constructor(uploadedDocumentSchema?: IUploadedDocumentSchema) {
    if (uploadedDocumentSchema) {
      this.fromSchema(uploadedDocumentSchema);
    }
  }

  public fromSchema(uploadedDocumentSchema: IUploadedDocumentSchema) {
    this.id = uploadedDocumentSchema.id;
    this.scanStatus = uploadedDocumentSchema.scanStatus;
    this.filename = uploadedDocumentSchema.filename;
    this.uploadedBy = uploadedDocumentSchema.uploadedBy;
  }

  public toSchema(): IUploadedDocumentSchema {
    return {
      filename: this.filename,
      id: this.id,
      scanStatus: this.scanStatus,
      uploadedBy: this.uploadedBy,
    };
  }
}
