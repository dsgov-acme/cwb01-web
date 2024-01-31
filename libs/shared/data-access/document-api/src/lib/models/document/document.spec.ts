import { DocumentMock } from './document.mock';
import { DocumentModel } from './document.model';

describe('Document Model', () => {
  let documentModel: DocumentModel;

  beforeEach(() => {
    documentModel = new DocumentModel(DocumentMock);
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(documentModel.documentId).toEqual(DocumentMock.document_id);
    });
  });

  test('toSchema', () => {
    expect(documentModel.toSchema()).toEqual(DocumentMock);
  });
});
