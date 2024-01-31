import { TestBed } from '@angular/core/testing';
import { FormConfigurationModel, FormModel, FormModelMock, TransactionMock, TransactionModel, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { MockProvider, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import { FormRendererService } from './form-renderer.service';

const transactionModelMock = new TransactionModel(TransactionMock);

describe('FormRendererService', () => {
  let service: FormRendererService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(WorkApiRoutesService, {
          getFormByTransactionId$: jest.fn().mockImplementation(() => of(FormModelMock)),
          getTransactionById$: jest.fn().mockImplementation(() => of(transactionModelMock)),
          updateTransactionById$: jest.fn().mockImplementation(() => of(transactionModelMock)),
        }),
      ],
    });
    service = TestBed.inject(FormRendererService);
    service['_transactionId'].next('testId');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('_getFormConfiguration$', () => {
    it('should get a formConfigurationModel', done => {
      const workApiService = ngMocks.findInstance(WorkApiRoutesService);
      const getFormByTransactionId$Spy = jest.spyOn(workApiService, 'getFormByTransactionId$');
      const _formSpy = jest.spyOn(service['_form'], 'next');

      service['_transactionId'].next('testId');
      service['_getFormConfiguration$']().subscribe(formModel => {
        expect(formModel).toEqual(FormModelMock);
        expect(getFormByTransactionId$Spy).toHaveBeenCalledWith('testId');
        expect(_formSpy).toBeCalledWith(FormModelMock);

        done();
      });
    });
  });

  describe('_getTransaction$', () => {
    it('should get a transactionModel', done => {
      const workApiService = ngMocks.findInstance(WorkApiRoutesService);
      const getTransactionById$Spy = jest.spyOn(workApiService, 'getTransactionById$');
      const _transactionSpy = jest.spyOn(service['_transaction'], 'next');

      service['_transactionId'].next('testId');
      service['_getTransaction$']().subscribe(transactionModel => {
        expect(transactionModel).toEqual(transactionModelMock);
        expect(getTransactionById$Spy).toHaveBeenCalledWith('testId');
        expect(_transactionSpy).toBeCalledWith(transactionModelMock);

        done();
      });
    });
  });

  describe('transaction$', () => {
    it('should get transactionData', done => {
      service['_getTransaction$']().subscribe();

      service.transaction$.subscribe(transactionModel => {
        expect(transactionModel.data).toEqual(transactionModelMock.data);

        done();
      });
    });
  });

  describe('formConfiguration$', () => {
    it('should get formConfiguration', done => {
      service['_getFormConfiguration$']().subscribe();

      service.formConfiguration$.subscribe(formConfiguration => {
        expect(formConfiguration).toEqual(FormModelMock.formConfigurationModel);

        done();
      });
    });
  });

  describe('loadTransactionDetails$', () => {
    it('should load transaction details', done => {
      service.loadTransactionDetails$('testId').subscribe();

      service.transaction$.subscribe(transactionModel => {
        expect(service['_transactionId'].value).toEqual('testId');
        expect(transactionModel.data).toEqual(transactionModelMock.data);

        done();
      });
    });

    it('should load form configuration', done => {
      service.loadTransactionDetails$('testId').subscribe();

      service.formConfiguration$.subscribe(formConfiguration => {
        expect(service['_transactionId'].value).toEqual('testId');
        expect(formConfiguration).toEqual(FormModelMock.formConfigurationModel);

        done();
      });
    });
  });

  describe('updateTransaction$', () => {
    it('should update the transaction', done => {
      const workApiService = ngMocks.findInstance(WorkApiRoutesService);
      const getTransactionById$Spy = jest.spyOn(workApiService, 'updateTransactionById$');
      const _transactionSpy = jest.spyOn(service['_transaction'], 'next');

      service['_transactionId'].next('testId');
      service.updateTransaction$().subscribe(transactionModel => {
        expect(transactionModel).toEqual(transactionModelMock);
        expect(_transactionSpy).toBeCalledWith(transactionModelMock);
        expect(getTransactionById$Spy).toHaveBeenCalledWith(expect.objectContaining({ transaction: { data: {} }, transactionId: 'testId' }));
        done();
      });
    });
  });

  describe('updateTransactionPriority', () => {
    it('should update the transaction with taskId', done => {
      const workApiService = ngMocks.findInstance(WorkApiRoutesService);
      const getTransactionById$Spy = jest.spyOn(workApiService, 'updateTransactionById$');
      const _transactionSpy = jest.spyOn(service['_transaction'], 'next');

      service['_transactionId'].next('testId');
      service['_taskId'].next('testId');
      service.updateTransaction$(true).subscribe(transactionModel => {
        expect(transactionModel).toEqual(transactionModelMock);
        expect(_transactionSpy).toBeCalledWith(transactionModelMock);
        expect(getTransactionById$Spy).toHaveBeenCalledWith({
          completeTask: true,
          formStepKey: undefined,
          taskId: 'testId',
          transaction: { data: {} },
          transactionId: 'testId',
        });

        done();
      });
    });
  });

  it('should set _form', () => {
    const spy = jest.spyOn(service['_form'], 'next');
    const formConfigurationModel = new FormConfigurationModel();
    const formModel = new FormModel();
    formModel.formConfigurationModel = formConfigurationModel;

    service.setFormConfiguration(formConfigurationModel);

    expect(spy).toHaveBeenCalledWith(formModel);
  });

  it('should set form errors', () => {
    const spy = jest.spyOn(service['_formErrors'], 'next');

    service.setFormErrors([]);

    expect(spy).toHaveBeenCalledWith([]);
  });

  it('should reset form errors', () => {
    const spy = jest.spyOn(service['_formErrors'], 'next');

    service.resetFormErrors();

    expect(spy).toHaveBeenCalledWith([]);
  });

  it('should cleanup service state', () => {
    jest.spyOn(service['_formErrors'], 'next');
    jest.spyOn(service['_transactionId'], 'next');
    jest.spyOn(service['_transaction'], 'next');
    jest.spyOn(service['_form'], 'next');

    service.cleanUp();

    expect(service['_formErrors'].next).toHaveBeenCalledWith([]);
    expect(service['_transactionId'].next).toHaveBeenCalledWith('');
    expect(service['_transaction'].next).toHaveBeenCalledWith(new TransactionModel());
    expect(service['_form'].next).toHaveBeenCalledWith(new FormModel());
  });

  it('should get transaction', () => {
    service['_transaction'].next(transactionModelMock);

    expect(service.transaction).toEqual(transactionModelMock);
  });

  it('should get formConfiguration', () => {
    service['_form'].next(FormModelMock);

    expect(service.formConfiguration).toEqual(FormModelMock.formConfigurationModel);
  });
});
