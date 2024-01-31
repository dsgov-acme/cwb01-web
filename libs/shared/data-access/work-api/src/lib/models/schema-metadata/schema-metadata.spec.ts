import { SchemaMetadataMock, SchemaMetadataNoStatusMock } from './schema-metadata.mock';
import { SchemaMetadataModel } from './schema-metadata.model';

describe('SchemaMetadataModel', () => {
  let schemaMetadataModel: SchemaMetadataModel;

  beforeEach(() => {
    schemaMetadataModel = new SchemaMetadataModel(SchemaMetadataMock);
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(schemaMetadataModel.name).toEqual(SchemaMetadataMock.name);
      expect(schemaMetadataModel.key).toEqual(SchemaMetadataMock.key);
      expect(schemaMetadataModel.createdBy).toEqual(SchemaMetadataMock.createdBy);
      expect(schemaMetadataModel.lastUpdatedBy).toEqual(SchemaMetadataMock.lastUpdatedBy);
      expect(schemaMetadataModel.description).toEqual(SchemaMetadataMock.description);
      expect(schemaMetadataModel.status).toEqual(SchemaMetadataMock.status);
    });

    test('should set status to empty when SchemaMetadataSchema.status is undefined', () => {
      schemaMetadataModel.fromSchema(new SchemaMetadataModel(SchemaMetadataNoStatusMock));
      expect(schemaMetadataModel.name).toEqual(SchemaMetadataMock.name);
      expect(schemaMetadataModel.key).toEqual(SchemaMetadataMock.key);
      expect(schemaMetadataModel.createdBy).toEqual(SchemaMetadataMock.createdBy);
      expect(schemaMetadataModel.lastUpdatedBy).toEqual(SchemaMetadataMock.lastUpdatedBy);
      expect(schemaMetadataModel.description).toEqual(SchemaMetadataMock.description);
      expect(schemaMetadataModel.status).toEqual('');
    });
  });

  test('toSchema', () => {
    expect(schemaMetadataModel.toSchema()).toEqual(SchemaMetadataMock);
  });
});
