import { ISchemaTreeDefinition, ISchemaTreeDefinitionAttributes } from './schema-tree.model';

export const SchemaTreeAttributesMock: ISchemaTreeDefinitionAttributes = {
  constraints: [],
  name: 'attribute1',
  type: 'String',
};

export const SchemaTreeDefinitionMock: ISchemaTreeDefinition = {
  attributes: [
    {
      constraints: [],
      name: 'firstName',
      type: 'String',
    },
    {
      constraints: [],
      entitySchema: 'CommonPersonalInformation',
      name: 'CommonPersonalInformation',
      schema: {
        attributes: [
          {
            constraints: [],
            name: 'address',
            type: 'String',
          },
          {
            constraints: [],
            name: 'city',
            type: 'String',
          },
        ],
        createdBy: 'user1',
        createdTimestamp: '2023-09-19T15:52:16.584283Z',
        description: 'description',
        id: 'id',
        key: 'CommonPersonalInformation',
        lastUpdatedBy: 'user1',
        lastUpdatedTimestamp: '2023-09-19T15:52:16.584283Z',
        name: 'Common Personal Information',
      },
      type: 'DynamicEntity',
    },
    {
      constraints: [],
      name: 'lastName',
      type: 'String',
    },
    {
      constraints: [],
      name: 'id',
      type: 'Document',
    },
    {
      concatenatedContentType: 'Document',
      constraints: [],
      contentType: 'Document',
      name: 'ids',
      type: 'List',
    },
    {
      concatenatedContentType: 'DynamicEntity-SomeSchema',
      constraints: [],
      contentType: 'DynamicEntity',
      entitySchema: 'SomeSchema',
      name: 'schemas',
      type: 'List',
    },
    {
      constraints: [],
      contentType: 'Document',
      name: 'ids2',
      type: 'List',
    },
  ],
  createdBy: 'user1',
  createdTimestamp: '2023-09-19T15:52:16.584283Z',
  description: 'description',
  id: 'id',
  key: 'FinancialBenefit',
  lastUpdatedBy: '',
  lastUpdatedTimestamp: '2023-09-19T15:52:16.584283Z',
  name: 'Financial Benefit',
};

export const NestedFormListSchemaTree: ISchemaTreeDefinition = {
  attributes: [
    {
      attributeConfigurations: [],
      constraints: [],
      contentType: 'DynamicEntity',
      entitySchema: 'testSG2',
      name: 'buildings',
      schema: {
        attributes: [
          {
            constraints: [],
            name: 'building',
            type: 'String',
          },
          {
            attributeConfigurations: [],
            constraints: [],
            contentType: 'DynamicEntity',
            entitySchema: 'CommonAddress',
            name: 'addressList',
            schema: {
              attributes: [
                {
                  constraints: [],
                  name: 'addressLine1',
                  type: 'String',
                },
                {
                  constraints: [],
                  name: 'addressLine2',
                  type: 'String',
                },
                {
                  constraints: [],
                  name: 'city',
                  type: 'String',
                },
                {
                  constraints: [],
                  name: 'stateCode',
                  type: 'String',
                },
                {
                  constraints: [],
                  name: 'postalCode',
                  type: 'String',
                },
                {
                  constraints: [],
                  name: 'postalCodeExtension',
                  type: 'String',
                },
                {
                  constraints: [],
                  name: 'countryCode',
                  type: 'String',
                },
              ],
              computedAttributes: [],
              createdBy: 'a658ad3b-2aee-4144-be15-8442cb0094ed',
              createdTimestamp: '2023-09-28T16:15:23.937102Z',
              description: '',
              id: 'a89ac734-e8ab-4951-8534-8ab71156de98',
              key: 'CommonAddress',
              lastUpdatedBy: 'configuration-deployer',
              lastUpdatedTimestamp: '2023-12-19T14:54:06.023264Z',
              name: 'Common address',
            },
            type: 'List',
          },
        ],
        computedAttributes: [],
        createdBy: '8abfb88d-b933-48e6-abf5-1d1a1bc94c5b',
        createdTimestamp: '2024-01-10T00:03:47.226468Z',
        description: '',
        id: '54812903-856e-4b73-a3b4-440b95f08b87',
        key: 'testSG2',
        lastUpdatedBy: '8abfb88d-b933-48e6-abf5-1d1a1bc94c5b',
        lastUpdatedTimestamp: '2024-01-10T16:24:29.177455Z',
        name: 'testSG2',
      },
      type: 'List',
    },
  ],
  computedAttributes: [],
  createdBy: '8abfb88d-b933-48e6-abf5-1d1a1bc94c5b',
  createdTimestamp: '2023-11-14T17:09:31.146731Z',
  description: '',
  id: 'c6850feb-4221-4f62-a825-c2aa5f174826',
  key: 'testSG',
  lastUpdatedBy: '8abfb88d-b933-48e6-abf5-1d1a1bc94c5b',
  lastUpdatedTimestamp: '2024-01-10T17:29:53.618581Z',
  name: 'testSG',
};
