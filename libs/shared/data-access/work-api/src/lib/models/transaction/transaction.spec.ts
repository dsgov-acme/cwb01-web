import { TransactionMock, TransactionMockWithDocuments, TransactionToSchemaMock } from './transaction.mock';
import { TransactionModel } from './transaction.model';

describe('TransactionModel', () => {
  let transactionModel: TransactionModel;

  beforeEach(() => {
    transactionModel = new TransactionModel(TransactionMock);
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(transactionModel.createdBy).toEqual(TransactionMock.createdBy);
      expect(transactionModel.createdByDisplayName).toEqual(TransactionMock.createdByDisplayName);
      expect(transactionModel.createdTimestamp).toEqual(TransactionMock.createdTimestamp);
      expect(transactionModel.data).toEqual(TransactionMock.data);
      expect(transactionModel.externalId).toEqual(TransactionMock.externalId);
      expect(transactionModel.id).toEqual(TransactionMock.id);
      expect(transactionModel.lastUpdatedTimestamp).toEqual(TransactionMock.lastUpdatedTimestamp);
      expect(transactionModel.priority).toEqual(TransactionMock.priority);
      expect(transactionModel.processInstanceId).toEqual(TransactionMock.processInstanceId);
      expect(transactionModel.status).toEqual(TransactionMock.status);
      expect(transactionModel.subjectUserDisplayName).toEqual(TransactionMock.subjectUserDisplayName);
      expect(transactionModel.subjectUserId).toEqual(TransactionMock.subjectUserId);
      expect(transactionModel.submittedOn).toEqual(TransactionMock.submittedOn);
      expect(transactionModel.transactionDefinitionId).toEqual(TransactionMock.transactionDefinitionId);
      expect(transactionModel.transactionDefinitionKey).toEqual(TransactionMock.transactionDefinitionKey);
    });

    it('should set rejectedDocuments', () => {
      const transactionMockWithMultipleRejectedDocuments = { ...TransactionMockWithDocuments };
      transactionMockWithMultipleRejectedDocuments.data['documents'] = {
        idFront: [
          {},
          {},
          {},
          {
            documentId: '2d0b34d5-7951-4775-87c5-a198ed3e9f01',
          },
        ],
        proofOfIncome: [
          {},
          {
            documentId: '4c69ae11-8541-4cfa-a073-c3644ba78f9e',
          },
        ],
      };

      const transactionModelWithMultipleRejectedDocuments = new TransactionModel(transactionMockWithMultipleRejectedDocuments);

      expect(transactionModelWithMultipleRejectedDocuments.rejectedDocuments).toEqual([
        { dataPath: 'documents.idFront', index: 3, label: 'documents.idFront' },
        { dataPath: 'documents.proofOfIncome', index: 1, label: 'documents.proofOfIncome' },
      ]);
    });

    describe('getDocumentIndex', () => {
      it('should return the index of the document', () => {
        const transactionMock = { ...TransactionMockWithDocuments };
        transactionMock.data['documents'] = {
          idFront: [
            {},
            {},
            {},
            {
              documentId: '2d0b34d5-7951-4775-87c5-a198ed3e9f01',
              filename: 'idFront.jpg',
            },
          ],
          proofOfIncome: [
            {
              documentId: '4c69ae11-8541-4cfa-a073-c3644ba78f9e',
              filename: 'proofOfIncome.jpg',
            },
          ],
        };

        const transactionModelMultipleDocuments = new TransactionModel(transactionMock);

        expect(transactionModelMultipleDocuments['_getDocumentIndex']('documents.idFront', '2d0b34d5-7951-4775-87c5-a198ed3e9f01')).toEqual(3);
        expect(transactionModelMultipleDocuments['_getDocumentIndex']('documents.proofOfIncome', '4c69ae11-8541-4cfa-a073-c3644ba78f9e')).toEqual(0);
      });

      it('should return -1 if the document is not found', () => {
        const transactionMock = { ...TransactionMockWithDocuments };
        transactionMock.data['documents'] = {
          proofOfIncome: [
            {
              documentId: '4c69ae11-8541-4cfa-a073-c3644ba78f9e',
              filename: 'proofOfIncome.jpg',
            },
          ],
        };

        const transactionModelMultipleDocuments = new TransactionModel(transactionMock);

        expect(transactionModelMultipleDocuments['_getDocumentIndex']('documents.proofOfIncome', '123')).toEqual(-1);
        expect(transactionModelMultipleDocuments['_getDocumentIndex']('documents.idFront', '2d0b34d5-7951-4775-87c5-a198ed3e9f01')).toEqual(-1);
      });
    });
  });

  test('toSchema', () => {
    expect(transactionModel.toSchema()).toEqual(TransactionToSchemaMock);
  });

  test('toDataSchema', () => {
    expect(transactionModel.toDataSchema()).toEqual({ data: TransactionToSchemaMock.data });
  });

  test('toPrioritySchema', () => {
    expect(transactionModel.toPrioritySchema()).toEqual({ priority: TransactionToSchemaMock.priority });
  });
  test('toAssignedToSchema', () => {
    expect(transactionModel.toAssignedToSchema()).toEqual({ assignedTo: TransactionToSchemaMock.assignedTo });
  });
  test('toActionSchema', () => {
    expect(transactionModel.toActionSchema('approve')).toEqual({ action: 'approve' });
  });
});
