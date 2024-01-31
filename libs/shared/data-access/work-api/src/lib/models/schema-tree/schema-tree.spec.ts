import { NestedFormListSchemaTree, SchemaTreeAttributesMock, SchemaTreeDefinitionMock } from './schema-tree.mock';
import { SchemaTreeDefinitionModel } from './schema-tree.model';

global.structuredClone = jest.fn(obj => obj);

interface TreeNode {
  [key: string]: any;
  children: TreeNode[];
  disabled: boolean;
  icon?: string;
  key: string;
  label: string;
}

describe('SchemaTreeDefinitionModel', () => {
  describe('assignIcon', () => {
    it('should return the correct icon for each type', () => {
      expect(SchemaTreeDefinitionModel.assignIcon('String')).toEqual('short_text');
      expect(SchemaTreeDefinitionModel.assignIcon('List')).toEqual('format_list_bulleted');
      expect(SchemaTreeDefinitionModel.assignIcon('Boolean')).toEqual('radio_button_checked');
      expect(SchemaTreeDefinitionModel.assignIcon('DynamicEntity')).toEqual('schema');
      expect(SchemaTreeDefinitionModel.assignIcon('Integer')).toEqual('money');
      expect(SchemaTreeDefinitionModel.assignIcon('Number')).toEqual('money');
      expect(SchemaTreeDefinitionModel.assignIcon('BigDecimal')).toEqual('decimal_increase');
      expect(SchemaTreeDefinitionModel.assignIcon('LocalDate')).toEqual('calendar_today');
      expect(SchemaTreeDefinitionModel.assignIcon('LocalTime')).toEqual('schedule');
      expect(SchemaTreeDefinitionModel.assignIcon('Document')).toEqual('description');
      expect(SchemaTreeDefinitionModel.assignIcon('Unknown Type')).toEqual('short_text');
    });
  });

  describe('isAttribute', () => {
    it('should return true if the schema is an attribute', () => {
      expect(SchemaTreeDefinitionModel.isAttribute(SchemaTreeAttributesMock)).toEqual(true);
    });
  });

  describe('toTree', () => {
    it('should convert a schema tree definition to a tree node', () => {
      const schemaTree = new SchemaTreeDefinitionModel(SchemaTreeDefinitionMock);

      const expectedTree: TreeNode = {
        children: [
          {
            children: [],
            disabled: false,
            icon: 'short_text',
            key: 'firstName',
            label: 'firstName',
            type: 'String',
          },
          {
            children: [
              {
                children: [],
                disabled: false,
                icon: 'short_text',
                key: 'address',
                label: 'address',
                type: 'String',
              },
              {
                children: [],
                disabled: false,
                icon: 'short_text',
                key: 'city',
                label: 'city',
                type: 'String',
              },
            ],
            disabled: false,
            icon: 'schema',
            key: 'CommonPersonalInformation',
            label: 'CommonPersonalInformation',
            type: 'DynamicEntity',
          },
          {
            children: [],
            disabled: false,
            icon: 'short_text',
            key: 'lastName',
            label: 'lastName',
            type: 'String',
          },
          {
            children: [],
            disabled: false,
            icon: 'description',
            key: 'id',
            label: 'id',
            type: 'Document',
          },
          {
            children: [],
            contentType: 'Document',
            disabled: false,
            icon: 'format_list_bulleted',
            key: 'ids',
            label: 'ids',
            type: 'List',
          },
          {
            children: [],
            contentType: 'DynamicEntity',
            disabled: false,
            entitySchema: 'SomeSchema',
            icon: 'format_list_bulleted',
            key: 'schemas',
            label: 'schemas',
            type: 'List',
          },
          {
            children: [],
            contentType: 'Document',
            disabled: false,
            icon: 'format_list_bulleted',
            key: 'ids2',
            label: 'ids2',
            type: 'List',
          },
        ],
        disabled: false,
        icon: 'schema',
        key: 'FinancialBenefit',
        label: 'FinancialBenefit',
        type: 'DynamicEntity',
      };

      const result = SchemaTreeDefinitionModel.toTree(schemaTree);

      expect(result).toEqual(expectedTree);
    });
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      const schemaTreeDefnitionModel = new SchemaTreeDefinitionModel(SchemaTreeDefinitionMock);

      expect(schemaTreeDefnitionModel.attributes).toEqual(SchemaTreeDefinitionMock.attributes);
      expect(schemaTreeDefnitionModel.createdBy).toEqual(SchemaTreeDefinitionMock.createdBy);
      expect(schemaTreeDefnitionModel.createdTimestamp).toEqual(SchemaTreeDefinitionMock.createdTimestamp);
      expect(schemaTreeDefnitionModel.description).toEqual(SchemaTreeDefinitionMock.description);
      expect(schemaTreeDefnitionModel.key).toEqual(SchemaTreeDefinitionMock.key);
      expect(schemaTreeDefnitionModel.lastUpdatedTimestamp).toEqual(SchemaTreeDefinitionMock.lastUpdatedTimestamp);
      expect(schemaTreeDefnitionModel.name).toEqual(SchemaTreeDefinitionMock.name);
    });

    test('should set computedAttributes if exists', () => {
      const computedAttributes = [{ expression: 'expression', name: 'name', type: 'type' }];
      const schemaTreeWithComputedAttributes = { ...SchemaTreeDefinitionMock, computedAttributes };
      const schemaTreeDefnitionModel = new SchemaTreeDefinitionModel(schemaTreeWithComputedAttributes);

      expect(schemaTreeDefnitionModel.computedAttributes).toEqual(computedAttributes);
    });
  });

  describe('toSchema', () => {
    test('should set all public properties', () => {
      const schemaTreeDefnitionModel = new SchemaTreeDefinitionModel(SchemaTreeDefinitionMock);

      expect(schemaTreeDefnitionModel.toSchema()).toEqual(SchemaTreeDefinitionMock);
    });

    test('should set computedAttributes if exists', () => {
      const computedAttributes = [{ expression: 'expression', name: 'name', type: 'type' }];
      const schemaTreeDefnitionModel = new SchemaTreeDefinitionModel(SchemaTreeDefinitionMock);
      schemaTreeDefnitionModel.computedAttributes = computedAttributes;

      expect(schemaTreeDefnitionModel.toSchema().computedAttributes).toEqual(computedAttributes);
    });
  });

  describe('getAttributeByName', () => {
    it('should return attribute by name', () => {
      const schemaTreeModel = new SchemaTreeDefinitionModel(NestedFormListSchemaTree);

      const attribute = schemaTreeModel.getAttributeByName('buildings');

      expect(attribute).toEqual(NestedFormListSchemaTree.attributes[0]);
    });

    it('should return attribute by name (nested)', () => {
      const schemaTreeModel = new SchemaTreeDefinitionModel(NestedFormListSchemaTree);

      const attribute = schemaTreeModel.getAttributeByName('addressList');

      expect(attribute).toEqual(NestedFormListSchemaTree.attributes[0].schema?.attributes[1]);
    });
  });
});
