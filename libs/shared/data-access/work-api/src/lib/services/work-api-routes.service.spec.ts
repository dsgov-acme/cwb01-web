import { HttpParams } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Filter, HttpTestingModule, PagingRequestModel, PagingResponseModel } from '@dsg/shared/utils/http';
import {
  ActiveFormsMock,
  ConfiguredEnumsMock,
  ConversationMock,
  DashboardCountModel,
  DashboardMock,
  DashboardModel,
  EmployerProfileInvite,
  EmployerProfileInviteMock,
  EmployerProfileLink,
  EmployerProfileLinkMock,
  FormConfigurationModel,
  FormMock,
  FormModelMock,
  FormioConfigurationTestMock,
  ICustomerProvidedDocument,
  IDashboardCount,
  INotesPaginationResponse,
  IParentSchemas,
  NewConversationModelMock,
  NewConversationResponseMock,
  NoteMock2,
  NoteModel,
  NoteModelMock,
  SchemaDefinitionMock,
  SchemaDefinitionModel,
  SchemaTreeDefinitionMock,
  SchemaTreeDefinitionModel,
  TransactionDefinitionMock,
  TransactionDefinitionModel,
  TransactionMock,
  TransactionModel,
  TransactionStatusCountList,
  UpdateTransactionOptions,
  UserEmployerProfileModel,
  UserEmployerProfilesListMock,
  WorkflowMock,
  WorkflowModel,
  WorkflowTaskMock,
} from '../models';
import { ProcessDocumentsMock, ProcessDocumentsModel } from './../models';
import { WorkApiRoutesService } from './work-api-routes.service';

/* eslint-disable @typescript-eslint/dot-notation */
describe('WorkApiService', () => {
  let service: WorkApiRoutesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpTestingModule],
    });
    service = TestBed.inject(WorkApiRoutesService);
    httpTestingController = TestBed.inject(HttpTestingController);

    jest.spyOn<any, any>(service, '_handlePost$');
    jest.spyOn<any, any>(service, '_handleGet$');
    jest.spyOn<any, any>(service, '_handlePut$');
    jest.spyOn<any, any>(service, '_handleDelete$');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service['_baseUrl']).toEqual('https://dsgov-test.com/wm/api');
  });

  it('updateSchemaDefinition$', done => {
    const mockSchemaDefinitionModel = new SchemaDefinitionModel(SchemaDefinitionMock);
    const key = 'mocktest';

    service.updateSchemaDefinition$(key, mockSchemaDefinitionModel).subscribe(schemaDefinitionModel => {
      expect(schemaDefinitionModel).toEqual(mockSchemaDefinitionModel);
      expect(service['_handlePut$']).toHaveBeenCalledWith(`/v1/admin/schemas/${key}`, SchemaDefinitionMock);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/schemas/${key}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(SchemaDefinitionMock);
  });

  it('createSchemaDefinition$', done => {
    const mockSchemaDefinitionModel = new SchemaDefinitionModel(SchemaDefinitionMock);

    service.createSchemaDefinition$(mockSchemaDefinitionModel).subscribe(schemaDefinitionModel => {
      expect(schemaDefinitionModel).toEqual(mockSchemaDefinitionModel);
      expect(service['_handlePost$']).toHaveBeenCalledWith(`/v1/admin/schemas`, SchemaDefinitionMock);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/schemas`);
    expect(req.request.method).toEqual('POST');
    req.flush(SchemaDefinitionMock);
  });

  it('getSchemaDefinitionByKey$', done => {
    const mockSchemaDefinitionModel = new SchemaDefinitionModel(SchemaDefinitionMock);
    const key = 'FinancialBenefit';

    service.getSchemaDefinitionByKey$(key).subscribe(schemaDefinitionModel => {
      expect(schemaDefinitionModel).toEqual(mockSchemaDefinitionModel);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/schemas/${key}`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/schemas/${key}`);
    expect(req.request.method).toEqual('GET');
    req.flush(SchemaDefinitionMock);
  });

  it('getSchemaDefinitionList$', done => {
    const mockSchemaDefinitionModel = new SchemaDefinitionModel(SchemaDefinitionMock);

    service.getSchemaDefinitionList$().subscribe(schemaDefinitionModel => {
      expect(schemaDefinitionModel).toEqual(mockSchemaDefinitionModel);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/entity/schema`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/entity/schema`);
    expect(req.request.method).toEqual('GET');
    req.flush(SchemaDefinitionMock);
  });

  it('getSchemaTree$', done => {
    const key = 'FinancialBenefit';
    const mockSchemaTreeDefinitionModel = new SchemaTreeDefinitionModel(SchemaTreeDefinitionMock);

    service.getSchemaTree$(key).subscribe(schemaDefinitionModel => {
      expect(schemaDefinitionModel).toEqual(mockSchemaTreeDefinitionModel);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/schemas/${key}?includeChildren=true`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockSchemaTreeDefinitionModel);
  });

  it('getSchemaParents$', done => {
    const key = 'FinancialBenefit';
    const mockIParentSchemas = { parentSchemas: ['test'] } as IParentSchemas;

    service.getSchemaParents$(key).subscribe(parentSchemas => {
      expect(parentSchemas).toEqual(mockIParentSchemas);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/schemas/${key}/parents`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/schemas/${key}/parents`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockIParentSchemas);
  });

  it('updateTransactionDefinition$', done => {
    const mockTransactionDefinitionModel = new TransactionDefinitionModel(TransactionDefinitionMock);

    service.updateTransactionDefinition$('testKey', mockTransactionDefinitionModel).subscribe(transactionDefinitionModel => {
      expect(transactionDefinitionModel).toEqual(mockTransactionDefinitionModel);
      expect(service['_handlePut$']).toHaveBeenCalledWith(`/v1/admin/transactions/testKey`, TransactionDefinitionMock);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/transactions/testKey`);
    expect(req.request.method).toEqual('PUT');
    req.flush(TransactionDefinitionMock);
  });

  it('createTransactionDefinition$', done => {
    const mockTransactionDefinitionModel = new TransactionDefinitionModel(TransactionDefinitionMock);

    service.createTransactionDefinition$(mockTransactionDefinitionModel).subscribe(transactionDefinitionModel => {
      expect(transactionDefinitionModel).toEqual(mockTransactionDefinitionModel);
      expect(service['_handlePost$']).toHaveBeenCalledWith(`/v1/admin/transactions`, TransactionDefinitionMock);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/transactions`);
    expect(req.request.method).toEqual('POST');
    req.flush(TransactionDefinitionMock);
  });

  it('getTransactionDefinitionByKey$', done => {
    const mockTransactionDefinitionModel = new TransactionDefinitionModel(TransactionDefinitionMock);

    service.getTransactionDefinitionByKey$('testKey').subscribe(transactionDefinitionModel => {
      expect(transactionDefinitionModel).toEqual(mockTransactionDefinitionModel);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/transactions/testKey`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/transactions/testKey`);
    expect(req.request.method).toEqual('GET');
    req.flush(TransactionDefinitionMock);
  });

  it('getEnumerations$', done => {
    const mockConfiguredEnums = ConfiguredEnumsMock;
    service.getEnumerations$().subscribe(configuredEnums => {
      expect(configuredEnums).toEqual(mockConfiguredEnums);
      expect(service['_handleGet$']).toHaveBeenCalledWith('/v1/enumerations');
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/enumerations`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockConfiguredEnums);
  });

  it('createTransaction$', done => {
    const mockTransactionModel = new TransactionModel(TransactionMock);

    service.createTransaction$('testKey').subscribe(transactionModel => {
      expect(transactionModel).toEqual(mockTransactionModel);
      expect(service['_handlePost$']).toHaveBeenCalledWith(`/v1/transactions`, { transactionDefinitionKey: 'testKey' });
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions`);
    expect(req.request.method).toEqual('POST');
    req.flush(TransactionMock);
  });

  it('updateTransactionById$_Submit', done => {
    const mockTransactionModel = new TransactionModel(TransactionMock);
    const updateOptions: UpdateTransactionOptions = {
      completeTask: true,
      formStepKey: 'personalInformation',
      taskId: 'taskId',
      transaction: mockTransactionModel.toSchema(),
      transactionId: 'testId',
    };

    service.updateTransactionById$(updateOptions).subscribe(transactionModel => {
      expect(transactionModel).toEqual(mockTransactionModel);
      expect(service['_handlePut$']).toHaveBeenCalledWith(
        `/v1/transactions/testId`,
        {
          assignedTo: 'agent',
          data: mockTransactionModel.toSchema().data,
          priority: 'high',
        },
        {
          params: {
            completeTask: 'true',
            formStepKey: 'personalInformation',
            taskId: 'taskId',
          },
        },
      );
      done();
    });

    const req = httpTestingController.expectOne(
      `${service['_baseUrl']}/v1/transactions/testId?completeTask=true&formStepKey=personalInformation&taskId=taskId`,
    );
    expect(req.request.method).toEqual('PUT');
    req.flush(TransactionMock);
  });

  it('updateTransactionById$_UpdateData', done => {
    const mockTransactionModel = new TransactionModel(TransactionMock);
    const updateOptions: UpdateTransactionOptions = {
      completeTask: false,
      formStepKey: undefined,
      taskId: undefined,
      transaction: mockTransactionModel.toSchema(),
      transactionId: 'testId',
    };

    service.updateTransactionById$(updateOptions).subscribe(transactionModel => {
      expect(transactionModel).toEqual(mockTransactionModel);
      expect(service['_handlePut$']).toHaveBeenCalledWith(
        `/v1/transactions/testId`,
        {
          assignedTo: 'agent',
          data: mockTransactionModel.toSchema().data,
          priority: 'high',
        },
        {
          params: {
            completeTask: 'false',
          },
        },
      );
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions/testId?completeTask=false`);
    expect(req.request.method).toEqual('PUT');
    req.flush(TransactionMock);
  });

  it('getTransactionById$', done => {
    const mockTransactionModel = new TransactionModel(TransactionMock);

    service.getTransactionById$('testId').subscribe(transactionModel => {
      expect(transactionModel).toEqual(mockTransactionModel);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/transactions/testId`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions/testId`);
    expect(req.request.method).toEqual('GET');
    req.flush(TransactionMock);
  });

  it('updateTransactionDocumentsById$', done => {
    const transactionId = 'testTransactionId';
    const documentId = 'testDocId';
    const mockCustomerProvidedDoc = {
      active: true,
      dataPath: 'testPath',
      id: 'testId',
      isErrorTooltipOpen: false,
      reviewStatus: 'testReviewStatus',
      transaction: 'testTransaction',
    } as ICustomerProvidedDocument;

    service.updateTransactionDocumentsById$(transactionId, documentId, mockCustomerProvidedDoc).subscribe(document => {
      expect(document).toEqual(mockCustomerProvidedDoc);
      expect(service['_handlePut$']).toHaveBeenCalledWith(`/v1/transactions/${transactionId}/documents/${documentId}`, mockCustomerProvidedDoc);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions/${transactionId}/documents/${documentId}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockCustomerProvidedDoc);
  });

  describe('getTransactionsList$', () => {
    const mockTransactionModel = new TransactionModel(TransactionMock);
    it('getTransactionsList$ with all arguments', done => {
      const transactionDefinitionSetKey = 'testKey';
      const pagingRequestModel = new PagingRequestModel();
      const filters: Filter[] = [{ field: 'name', value: 'test' }];

      service.getTransactionsList$(transactionDefinitionSetKey, filters, pagingRequestModel).subscribe(transactionModel => {
        expect(transactionModel.items).toEqual([mockTransactionModel]);
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/transactions?pageNumber=0&pageSize=10&sortOrder=ASC`, { params: expect.anything() });
        done();
      });

      const req = httpTestingController.expectOne(
        `${service['_baseUrl']}/v1/transactions?pageNumber=0&pageSize=10&sortOrder=ASC&transactionDefinitionSetKey=testKey&name=test`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush({ items: [TransactionMock], pagingMetadata: pagingRequestModel });
    });

    it('getTransactionsList$ without any arguments', done => {
      service.getTransactionsList$(undefined, undefined, undefined).subscribe(transactionModel => {
        expect(transactionModel.items).toEqual([mockTransactionModel]);
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/transactions`, '');
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions`);
      expect(req.request.method).toEqual('GET');
      req.flush({ items: [TransactionMock] });
    });
  });

  describe('getTransactionDefinitionsList$', () => {
    it('getTransactionDefinitionsList$ with all arguments', done => {
      const mockTransactionDefinitionModel = new TransactionDefinitionModel(TransactionDefinitionMock);
      const pagingRequestModel = new PagingRequestModel();
      const filters: Filter[] = [{ field: 'name', value: 'test' }];

      service.getTransactionDefinitionsList$(filters, pagingRequestModel).subscribe(transactionModel => {
        expect(transactionModel.items).toEqual([mockTransactionDefinitionModel]);
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/transactions?pageNumber=0&pageSize=10&sortOrder=ASC`, { params: expect.anything() });
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/transactions?pageNumber=0&pageSize=10&sortOrder=ASC&name=test`);
      expect(req.request.method).toEqual('GET');
      req.flush({ items: [TransactionDefinitionMock], pagingMetadata: pagingRequestModel });
    });

    it('getTransactionDefinitionsList$ without any arguments', done => {
      const mockTransactionDefinitionModel = new TransactionDefinitionModel(TransactionDefinitionMock);

      service.getTransactionDefinitionsList$().subscribe(transactionModel => {
        expect(transactionModel.items).toEqual([mockTransactionDefinitionModel]);
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/transactions`, '');
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/transactions`);
      expect(req.request.method).toEqual('GET');
      req.flush({ items: [TransactionDefinitionMock] });
    });
  });

  describe('getSchemaDefinitionsList$', () => {
    it('getSchemaDefinitionsList$ with pagingRequestModel and filters', done => {
      const mockSchemaDefinitionModel = new SchemaDefinitionModel(SchemaDefinitionMock);
      const pagingRequestModel = new PagingRequestModel();
      const filters: Filter[] = [{ field: 'name', value: 'test' }];

      service.getSchemaDefinitionsList$(filters, pagingRequestModel).subscribe(schemaModel => {
        expect(schemaModel.items).toEqual([mockSchemaDefinitionModel]);
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/schemas?pageNumber=0&pageSize=10&sortOrder=ASC`, { params: expect.anything() });
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/schemas?pageNumber=0&pageSize=10&sortOrder=ASC&name=test`);
      expect(req.request.method).toEqual('GET');
      req.flush({ items: [SchemaDefinitionMock], pagingMetadata: pagingRequestModel });
    });

    it('getSchemaDefinitionsList$ without arguments', done => {
      const mockSchemaDefinitionModel = new SchemaDefinitionModel(SchemaDefinitionMock);

      service.getSchemaDefinitionsList$().subscribe(schemaModel => {
        expect(schemaModel.items).toEqual([mockSchemaDefinitionModel]);
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/schemas`, '');
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/schemas`);
      expect(req.request.method).toEqual('GET');
      req.flush({ items: [SchemaDefinitionMock] });
    });
  });

  it('getWorkflowsList$', done => {
    const mockWorkflowModel = new WorkflowModel(WorkflowMock);
    const pagingRequestModel = new PagingRequestModel();
    service.getWorkflowsList$(pagingRequestModel).subscribe(workflowModel => {
      expect(workflowModel.items).toEqual([mockWorkflowModel]);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/workflows?pageNumber=0&pageSize=10&sortOrder=ASC`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/workflows?pageNumber=0&pageSize=10&sortOrder=ASC`);
    expect(req.request.method).toEqual('GET');
    req.flush({ items: [WorkflowMock], pagingMetadata: pagingRequestModel });
  });

  it('getWorkflowTasks$', done => {
    const processDefinitionKey = 'testKey';

    service.getWorkflowTasks$(processDefinitionKey).subscribe(workflowTasks => {
      expect(workflowTasks).toEqual([WorkflowTaskMock]);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/workflows/${processDefinitionKey}/tasks`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/workflows/${processDefinitionKey}/tasks`);
    expect(req.request.method).toEqual('GET');
    req.flush([WorkflowTaskMock]);
  });

  it('getTransactionStatuses$', done => {
    const mockTransactionStatusCountList = TransactionStatusCountList;

    service.getTransactionStatuses$().subscribe(transactionStatusCountList => {
      expect(mockTransactionStatusCountList).toEqual(transactionStatusCountList);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/transactions/statuses/count`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions/statuses/count`);
    expect(req.request.method).toEqual('GET');
    req.flush(TransactionStatusCountList);
  });

  describe('getAllTransactionsForUser$', () => {
    it('getAllTransactionsForUser$ without filters and paginationModel', done => {
      const mockTransactionModel = new TransactionModel(TransactionMock);

      service.getAllTransactionsForUser$().subscribe(transactionModels => {
        expect(transactionModels).toEqual({ items: [mockTransactionModel] });
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/my-transactions`, '');
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/my-transactions`);
      expect(req.request.method).toEqual('GET');
      req.flush({ items: [TransactionMock] });
    });
    it('getAllTransactionsForUser$', done => {
      const mockTransactionModel = new TransactionModel(TransactionMock);
      const filters: Filter[] = [{ field: 'name', value: 'test' }];

      service.getAllTransactionsForUser$(filters).subscribe(transactionModels => {
        expect(transactionModels).toEqual({ items: [mockTransactionModel] });
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/my-transactions`, { params: expect.anything() });
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/my-transactions?name=test`);
      expect(req.request.method).toEqual('GET');
      req.flush({ items: [TransactionMock] });
    });
  });

  describe('getFormByTransactionId$', () => {
    it('should get get form with taskName provided', done => {
      const mockFormModel = FormModelMock;

      service.getFormByTransactionId$('test', 'TestTask').subscribe(formModel => {
        expect(formModel).toEqual(mockFormModel);
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/transactions/test/active-forms`);
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions/test/active-forms`);
      expect(req.request.method).toEqual('GET');
      req.flush(ActiveFormsMock);
    });

    it('should get get form without taskName provided', done => {
      const mockFormModel = FormModelMock;

      service.getFormByTransactionId$('test').subscribe(formModel => {
        expect(formModel).toEqual(mockFormModel);
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/transactions/test/active-forms`);
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions/test/active-forms`);
      expect(req.request.method).toEqual('GET');
      req.flush(ActiveFormsMock);
    });
  });

  it('getFormConfigurations', done => {
    const mockFormConfigurationModel = new FormConfigurationModel(FormioConfigurationTestMock);

    service.getFormConfigurations$('transactionDefinitionKey').subscribe(formConfigurationModel => {
      expect(formConfigurationModel).toEqual(mockFormConfigurationModel.components);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/transactions/transactionDefinitionKey/forms`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/transactions/transactionDefinitionKey/forms`);
    expect(req.request.method).toEqual('GET');
    req.flush(FormioConfigurationTestMock);
  });

  it('getFormConfigurationByKey', done => {
    const mockFormConfigurationModel = new FormConfigurationModel(FormioConfigurationTestMock);

    service.getFormConfigurationByKey$('transactionDefinitionKey', 'key').subscribe(formConfigurationModel => {
      expect(formConfigurationModel).toEqual(mockFormConfigurationModel.components);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/transactions/transactionDefinitionKey/forms/key`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/transactions/transactionDefinitionKey/forms/key`);
    expect(req.request.method).toEqual('GET');
    req.flush(FormioConfigurationTestMock);
  });

  it('saveFormConfiguration', done => {
    const mockFormConfigurationModel = new FormConfigurationModel(FormioConfigurationTestMock);

    service.updateFormConfiguration$(FormMock, 'transactionDefinitionKey', 'key').subscribe(formConfigurationModel => {
      expect(formConfigurationModel).toEqual(mockFormConfigurationModel.components);
      expect(service['_handlePut$']).toHaveBeenCalledWith(`/v1/admin/transactions/transactionDefinitionKey/forms/key`, FormMock, {});
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/transactions/transactionDefinitionKey/forms/key`);
    expect(req.request.method).toEqual('PUT');
    req.flush(FormioConfigurationTestMock);
  });

  it('createFormConfiguration', done => {
    const mockFormConfigurationModel = new FormConfigurationModel(FormioConfigurationTestMock);

    service.createFormConfiguration$(FormMock, 'transactionDefinitionKey').subscribe(formConfigurationModel => {
      expect(formConfigurationModel).toEqual(mockFormConfigurationModel.components);
      expect(service['_handlePost$']).toHaveBeenCalledWith(`/v1/admin/transactions/transactionDefinitionKey/forms`, FormMock, {});
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/transactions/transactionDefinitionKey/forms`);
    expect(req.request.method).toEqual('POST');
    req.flush(FormioConfigurationTestMock);
  });

  it('createNote', done => {
    const transactionId = 'testTransactionId';
    service.createNote$(transactionId, NoteModelMock).subscribe(note => {
      expect(note).toEqual(NoteModelMock);
      expect(service['_handlePost$']).toHaveBeenCalledWith(`/v1/transactions/${transactionId}/notes`, NoteModelMock.toSchema());
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions/${transactionId}/notes`);
    expect(req.request.method).toEqual('POST');
    req.flush(NoteMock2);
  });

  describe('getNotes', () => {
    const notesResponse: INotesPaginationResponse<NoteModel> = {
      items: [NoteModelMock],
      pagingMetadata: new PagingResponseModel(),
    };
    const transactionId = 'testTransactionId';

    it('getNotes without pagingRequestModel', done => {
      service.getNotes$(transactionId, undefined).subscribe(paginationResponse => {
        expect(paginationResponse).toEqual(notesResponse);
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/transactions/${transactionId}/notes/`);
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions/${transactionId}/notes/`);
      expect(req.request.method).toEqual('GET');
      req.flush(notesResponse);
    });

    it('getNotes', done => {
      const pagingRequestModel = new PagingRequestModel();

      service.getNotes$(transactionId, pagingRequestModel).subscribe(paginationResponse => {
        expect(paginationResponse).toEqual(notesResponse);
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/transactions/${transactionId}/notes/${pagingRequestModel.toSchema()}`);
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions/${transactionId}/notes/${pagingRequestModel.toSchema()}`);
      expect(req.request.method).toEqual('GET');
      req.flush(notesResponse);
    });
  });

  it('getNote', done => {
    const transactionId = 'testTransactionId';
    const noteId = 'testNoteId123';

    service.getNote$(transactionId, noteId).subscribe(note => {
      expect(note).toEqual(NoteModelMock);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/transactions/${transactionId}/notes/${noteId}`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions/${transactionId}/notes/${noteId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(NoteModelMock);
  });

  it('deleteNote', done => {
    const transactionId = 'testTransactionId';
    const noteId = 'testNoteId123';

    service.deleteNote$(transactionId, noteId).subscribe(() => {
      expect(service['_handleDelete$']).toHaveBeenCalledWith(`/v1/transactions/${transactionId}/notes/${noteId}`, { observe: 'response' });
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions/${transactionId}/notes/${noteId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({}, { status: 204, statusText: 'No Content' });
  });

  it('updateNote', done => {
    const transactionId = 'testTransactionId';
    const noteId = 'testNoteId123';

    service.updateNote$(transactionId, noteId, NoteModelMock).subscribe(note => {
      expect(note).toEqual(NoteModelMock);
      expect(service['_handlePut$']).toHaveBeenCalledWith(`/v1/transactions/${transactionId}/notes/${noteId}`, NoteModelMock.toSchema());
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions/${transactionId}/notes/${noteId}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(NoteMock2);
  });

  it('processDocuments$', done => {
    const mockProcessDocumentsModel = new ProcessDocumentsModel(ProcessDocumentsMock);
    const mockProcessDocumentsResponse = {
      processors: ['processor1'],
    };

    service.processDocuments$('transactionId', mockProcessDocumentsModel).subscribe(processDocumentsResponse => {
      expect(processDocumentsResponse).toEqual(mockProcessDocumentsResponse);
      expect(service['_handlePost$']).toHaveBeenCalledWith(`/v1/transactions/transactionId/process-documents`, mockProcessDocumentsModel.toSchema());
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/transactions/transactionId/process-documents`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockProcessDocumentsResponse);
  });

  it('getDashboard$', done => {
    service.getDashboard$('transactionSetKey').subscribe(dashboard => {
      expect(dashboard).toEqual(new DashboardModel(DashboardMock));
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/dashboards/transactionSetKey`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/dashboards/transactionSetKey`);
    expect(req.request.method).toEqual('GET');
    req.flush(DashboardMock);
  });

  it('getDashboards$', done => {
    service.getDashboards$().subscribe(dashboard => {
      expect(dashboard).toEqual([new DashboardModel(DashboardMock)]);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/dashboards`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/dashboards`);
    expect(req.request.method).toEqual('GET');
    req.flush([DashboardMock]);
  });

  it('getDashboardCounts$', done => {
    const dashboardCountMock: IDashboardCount = { count: 2, tabLabel: 'tabTest' };

    service.getDashboardCounts$('transactionSetKey').subscribe(dashboardCount => {
      expect(dashboardCount).toEqual([new DashboardCountModel(dashboardCountMock)]);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/admin/dashboards/transactionSetKey/counts`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/admin/dashboards/transactionSetKey/counts`);
    expect(req.request.method).toEqual('GET');
    req.flush([dashboardCountMock]);
  });

  describe('getEmployerProfileLinks$', () => {
    it('getEmployerProfileLinks$ without filters and pagingRequestModel', done => {
      service.getEmployerProfileLinks$('123', undefined, undefined).subscribe(response => {
        expect(response.items).toEqual([new EmployerProfileLink(EmployerProfileLinkMock)]);
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/employer-profiles/123/link`, '');
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/employer-profiles/123/link`);
      expect(req.request.method).toEqual('GET');
      req.flush({ items: [EmployerProfileLinkMock] });
    });

    it('getEmployerProfileLinks$ with filters and pagingRequestModel', done => {
      const pagingRequestModel = new PagingRequestModel();
      const filters: Filter[] = [{ field: 'name', value: 'test' }];

      service.getEmployerProfileLinks$('123', filters, pagingRequestModel).subscribe(response => {
        expect(response.items).toEqual([new EmployerProfileLink(EmployerProfileLinkMock)]);
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/employer-profiles/123/link?pageNumber=0&pageSize=10&sortOrder=ASC&name=test`);
      expect(req.request.method).toEqual('GET');
      req.flush({ items: [EmployerProfileLinkMock], pagingMetadata: pagingRequestModel });
    });
  });

  it('deleteEmployerProfileLink$', done => {
    service.deleteEmployerProfileLink$('123', '45678').subscribe(() => {
      expect(service['_handleDelete$']).toHaveBeenCalledWith(`/v1/employer-profiles/123/link/45678`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/employer-profiles/123/link/45678`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({}, { status: 204, statusText: 'No Content' });
  });

  it('updateEmployerProfileLinkAccessLevel$', done => {
    service.updateEmployerProfileLinkAccessLevel$('123', '45678', 'admin').subscribe(profileLink => {
      expect(profileLink).toEqual(EmployerProfileLinkMock);
      expect(service['_handlePut$']).toHaveBeenCalledWith(`/v1/employer-profiles/123/link/45678`, { profileAccessLevel: 'admin' });
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/employer-profiles/123/link/45678`);
    expect(req.request.method).toEqual('PUT');
    req.flush(EmployerProfileLinkMock);
  });

  it('inviteUserEmployerProfile$', done => {
    const mockUser = {
      accessLevel: EmployerProfileLinkMock.profileAccessLevel,
      email: 'test@test.com',
    };
    service.inviteUserEmployerProfile$(UserEmployerProfilesListMock[0].id, mockUser.email, mockUser.accessLevel).subscribe(invite => {
      expect(invite).toEqual(EmployerProfileInviteMock);
      expect(service['_handlePost$']).toHaveBeenCalledWith(`/v1/employer-profiles/${UserEmployerProfilesListMock[0].id}/invitations`, mockUser);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/employer-profiles/${UserEmployerProfilesListMock[0].id}/invitations`);
    expect(req.request.method).toEqual('POST');
    req.flush(EmployerProfileInviteMock);
  });

  describe('getEmployerProfileInvites$', () => {
    it('getEmployerProfileInvites$ without filters and pagingRequestModel', done => {
      service.getEmployerProfileInvites$('123', undefined, undefined).subscribe(response => {
        expect(response.items).toEqual([new EmployerProfileInvite(EmployerProfileInviteMock)]);
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/employer-profiles/123/invitations`, '');
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/employer-profiles/123/invitations`);
      expect(req.request.method).toEqual('GET');
      req.flush({ items: [EmployerProfileInviteMock] });
    });

    it('getEmployerProfileInvites$ with filters', done => {
      const pagingRequestModel = new PagingRequestModel();
      const filters: Filter[] = [{ field: 'name', value: 'test' }];

      service.getEmployerProfileInvites$('123', filters, pagingRequestModel).subscribe(response => {
        expect(response.items).toEqual([new EmployerProfileInvite(EmployerProfileInviteMock)]);
        done();
      });

      const req = httpTestingController.expectOne(
        `${service['_baseUrl']}/v1/employer-profiles/123/invitations?pageNumber=0&pageSize=10&sortOrder=ASC&name=test`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush({ items: [EmployerProfileInviteMock], pagingMetadata: pagingRequestModel });
    });
  });
  it('getUserProfiles$', done => {
    const mockUserProfiles = UserEmployerProfilesListMock;
    service.getUserProfiles$('EMPLOYER').subscribe(profiles => {
      expect(profiles).toEqual(mockUserProfiles.map(profile => new UserEmployerProfileModel(profile)));

      expect(service['_handleGet$']).toHaveBeenCalledWith(
        `/v1/my-profiles`,
        expect.objectContaining({
          params: expect.any(HttpParams),
        }),
      );
      done();
    });

    const req = httpTestingController.expectOne(r => r.url === `${service['_baseUrl']}/v1/my-profiles` && r.params.get('type') === 'EMPLOYER');
    expect(req.request.method).toEqual('GET');
    req.flush(mockUserProfiles.map(profile => new UserEmployerProfileModel(profile)));
  });

  it('deleteEmployerProfileInvite$', done => {
    service.deleteEmployerProfileInvite$('123', '135134').subscribe(() => {
      expect(service['_handleDelete$']).toHaveBeenCalledWith(`/v1/employer-profiles/123/invitations/135134`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/employer-profiles/123/invitations/135134`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({}, { status: 204, statusText: 'No Content' });
  });

  describe('getConversations$', () => {
    it('getConversations$ without filters and pagingRequestModel', done => {
      service.getConversations$(undefined, undefined).subscribe(response => {
        expect(response.items).toEqual([ConversationMock]);
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/conversations`, '');
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/conversations`);
      expect(req.request.method).toEqual('GET');
      req.flush({ items: [ConversationMock] });
    });

    it('getConversations$ with filters', done => {
      const pagingRequestModel = new PagingRequestModel();
      const filters: Filter[] = [{ field: 'name', value: 'test' }];

      service.getConversations$(filters, pagingRequestModel).subscribe(response => {
        expect(response.items).toEqual([ConversationMock]);
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/conversations?pageNumber=0&pageSize=10&sortOrder=ASC&name=test`);
      expect(req.request.method).toEqual('GET');
      req.flush({ items: [ConversationMock], pagingMetadata: pagingRequestModel });
    });
  });

  it('createConversation$', done => {
    service.createConversation$(NewConversationModelMock).subscribe(response => {
      expect(response).toEqual(NewConversationResponseMock);
      expect(service['_handlePost$']).toHaveBeenCalledWith(`/v1/conversations`, NewConversationModelMock.toSchema());
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/conversations`);
    expect(req.request.method).toEqual('POST');
    req.flush(NewConversationResponseMock);
  });
});
