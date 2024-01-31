import { ProcessDocumentsMock } from './process-documents.mock';
import { ProcessDocumentsModel } from './process-documents.model';

describe('TransactionModel', () => {
  let processDocumentsModel: ProcessDocumentsModel;

  beforeEach(() => {
    processDocumentsModel = new ProcessDocumentsModel(ProcessDocumentsMock);
  });

  describe('fromSchema', () => {
    it('should set all properties', () => {
      expect(processDocumentsModel['_documents']).toEqual(ProcessDocumentsMock.documents);
      expect(processDocumentsModel['_path']).toEqual(ProcessDocumentsMock.path);
    });
  });

  it('toSchema', () => {
    expect(processDocumentsModel.toSchema()).toEqual(ProcessDocumentsMock);
  });
});
