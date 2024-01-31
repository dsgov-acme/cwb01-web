import { TestBed } from '@angular/core/testing';
import { NestedFormListFormComponents, NestedFormListSchemaTree, SchemaTreeDefinitionModel, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { MockProvider, ngMocks } from 'ng-mocks';
import { firstValueFrom, of } from 'rxjs';
import { SchemaTreeService } from './schema-tree.service';

const schemaTreeModelMock = new SchemaTreeDefinitionModel(NestedFormListSchemaTree);

describe('SchemaTreeService', () => {
  let service: SchemaTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(WorkApiRoutesService, {
          getSchemaTree$: jest.fn().mockImplementation(() => of(schemaTreeModelMock)),
        } as any),
      ],
    });

    service = TestBed.inject(SchemaTreeService);
  });

  it('should set the form schema', done => {
    const testSchemaKey = 'Test123';
    const workApiService = ngMocks.findInstance(WorkApiRoutesService);
    const workSpy = jest.spyOn(workApiService, 'getSchemaTree$');

    service.getFormSchemaTree$(testSchemaKey).subscribe(async () => {
      expect(workSpy).toHaveBeenCalled();
      const schema = await firstValueFrom(service.schemaTree$);
      expect(schema).toEqual(schemaTreeModelMock);
      done();
    });
  });

  it('should set component key', done => {
    const testComponentKey = (NestedFormListFormComponents[0].components as any)[0].key;

    service.setComponentKey(testComponentKey);

    service['_componentKey'].subscribe(componentKey => {
      expect(componentKey).toEqual(testComponentKey);
      done();
    });
  });

  it('should set the form config schema from the component update', done => {
    service.setComponentUpdateFormConfig(NestedFormListFormComponents);

    service['_componentUpdateFormConfigSchema'].subscribe(formConfigSchema => {
      expect(formConfigSchema).toEqual(NestedFormListFormComponents);
      done();
    });
  });

  it('should get schema tree by component key', done => {
    service.getFormSchemaTree$('').subscribe();
    const testComponentKey = (NestedFormListFormComponents[0].components as any)[0].key;
    service.setComponentKey(testComponentKey);
    service.setComponentUpdateFormConfig(NestedFormListFormComponents);

    service.getSchemaKeySelectorSchemaTree$().subscribe(res => {
      expect(res).toEqual(NestedFormListSchemaTree.attributes[0].schema);
      done();
    });
  });

  it('should return the form schema if there is no component ', done => {
    service['_formSchemaTree'].next(schemaTreeModelMock);
    const testComponentKey = 'Test123';
    service.setComponentKey(testComponentKey);
    service.setComponentUpdateFormConfig(NestedFormListFormComponents);

    service.getSchemaKeySelectorSchemaTree$().subscribe(res => {
      expect(res).toEqual(schemaTreeModelMock);
      done();
    });
  });

  it('should cleanup and reset schema to formSchema', async () => {
    const testComponentKey = (NestedFormListFormComponents[0].components as any)[0].key;
    service.setComponentKey(testComponentKey);
    service.setComponentUpdateFormConfig(NestedFormListFormComponents);
    await firstValueFrom(service.getFormSchemaTree$(''));
    await firstValueFrom(service.getSchemaKeySelectorSchemaTree$());

    service.cleanUp();

    expect(await firstValueFrom(service.schemaTree$)).toEqual(schemaTreeModelMock);
    expect(await firstValueFrom(service['_componentKey'])).toEqual('');
    expect(await firstValueFrom(service['_componentUpdateFormConfigSchema'])).toEqual([]);
  });
});
