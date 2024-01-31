import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  FormConfigurationModel,
  FormioConfigurationTestMock,
  ITransactionsPaginationResponse,
  RejectedDocument,
  TransactionMock2,
  TransactionMock3,
  TransactionMockWithDocuments,
  TransactionModel,
  TransactionModelMock,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { PagingRequestModel, PagingResponseModel } from '@dsg/shared/utils/http';
import { MockProvider, ngMocks } from 'ng-mocks';
import { ReplaySubject, of, throwError } from 'rxjs';
import { DashboardService } from './dashboard.service';

const formConfigurationModel = new FormConfigurationModel(FormioConfigurationTestMock);
const transactionPaginationResponseMock = {
  items: [new TransactionModel(TransactionMock2), new TransactionModel(TransactionMock3), new TransactionModel(TransactionMock3)],
} as ITransactionsPaginationResponse<TransactionModel>;

describe('DashboardService', () => {
  let transactions: ReplaySubject<ITransactionsPaginationResponse<TransactionModel>>;
  let service: DashboardService;

  beforeEach(() => {
    transactions = new ReplaySubject<ITransactionsPaginationResponse<TransactionModel>>(1);
    transactions.next(transactionPaginationResponseMock);

    TestBed.configureTestingModule({
      providers: [
        MockProvider(WorkApiRoutesService, {
          getAllTransactionsForUser$: jest.fn().mockReturnValue(transactions.asObservable()),
          getFormByTransactionId$: jest.fn().mockImplementation(() => of(formConfigurationModel)),
        }),
        MockProvider(NuverialSnackBarService),
      ],
    });
    service = TestBed.inject(DashboardService);
  });

  it('should load active transactions', fakeAsync(() => {
    let emittedTransactions: TransactionModel[] | undefined;
    const wmService = TestBed.inject(WorkApiRoutesService);
    const spy = jest.spyOn(wmService, 'getAllTransactionsForUser$');
    jest.spyOn(service as any, 'getFormConfigurationById$').mockReturnValue(of(formConfigurationModel));

    const pagination = new PagingRequestModel();
    service.loadActiveTransactions$(pagination).subscribe(result => {
      emittedTransactions = result.items;
    });

    tick();

    expect(spy).toBeCalledWith([{ field: 'isCompleted', value: false }], pagination);
    expect(emittedTransactions).toBeDefined();
    expect(emittedTransactions?.length).toBe(3);
  }));

  it('should load past transactions', fakeAsync(() => {
    let emittedTransactions: TransactionModel[] | undefined;
    const wmService = TestBed.inject(WorkApiRoutesService);
    const spy = jest.spyOn(wmService, 'getAllTransactionsForUser$');
    jest.spyOn(service as any, 'getFormConfigurationById$').mockReturnValue(of(formConfigurationModel));

    const pagination = new PagingRequestModel();
    service.loadPastTransactions$(pagination).subscribe(result => {
      emittedTransactions = result.items;
    });

    tick();

    expect(spy).toBeCalledWith([{ field: 'isCompleted', value: true }], pagination);
    expect(emittedTransactions).toBeDefined();
    expect(emittedTransactions?.length).toBe(3);
  }));

  it('should set the documents labels based on the form configuration', fakeAsync(() => {
    let emittedTransactions: TransactionModel[] | undefined;
    jest.spyOn(service as any, 'getFormConfigurationById$').mockReturnValue(of(formConfigurationModel));

    service.loadActiveTransactions$(new PagingRequestModel()).subscribe(result => {
      emittedTransactions = result.items;
    });

    tick();

    if (emittedTransactions) {
      expect(emittedTransactions[0].rejectedDocuments.length).toBe(0);
      expect(emittedTransactions[1].rejectedDocuments).toEqual([{ dataPath: 'documents.proofOfIncome', index: -1, label: 'Proof of Income/Tax' }]);
      expect(emittedTransactions[1].rejectedDocuments).toEqual([{ dataPath: 'documents.proofOfIncome', index: -1, label: 'Proof of Income/Tax' }]);
    }
  }));

  it('should set the documents labels based on the form configuration', fakeAsync(() => {
    const transactionMockWithMultipleDocuments = new TransactionModel(TransactionMockWithDocuments);
    transactionMockWithMultipleDocuments.rejectedDocuments[0].index = 3;
    transactionMockWithMultipleDocuments.rejectedDocuments[1].index = 1;
    transactionMockWithMultipleDocuments.data['documents'] = {
      idFront: [
        {},
        {},
        {},
        {
          documentId: '2d0b34d5-7951-4775-87c5-a198ed3e9f01',
        },
      ],
      proofOfIncome: [
        {},
        {
          documentId: '4c69ae11-8541-4cfa-a073-c3644ba78f9e',
        },
      ],
    };
    transactions.next({ items: [transactionMockWithMultipleDocuments] } as ITransactionsPaginationResponse<TransactionModel>);

    let emittedTransactions: TransactionModel[] | undefined;
    jest.spyOn(service as any, 'getFormConfigurationById$').mockReturnValue(of(formConfigurationModel));

    service.loadActiveTransactions$(new PagingRequestModel()).subscribe(result => {
      emittedTransactions = result.items;
    });

    tick();

    if (emittedTransactions) {
      expect(emittedTransactions[0].rejectedDocuments.length).toBe(2);
      expect(emittedTransactions[0].rejectedDocuments[0]).toEqual({ dataPath: 'documents.idFront', index: 3, label: 'Photo ID - Front of ID - Document 4' });
      expect(emittedTransactions[0].rejectedDocuments[1]).toEqual({ dataPath: 'documents.proofOfIncome', index: 1, label: 'Proof of Income/Tax - Document 2' });
    }
  }));

  it('should handle get all transactions error', async () => {
    const wmService = ngMocks.findInstance(WorkApiRoutesService);
    const spy = jest.spyOn(wmService, 'getAllTransactionsForUser$').mockImplementation(() => throwError(() => new Error('an error')));
    service.loadActiveTransactions$(new PagingRequestModel()).subscribe();

    expect(spy).toHaveBeenCalled();
  });

  it('should get the correct order for document keys', () => {
    const transactionModelMock = TransactionModelMock;
    jest.spyOn(service['_documentOrder'], 'has').mockReturnValue(false);
    jest.spyOn(service['_transactionDefinitionFormModelMap'], 'get').mockReturnValue(formConfigurationModel);
    const setSpy = jest.spyOn(service['_documentOrder'], 'set');

    const result = service['_getDocumentOrder'](transactionModelMock);
    expect(setSpy).toHaveBeenCalledWith('FinancialBenefit', ['documents.idFront', 'documents.idBack', 'documents.proofOfIncome']);
    expect(result).toEqual(['documents.idFront', 'documents.idBack', 'documents.proofOfIncome']);
  });

  describe('_sortRejectedDocuments', () => {
    const rejectedDocumentMock: RejectedDocument = { dataPath: 'documents.proofOfIncome', index: 3, label: 'rejected' };
    const rejectedDocumentMock2: RejectedDocument = { dataPath: 'documents.idFront', index: -1, label: 'rejected' };
    const rejectedDocumentMock3: RejectedDocument = { dataPath: 'documents.proofOfResidency', index: -1, label: 'rejected' };
    const rejectedDocumentMock4: RejectedDocument = { dataPath: 'documents.proofOfIncome', index: 1, label: 'rejected' };
    const sortOrder = ['documents.idFront', 'documents.idBack', 'documents.proofOfResidency', 'documents.proofOfIncome'];

    it('should return 0 if items not in sortOrder', () => {
      expect(service['_sortRejectedDocuments']([], rejectedDocumentMock, rejectedDocumentMock)).toEqual(0);
    });

    it('should sort documents based on index if same dataPaths', () => {
      const rejectedDocuments = [rejectedDocumentMock, rejectedDocumentMock4];
      expect(service['_sortRejectedDocuments'](sortOrder, rejectedDocumentMock, rejectedDocumentMock4)).toEqual(2);
      const result = rejectedDocuments.sort((firstDoc, secondDoc) => service['_sortRejectedDocuments'](sortOrder, firstDoc, secondDoc));
      expect(result).toEqual([rejectedDocumentMock4, rejectedDocumentMock]);
    });

    it('should sort rejected documents correctly with different dataPaths', () => {
      const rejectedDocuments = [rejectedDocumentMock, rejectedDocumentMock2, rejectedDocumentMock3];
      expect(service['_sortRejectedDocuments'](sortOrder, rejectedDocumentMock, rejectedDocumentMock2)).toEqual(3);
      const result = rejectedDocuments.sort((firstDoc, secondDoc) => service['_sortRejectedDocuments'](sortOrder, firstDoc, secondDoc));
      expect(result).toEqual([rejectedDocumentMock2, rejectedDocumentMock3, rejectedDocumentMock]);
    });
  });

  it('should reset _activeTransactions$ and _pastTransactions$ on cleanUp', () => {
    const activeTransactionsSpy = jest.spyOn(service['_activeTransactions$'], 'next');
    const pastTransactionsSpy = jest.spyOn(service['_pastTransactions$'], 'next');

    service.cleanUp();

    expect(activeTransactionsSpy).toHaveBeenCalledWith({
      items: [],
      pagingMetadata: new PagingResponseModel(),
    });

    expect(pastTransactionsSpy).toHaveBeenCalledWith({
      items: [],
      pagingMetadata: new PagingResponseModel(),
    });
  });
});
