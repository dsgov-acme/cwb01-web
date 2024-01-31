import { UploadedDocumentMock } from '../uploaded-document/uploaded-document.mock';
import { UploadedDocumentModel } from './uploaded-document.model';

describe('Uploaded Document Model', () => {
  let uploadedDocumentModel: UploadedDocumentModel;

  beforeEach(() => {
    uploadedDocumentModel = new UploadedDocumentModel(UploadedDocumentMock);
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(uploadedDocumentModel.filename).toEqual(UploadedDocumentMock.filename);
      expect(uploadedDocumentModel.id).toEqual(UploadedDocumentMock.id);
      expect(uploadedDocumentModel.scanStatus).toEqual(UploadedDocumentMock.scanStatus);
      expect(uploadedDocumentModel.uploadedBy).toEqual(UploadedDocumentMock.uploadedBy);
    });
  });

  test('toSchema', () => {
    expect(uploadedDocumentModel.toSchema()).toEqual(UploadedDocumentMock);
  });
});
