import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import {
  CustomerProvidedDocumentMock,
  DocumentRejectionReasonsMock,
  DocumentReviewStatusesMock,
  TransactionMock,
  TransactionMockWithDocuments,
} from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService } from '@dsg/shared/feature/app-state';
import { DocumentFormService } from '@dsg/shared/feature/form-nuv';
import { INuverialSelectOption, NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingAdapter } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { EMPTY, Observable, of, Subject, throwError } from 'rxjs';
import { TransactionDetailService } from '../transaction-detail/transaction-detail.service';
import { DocumentsReviewComponent } from './documents-review.component';

describe('DocumentsReviewComponent', () => {
  let component: DocumentsReviewComponent;
  let fixture: ComponentFixture<DocumentsReviewComponent>;

  const mockDialog = {
    open: jest.fn().mockReturnValue({
      afterClosed: () => of(''),
      componentInstance: {
        onCancel: new Subject(),
      },
    }),
  };

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      { teardown: { destroyAfterEach: false } }, // required in formly tests
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsReviewComponent, NoopAnimationsModule, ReactiveFormsModule, FormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ transactionId: 'transactionId' }),
            parent: {
              params: of({ transactionId: 'transactionId' }),
              snapshot: {
                paramMap: {
                  get: () => TransactionMockWithDocuments.id,
                },
                params: { transactionId: TransactionMockWithDocuments.id },
              },
            },
            snapshot: {
              paramMap: {
                get: () => TransactionMockWithDocuments.id,
              },
              params: { transactionId: TransactionMockWithDocuments.id },
            },
          },
        },
        MockProvider(LoggingAdapter),
        MockProvider(NuverialSnackBarService),
        MockProvider(DocumentFormService),
        MockProvider(TransactionDetailService, {
          customerProvidedDocuments$: of([
            { customerProvidedDocuments: TransactionMockWithDocuments.customerProvidedDocuments ?? [], hasIssues: false, isMultipleFileUpload: false },
          ]),
          getDocumentRejectionReasons$: jest.fn().mockImplementation(() => of(DocumentRejectionReasonsMock)),
          updateCustomerProvidedDocument: jest.fn().mockImplementation(() =>
            of(TransactionMock.id, CustomerProvidedDocumentMock.id, {
              ...CustomerProvidedDocumentMock,
              rejectionReasons: undefined,
              reviewStatus: 'NEW',
            }),
          ),
        }),
        MockProvider(EnumerationsStateService, {
          getEnumMap$: jest
            .fn()
            .mockImplementationOnce(() => of(DocumentReviewStatusesMock))
            .mockImplementationOnce(() => of(DocumentRejectionReasonsMock)),
        }),
        MockProvider(MatDialog, mockDialog),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('trackByFn', async () => {
    const results = component.trackByFn(1);

    expect(results).toEqual(1);
  });

  it('should provide rejected reasons labels', () => {
    expect(component.rejectedReasonsLabels).toBeTruthy();
    expect(component.rejectedReasonsLabels['POOR_QUALITY']).toEqual('Poor Quality');
    expect(component.rejectedReasonsLabels['INCORRECT_TYPE']).toEqual('Incorrect Type');
    expect(component.rejectedReasonsLabels['DOES_NOT_SATISFY_REQUIREMENTS']).toEqual('Does Not Satisfy Requirements');
    expect(component.rejectedReasonsLabels['SUSPECTED_FRAUD']).toEqual('Suspected Fraud');
  });

  // write a test to check that the document review statuses options are set
  it('should provide document review statuses', done => {
    component.reviewReasonsSelectOptions$.subscribe(options => {
      expect(options).toBeTruthy();
      expect(options[0].key).toEqual('REJECTED');
      expect(options[0].displayTextValue).toEqual('Rejected');
      expect(options[1].key).toEqual('NEW');
      expect(options[1].displayTextValue).toEqual('New');
      expect(options[2].key).toEqual('ACCEPTED');
      expect(options[2].displayTextValue).toEqual('Accepted');
      expect(options[3].key).toEqual('PENDING');
      expect(options[3].displayTextValue).toEqual('Pending');

      done();
    });
  });

  describe('updateCustomerProvidedDocument$', () => {
    it('should update CustomerProvidedDocument', fakeAsync(async () => {
      const documents = TransactionMock.customerProvidedDocuments;
      const service = ngMocks.findInstance(TransactionDetailService);
      const spy = jest.spyOn(service, 'updateCustomerProvidedDocument');

      if (documents) {
        const selectedOption: INuverialSelectOption = {
          disabled: false,
          displayTextValue: 'New',
          key: 'NEW',
          selected: false,
        };
        component.handleReviewStatus(selectedOption, documents[0]);
        expect(spy).toHaveBeenCalled();
      }
    }));
  });

  describe('openDocument$', () => {
    it('should handle error when document file data is not retrieved', done => {
      jest.spyOn(component['_documentFormService'], 'openDocument$').mockReturnValue(throwError(() => ({ status: 404 })));

      const notifyApplicationErrorSpy = jest.spyOn(component['_nuverialSnackBarService'], 'notifyApplicationError');

      component.openDocument('test-id');

      expect(notifyApplicationErrorSpy).toHaveBeenCalledWith('Document information could not be retrieved.');
      done();
    });
  });

  describe('Error Handling', () => {
    let snackErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      snackErrorSpy = jest.spyOn(snackService, 'notifyApplicationError');
    });

    it('should notify when opening a document fails', () => {
      const documentService = ngMocks.findInstance(DocumentFormService);
      const documentSpy = jest.spyOn(documentService, 'openDocument$').mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

      component.openDocument('id');

      fixture.detectChanges();

      expect(documentSpy).toHaveBeenCalled();
      expect(snackErrorSpy).toHaveBeenCalled();
    });

    it('should notify when error updating document', () => {
      const transactionService = ngMocks.findInstance(TransactionDetailService);
      const transactionSpy = jest
        .spyOn(transactionService, 'updateCustomerProvidedDocument')
        .mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

      const handleUpdateDocumentSpy = jest.spyOn(component as any, '_handleUpdateDocument');

      const selectedOption: Partial<INuverialSelectOption> = {
        key: 'NEW',
      };

      component.handleReviewStatus(selectedOption as INuverialSelectOption, CustomerProvidedDocumentMock);

      expect(handleUpdateDocumentSpy).toHaveBeenCalledWith(CustomerProvidedDocumentMock, selectedOption.key);
      expect(transactionSpy).toHaveBeenCalled();
      expect(snackErrorSpy).toHaveBeenCalled();
    });
  });

  describe('Document Review Status - NEW,PENDING,ACCEPTED', () => {
    it('should update document if status is NEW', () => {
      const transactionService = ngMocks.findInstance(TransactionDetailService);
      const transactionSpy = jest.spyOn(transactionService, 'updateCustomerProvidedDocument');

      const handleUpdateDocumentSpy = jest.spyOn(component as any, '_handleUpdateDocument');

      const selectedOption: Partial<INuverialSelectOption> = {
        key: 'NEW',
      };

      component.handleReviewStatus(selectedOption as INuverialSelectOption, CustomerProvidedDocumentMock);

      expect(handleUpdateDocumentSpy).toHaveBeenCalledWith(CustomerProvidedDocumentMock, selectedOption.key);
      expect(transactionSpy).toHaveBeenCalledWith(TransactionMockWithDocuments.id, CustomerProvidedDocumentMock.id, {
        ...CustomerProvidedDocumentMock,
        rejectionReasons: undefined,
        reviewStatus: 'NEW',
      });
    });
    it('should update document if status is PENDING', () => {
      const transactionService = ngMocks.findInstance(TransactionDetailService);
      const transactionSpy = jest.spyOn(transactionService, 'updateCustomerProvidedDocument');

      const handleUpdateDocumentSpy = jest.spyOn(component as any, '_handleUpdateDocument');

      const selectedOption: Partial<INuverialSelectOption> = {
        key: 'PENDING',
      };

      component.handleReviewStatus(selectedOption as INuverialSelectOption, CustomerProvidedDocumentMock);

      expect(handleUpdateDocumentSpy).toHaveBeenCalledWith(CustomerProvidedDocumentMock, selectedOption.key);
      expect(transactionSpy).toHaveBeenCalledWith(TransactionMockWithDocuments.id, CustomerProvidedDocumentMock.id, {
        ...CustomerProvidedDocumentMock,
        rejectionReasons: undefined,
        reviewStatus: 'PENDING',
      });
    });
    it('should update document if status is ACCEPTED', () => {
      const transactionService = ngMocks.findInstance(TransactionDetailService);
      const transactionSpy = jest.spyOn(transactionService, 'updateCustomerProvidedDocument');

      const handleUpdateDocumentSpy = jest.spyOn(component as any, '_handleUpdateDocument');

      const selectedOption: Partial<INuverialSelectOption> = {
        key: 'ACCEPTED',
      };

      component.handleReviewStatus(selectedOption as INuverialSelectOption, CustomerProvidedDocumentMock);

      expect(handleUpdateDocumentSpy).toHaveBeenCalledWith(CustomerProvidedDocumentMock, selectedOption.key);
      expect(transactionSpy).toHaveBeenCalledWith(TransactionMockWithDocuments.id, CustomerProvidedDocumentMock.id, {
        ...CustomerProvidedDocumentMock,
        rejectionReasons: undefined,
        reviewStatus: 'ACCEPTED',
      });
    });
  });

  describe('Document Review Status - REJECTED', () => {
    it('should update document with rejection reasons', () => {
      const selectedOption: Partial<INuverialSelectOption> = {
        key: 'REJECTED',
      };

      const rejectedReasonsMock = Array.from(DocumentRejectionReasonsMock, reason => reason[1]);

      const transactionService = ngMocks.findInstance(TransactionDetailService);
      const getDocumentRejectionReasonsSpy = jest.spyOn(transactionService, 'getDocumentRejectionReasons$');

      const dialogService = ngMocks.findInstance(MatDialog);
      const dialogOpenSpy = jest.spyOn(dialogService, 'open').mockReturnValue({
        afterClosed: () => of(rejectedReasonsMock),
        componentInstance: {
          onCancel: new EventEmitter(),
        },
      } as any);

      const handleUpdateDocumentSpy = jest.spyOn(component as any, '_handleUpdateDocument');

      component.handleReviewStatus(selectedOption as INuverialSelectOption, CustomerProvidedDocumentMock);

      expect(getDocumentRejectionReasonsSpy).toHaveBeenCalled();
      expect(dialogOpenSpy).toHaveBeenCalled();

      expect(handleUpdateDocumentSpy).toHaveBeenCalledWith(CustomerProvidedDocumentMock, selectedOption.key, rejectedReasonsMock);
    });

    it('should not call to update document if no rejected reasons are given', () => {
      const selectedOption: Partial<INuverialSelectOption> = {
        key: 'REJECTED',
      };

      // const rejectedReasonsMock: string[] = [];

      const transactionService = ngMocks.findInstance(TransactionDetailService);
      const getDocumentRejectionReasonsSpy = jest.spyOn(transactionService, 'getDocumentRejectionReasons$');

      const dialogService = ngMocks.findInstance(MatDialog);
      const dialogOpenSpy = jest.spyOn(dialogService, 'open').mockReturnValue({
        // afterClosed: () => of(rejectedReasonsMock),
        afterClosed: () => of(false),
        componentInstance: {
          onCancel: new EventEmitter(),
        },
      } as any);

      const handleUpdateDocumentSpy = jest.spyOn(component as any, '_handleUpdateDocument');

      component.handleReviewStatus(selectedOption as INuverialSelectOption, CustomerProvidedDocumentMock);

      expect(getDocumentRejectionReasonsSpy).toHaveBeenCalled();
      expect(dialogOpenSpy).toHaveBeenCalled();

      expect(handleUpdateDocumentSpy).not.toHaveBeenCalled();
    });

    it('should return the document state to preview value if rejection canceled', () => {
      const selectedOption: Partial<INuverialSelectOption> = {
        key: 'REJECTED',
      };

      const dialogService = ngMocks.findInstance(MatDialog);
      jest.spyOn(dialogService, 'open').mockReturnValue({
        afterClosed: () => EMPTY,
        componentInstance: {
          onCancel: new Observable(observer => {
            observer.next();
            observer.complete();
          }),
        },
      } as any);

      const handleUpdateDocumentSpy = jest.spyOn(component as any, '_handleUpdateDocument');

      component.handleReviewStatus(selectedOption as INuverialSelectOption, CustomerProvidedDocumentMock);

      expect(handleUpdateDocumentSpy).not.toHaveBeenCalled();
      expect(component.loading).toEqual(false);
    });
  });

  it('should do nothing if no selected key', () => {
    const selectedOption: Partial<INuverialSelectOption> = {
      key: '',
    };

    const transactionService = ngMocks.findInstance(TransactionDetailService);
    const getDocumentRejectionReasonsSpy = jest.spyOn(transactionService, 'getDocumentRejectionReasons$');

    const dialogService = ngMocks.findInstance(MatDialog);
    const dialogOpenSpy = jest.spyOn(dialogService, 'open').mockReturnValue({
      afterClosed: () => EMPTY,
      componentInstance: {
        onCancel: new EventEmitter(),
      },
    } as any);

    const handleUpdateDocumentSpy = jest.spyOn(component as any, '_handleUpdateDocument');

    component.handleReviewStatus(selectedOption as INuverialSelectOption, CustomerProvidedDocumentMock);

    expect(getDocumentRejectionReasonsSpy).not.toHaveBeenCalled();
    expect(dialogOpenSpy).not.toHaveBeenCalled();
    expect(handleUpdateDocumentSpy).not.toHaveBeenCalled();
  });
});
