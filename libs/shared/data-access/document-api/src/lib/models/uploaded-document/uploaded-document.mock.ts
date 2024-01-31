import { IUploadedDocumentSchema } from './uploaded-document.model';

export const UploadedDocumentMock: IUploadedDocumentSchema = {
  filename: 'test',
  id: 'abc123',
  scanStatus: 'READY',
  uploadedBy: 'testUser',
};
