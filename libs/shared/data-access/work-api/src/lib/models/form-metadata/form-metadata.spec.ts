import { FormMetadataMock } from './form-metadata.mock';
import { FormMetadataModel } from './form-metadata.model';

describe('FormMetadataModel', () => {
  let formMetadataModel: FormMetadataModel;

  beforeEach(() => {
    formMetadataModel = new FormMetadataModel(FormMetadataMock);
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(formMetadataModel.name).toEqual(FormMetadataMock.name);
      expect(formMetadataModel.schemaKey).toEqual(FormMetadataMock.schemaKey);
      expect(formMetadataModel.createdBy).toEqual(FormMetadataMock.createdBy);
      expect(formMetadataModel.lastUpdatedBy).toEqual(FormMetadataMock.lastUpdatedBy);
      expect(formMetadataModel.description).toEqual(FormMetadataMock.description);
    });
  });

  test('toSchema', () => {
    expect(formMetadataModel.toSchema()).toEqual(FormMetadataMock);
  });
});
