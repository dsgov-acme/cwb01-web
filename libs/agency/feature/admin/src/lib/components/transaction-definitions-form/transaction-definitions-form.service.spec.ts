import { TestBed } from '@angular/core/testing';
import { Filter, PagingRequestModel } from '@dsg/shared/utils/http';
import { SchemaDefinitionListSchemaMock, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { TransactionDefinitionsFormService } from './transaction-definitions-form.service';
describe('TransactionDefinitionsFormService', () => {
  let service: TransactionDefinitionsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(WorkApiRoutesService, {
          getSchemaDefinitionsList$: jest.fn().mockImplementation(() => of(SchemaDefinitionListSchemaMock)),
        }),
      ],
    });
    service = TestBed.inject(TransactionDefinitionsFormService);
  });

  it('loadSchemas$', done => {
    const workApiRoutesService = TestBed.inject(WorkApiRoutesService);
    const filters: Filter[] = [{ field: 'name', value: 'test' }];
    const pagingRequestModel = new PagingRequestModel();
    const getSchemaDefinitionsListSpy = jest.spyOn(workApiRoutesService, 'getSchemaDefinitionsList$');
    const _schemasNextSpy = jest.spyOn(service['_schemas'], 'next');

    service.loadSchemas$(filters, pagingRequestModel).subscribe(() => {
      expect(getSchemaDefinitionsListSpy).toHaveBeenCalledWith(filters, pagingRequestModel);
      expect(_schemasNextSpy).toHaveBeenCalledWith(SchemaDefinitionListSchemaMock.items.sort((a, b) => a.name.localeCompare(b.name)));
      done();
    });
  });
});
