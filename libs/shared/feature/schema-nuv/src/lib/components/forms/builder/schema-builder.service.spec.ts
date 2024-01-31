import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  ISchemaDefinition,
  ISchemaTreeDefinition,
  SchemaDefinitionModel,
  SchemaMetadataModel,
  SchemaTreeDefinitionMock,
  SchemaTreeDefinitionModel,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { FormioForm } from '@formio/angular';
import { MockProvider } from 'ng-mocks';
import { BehaviorSubject, of } from 'rxjs';
import { SchemaBuilderService } from './schema-builder.service';

global.structuredClone = (val: unknown) => JSON.parse(JSON.stringify(val));

const mockForm: FormioForm = {
  components: [
    {
      input: true,
      key: 'string',
      label: '',
      props: {
        name: 'firstName',
      },
      tableView: false,
      type: 'String',
    },
    {
      entitySchema: 'CommonPersonalInformation',
      input: true,
      key: 'schema',
      label: '',
      props: {
        name: 'CommonPersonalInformation',
        selectedSchema: {
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
      },
      tableView: false,
      type: 'Schema',
    },
    {
      input: true,
      key: 'string1',
      label: '',
      props: {
        name: 'lastName',
      },
      tableView: false,
      type: 'String',
    },
    {
      input: true,
      key: 'document',
      label: '',
      props: {
        name: 'id',
      },
      tableView: false,
      type: 'Document',
    },
    {
      concatenatedContentType: 'Document',
      contentType: 'Document',
      input: true,
      key: 'list',
      label: '',
      props: {
        concatenatedContentType: 'Document',
        name: 'ids',
      },
      tableView: false,
      type: 'List',
    },
    {
      concatenatedContentType: 'DynamicEntity-SomeSchema',
      contentType: 'DynamicEntity',
      entitySchema: 'SomeSchema',
      input: true,
      key: 'list1',
      label: '',
      props: {
        concatenatedContentType: 'DynamicEntity-SomeSchema',
        name: 'schemas',
      },
      tableView: false,
      type: 'List',
    },
    {
      concatenatedContentType: 'Document',
      contentType: 'Document',
      input: true,
      key: 'list2',
      label: '',
      props: {
        concatenatedContentType: 'Document',
        name: 'ids2',
      },
      tableView: false,
      type: 'List',
    },
  ],
};

const flattenedSchemaMock: ISchemaDefinition = {
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
      type: 'DynamicEntity',
    },
    {
      constraints: [],
      name: 'lastName',
      type: 'String',
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

const noMetadataSchemaMock: ISchemaDefinition = {
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
      concatenatedContentType: 'Document',
      constraints: [],
      contentType: 'Document',
      name: 'ids2',
      type: 'List',
    },
  ],
  createdBy: '',
  createdTimestamp: '',
  description: '',
  id: '',
  key: '',
  lastUpdatedBy: '',
  lastUpdatedTimestamp: '',
  name: '',
  status: '',
};

const mockSchemaNoMetadata = new SchemaDefinitionModel(noMetadataSchemaMock);
const mockSchema = new SchemaDefinitionModel(flattenedSchemaMock);
const mockSchemaTree = new SchemaTreeDefinitionModel(SchemaTreeDefinitionMock);
const mockSchemaTreeNoData = new SchemaTreeDefinitionModel(noMetadataSchemaMock);

const schemaMetadataMock = new SchemaMetadataModel(flattenedSchemaMock);

describe('SchemaBuilderService', () => {
  let service: SchemaBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MockProvider(NuverialSnackBarService),
        MockProvider(WorkApiRoutesService, {
          getSchemaDefinitionByKey$: jest.fn().mockImplementation(() => of(mockSchema)),
          getSchemaTree$: jest.fn().mockImplementation(() => of(mockSchemaTree)),
          updateSchemaDefinition$: jest.fn().mockImplementation(() => of(mockSchema)),
        }),
      ],
    });
    service = TestBed.inject(SchemaBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('schemaBuilderFormFields$', () => {
    it('should return formio form matching the schema tree', done => {
      service['_updatedSchemaTree'].next(mockSchemaTree);

      service.schemaBuilderFormFields$.subscribe(result => {
        expect(result).toEqual(mockForm);

        done();
      });
    });

    it('should handle converting attributeConfigurations to proper json string', done => {
      const mockSchemaTreeWithDocuments = structuredClone(mockSchemaTree);
      mockSchemaTreeWithDocuments.attributes[3].attributeConfigurations = [
        {
          processorId: 'processorId',
          type: 'DocumentProcessor',
        },
      ];

      service['_updatedSchemaTree'].next(mockSchemaTreeWithDocuments);

      service.schemaBuilderFormFields$.subscribe(result => {
        const mockFormWithDocuments = structuredClone(mockForm);
        if (mockFormWithDocuments.components?.length) {
          mockFormWithDocuments.components[3]['props'].processors = '["processorId"]';
        }

        expect(result).toEqual(mockFormWithDocuments);

        done();
      });
    });

    it('should handle contentType', done => {
      const mockSchemaTreeWithContentType = structuredClone(mockSchemaTree);
      mockSchemaTreeWithContentType.attributes[0].contentType = 'Boolean';

      service['_updatedSchemaTree'].next(mockSchemaTreeWithContentType);

      service.schemaBuilderFormFields$.subscribe(result => {
        const mockFormWithContentType = structuredClone(mockForm);
        if (mockFormWithContentType.components?.length) {
          mockFormWithContentType.components[0]['contentType'] = 'Boolean';
        }

        expect(result).toEqual(mockFormWithContentType);

        done();
      });
    });
  });

  describe('getSchemaTreeByKey$', () => {
    it('should call getSchemaTree$ with the provided schema key', done => {
      const schemaKey = 'my-schema-key';
      const spy = jest.spyOn(service['_workApiRoutesService'], 'getSchemaTree$');

      service.getSchemaTreeByKey$(schemaKey).subscribe(result => {
        expect(result).toEqual(mockSchemaTree);
        expect(spy).toHaveBeenCalledWith(schemaKey);

        done();
      });
    });

    it('should return an observable of SchemaTreeDefinitionModel', done => {
      const schemaKey = 'my-schema-key';

      service.getSchemaTreeByKey$(schemaKey).subscribe(result => {
        expect(result).toEqual(mockSchemaTree);

        done();
      });
    });
  });

  it('toSchemaDefinition', () => {
    expect(service.toSchemaDefinition(mockForm)).toEqual(mockSchemaNoMetadata);
  });

  describe('createUpdateSchemaDefinition$', () => {
    it('should update the schema with the correct schema definition', done => {
      const schemaKey = 'FinancialBenefit';

      service['_schemaWrapper'] = mockSchema;

      const createUpdateSchemaDefinitionSpy = jest.spyOn(service['_workApiRoutesService'], 'updateSchemaDefinition$').mockReturnValue(of(mockSchema));

      service.updateSchemaDefinition(mockForm, schemaKey).subscribe(result => {
        expect(createUpdateSchemaDefinitionSpy).toHaveBeenCalledWith(schemaKey, mockSchema);
        expect(result).toEqual(mockSchemaTree);

        done();
      });
    });

    it('should update the schema with the correct schema definition when there are document processors', done => {
      const schemaKey = 'FinancialBenefit';

      // Mock schema definition with attribute configurations
      const mockSchemaWithDocuments = structuredClone(mockSchema);
      mockSchemaWithDocuments.attributes[0].attributeConfigurations = [
        {
          processorId: 'processorId',
          type: 'DocumentProcessor',
        },
      ];

      // Mock formio form with document processors
      const mockFormWithDocuments = structuredClone(mockForm);
      if (mockFormWithDocuments.components) {
        mockFormWithDocuments.components[0]['props'].processors = '["processorId"]';
      }

      service['_schemaWrapper'] = mockSchema;

      const createUpdateSchemaDefinitionSpy = jest.spyOn(service['_workApiRoutesService'], 'updateSchemaDefinition$').mockReturnValue(of(mockSchema));

      service.updateSchemaDefinition(mockFormWithDocuments, schemaKey).subscribe(_ => {
        expect(createUpdateSchemaDefinitionSpy).toHaveBeenCalledWith(schemaKey, mockSchemaWithDocuments);

        done();
      });
    });
  });

  describe('discardChanges', () => {
    it('should set the schema to the value of initialSchemaTree', done => {
      const updatedMockSchemaTree = mockSchemaTree;
      updatedMockSchemaTree.attributes = [];

      service['_initialSchemaTree'] = new BehaviorSubject(mockSchemaTree);
      service['_updatedSchemaTree'].next(updatedMockSchemaTree);

      service.discardChanges();

      service['_updatedSchemaTree'].asObservable().subscribe(result => {
        expect(result).toEqual(mockSchemaTree);

        done();
      });
    });
  });

  describe('updateMetaData', () => {
    it('should update the form metadata', () => {
      service['_schemaWrapper'] = mockSchema;
      const metaData = schemaMetadataMock;
      service.updateMetaData(metaData).subscribe(updatedMetaData => {
        expect(updatedMetaData).toEqual(metaData);
      });
    });
  });

  describe('updateFormComponents', () => {
    it('should update form components and emit updated schema tree', () => {
      const nextSpy = jest.spyOn(service['_updatedSchemaTree'], 'next');

      service.updateFormComponents(mockSchemaNoMetadata);

      expect(nextSpy).toHaveBeenCalledWith(mockSchemaTreeNoData);
    });

    it('should make API calls for attributes with entitySchema and update _schemaAttributes', fakeAsync(() => {
      const apiCallSpy = jest.spyOn(service['_workApiRoutesService'], 'getSchemaTree$').mockReturnValue(of(mockSchemaTree));
      const nextSpy = jest.spyOn(service['_schemaAttributes'], 'next');

      service.updateFormComponents(mockSchema).subscribe();

      tick();

      expect(apiCallSpy).toHaveBeenCalledWith(mockSchema.attributes[1].entitySchema);
      expect(nextSpy).toHaveBeenCalledWith([...service['_schemaAttributes'].getValue()]);
    }));
  });

  describe('getSchemaTreeAtrributes', () => {
    it('should update _schemaAttributes with selectedSchema from form components', () => {
      const initialAttributes = service['_schemaAttributes'].getValue();
      let expectedAttributes: ISchemaTreeDefinition[] = [];
      if (mockForm?.components) {
        expectedAttributes = [...initialAttributes, mockForm.components[1]['props'].selectedSchema];
      }

      service.getSchemaTreeAtrributes(mockForm);

      expect(service['_schemaAttributes'].getValue()).toEqual(expectedAttributes);
    });

    it('should not update _schemaAttributes if form components is undefined', () => {
      const initialAttributes = service['_schemaAttributes'].getValue();

      service.getSchemaTreeAtrributes({});

      expect(service['_schemaAttributes'].getValue()).toEqual(initialAttributes);
    });
  });
});
