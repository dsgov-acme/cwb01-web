import { TransactionDefinitionMock } from './transaction-definition.mock';
import { TransactionDefinitionModel } from './transaction-definition.model';

describe('TransactionDefinitionModel', () => {
  let transactionDefinitionModel: TransactionDefinitionModel;

  beforeEach(() => {
    transactionDefinitionModel = new TransactionDefinitionModel(TransactionDefinitionMock);
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(transactionDefinitionModel.category).toEqual(TransactionDefinitionMock.category);
      expect(transactionDefinitionModel.createdTimestamp).toEqual(TransactionDefinitionMock.createdTimestamp);
      expect(transactionDefinitionModel.defaultFormConfigurationKey).toEqual(TransactionDefinitionMock.defaultFormConfigurationKey);
      expect(transactionDefinitionModel.defaultStatus).toEqual(TransactionDefinitionMock.defaultStatus);
      expect(transactionDefinitionModel.description).toEqual(TransactionDefinitionMock.description);
      expect(transactionDefinitionModel.entitySchema).toEqual(TransactionDefinitionMock.entitySchema);
      expect(transactionDefinitionModel.formConfigurationSelectionRules).toEqual(TransactionDefinitionMock.formConfigurationSelectionRules);
      expect(transactionDefinitionModel.id).toEqual(TransactionDefinitionMock.id);
      expect(transactionDefinitionModel.key).toEqual(TransactionDefinitionMock.key);
      expect(transactionDefinitionModel.lastUpdatedTimestamp).toEqual(TransactionDefinitionMock.lastUpdatedTimestamp);
      expect(transactionDefinitionModel.name).toEqual(TransactionDefinitionMock.name);
      expect(transactionDefinitionModel.processDefinitionKey).toEqual(TransactionDefinitionMock.processDefinitionKey);
    });
  });

  test('toSchema', () => {
    expect(transactionDefinitionModel.toSchema()).toEqual(TransactionDefinitionMock);
  });
});
