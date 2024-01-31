import { SchemaDefinitionMock } from './schema-definition.mock';
import { SchemaDefinitionModel } from './schema-definition.model';

describe('SchemaDefinitionModel', () => {
  let schemaDefinitionModel: SchemaDefinitionModel;

  beforeEach(() => {
    schemaDefinitionModel = new SchemaDefinitionModel(SchemaDefinitionMock);
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(schemaDefinitionModel.attributes).toEqual(SchemaDefinitionMock.attributes);
      expect(schemaDefinitionModel.createdBy).toEqual(SchemaDefinitionMock.createdBy);
      expect(schemaDefinitionModel.createdTimestamp).toEqual(SchemaDefinitionMock.createdTimestamp);
      expect(schemaDefinitionModel.description).toEqual(SchemaDefinitionMock.description);
      expect(schemaDefinitionModel.key).toEqual(SchemaDefinitionMock.key);
      expect(schemaDefinitionModel.lastUpdatedTimestamp).toEqual(SchemaDefinitionMock.lastUpdatedTimestamp);
      expect(schemaDefinitionModel.name).toEqual(SchemaDefinitionMock.name);
    });

    test('should set computedAttributes if exists', () => {
      const computedAttributes = [{ expression: 'expression', name: 'name', type: 'type' }];
      const schemaWithComputedAttributesMock = { ...SchemaDefinitionMock, computedAttributes };
      const schemaWithComputedAttributes = new SchemaDefinitionModel(schemaWithComputedAttributesMock);

      expect(schemaWithComputedAttributes.computedAttributes).toEqual(computedAttributes);
    });
  });

  describe('toSchema', () => {
    test('should set all public properties', () => {
      expect(schemaDefinitionModel.toSchema()).toEqual(SchemaDefinitionMock);
    });

    test('should set computedAttributes if exists', () => {
      const computedAttributes = [{ expression: 'expression', name: 'name', type: 'type' }];
      const schemaWithComputedAttributes = new SchemaDefinitionModel(SchemaDefinitionMock);
      schemaWithComputedAttributes.computedAttributes = computedAttributes;

      expect(schemaWithComputedAttributes.toSchema().computedAttributes).toEqual(computedAttributes);
    });
  });
});
