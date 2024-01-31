import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormConfigurationModel, FormioConfigurationTestMock, TransactionMock, TransactionModel } from '@dsg/shared/data-access/work-api';
import { DocumentFormService, FormRendererService } from '@dsg/shared/feature/form-nuv';
import { NuverialSnackBarService, TitleService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';
import { ReadonlyComponent, StatusLabelColors } from './readonly.component';

const formConfigurationModel = new FormConfigurationModel(FormioConfigurationTestMock);
const transactionModelMock = new TransactionModel(TransactionMock);

describe('ReadonlyComponent', () => {
  let component: ReadonlyComponent;
  let fixture: ComponentFixture<ReadonlyComponent>;
  const transaction$ = new BehaviorSubject<TransactionModel>(new TransactionModel());
  const formConfiguration$ = new BehaviorSubject(formConfigurationModel);

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      { teardown: { destroyAfterEach: false } }, // required in formly tests
    );
  });

  beforeEach(async () => {
    transaction$.next(new TransactionModel());
    await TestBed.configureTestingModule({
      imports: [ReadonlyComponent, RouterTestingModule.withRoutes([]), NoopAnimationsModule],
      providers: [
        MockProvider(LoggingService),
        MockProvider(NuverialSnackBarService),
        MockProvider(DocumentFormService),
        MockProvider(HttpClient),
        MockProvider(FormRendererService, {
          formConfiguration$: formConfiguration$,
          transaction: transactionModelMock,
          transaction$: transaction$,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('reviewFormFields$', () => {
    it('should load review form configuration', done => {
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const errorSpy = jest.spyOn(snackService, 'notifyApplicationError');
      component.reviewFormFields$?.subscribe(formConfiguration => {
        expect(formConfiguration).toEqual(formConfigurationModel.toReviewForm());
        expect(errorSpy).not.toHaveBeenCalled();
        done();
      });
    });

    it('should notify if there is no formConfiguration', done => {
      formConfiguration$.next(undefined as any);
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const errorSpy = jest.spyOn(snackService, 'notifyApplicationError');
      component.reviewFormFields$?.subscribe(formConfiguration => {
        expect(formConfiguration).toBeFalsy();
        expect(errorSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('statusLabelColorClass', () => {
    it('should be StatusLabelColors.Black', () => {
      expect(component.statusLabelColorClass).toEqual(StatusLabelColors.Black);
    });

    it('should be StatusLabelColors.Green', () => {
      transaction$.next(new TransactionModel({ ...TransactionMock, status: 'Approved' }));

      component.transaction$?.subscribe();

      expect(component.statusLabelColorClass).toEqual(StatusLabelColors.Green);
    });

    it('should be StatusLabelColors.Red', () => {
      transaction$.next(new TransactionModel({ ...TransactionMock, status: 'Denied' }));

      component.transaction$?.subscribe();

      expect(component.statusLabelColorClass).toEqual(StatusLabelColors.Red);
    });
  });

  describe('externalTransactionId', () => {
    it('should be empty', () => {
      const emptyTransaction = new TransactionModel();
      expect(component.externalTransactionId).toEqual(emptyTransaction.externalId);
    });

    it('should be the externalId of the transaction', () => {
      transaction$.next(new TransactionModel({ ...TransactionMock, externalId: 'externalTestId' }));

      component.transaction$?.subscribe();

      expect(component.externalTransactionId).toEqual('externalTestId');
    });
  });

  describe('formData$', () => {
    it('should be the data of the transaction', done => {
      transaction$.next(new TransactionModel({ ...TransactionMock, data: { test: 'test' } }));
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const errorSpy = jest.spyOn(snackService, 'notifyApplicationError');
      component.formData$?.subscribe(formData => {
        expect(formData).toEqual({ test: 'test' });
        expect(errorSpy).not.toHaveBeenCalled();
        done();
      });
    });

    it('should notify if there is no formConfiguration', done => {
      transaction$.next(undefined as any);
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const errorSpy = jest.spyOn(snackService, 'notifyApplicationError');
      component.formData$?.subscribe(transactionModel => {
        expect(transactionModel).toBeFalsy();
        expect(errorSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('domChecks', () => {
    it('should display transaction name', async () => {
      transaction$.next(transactionModelMock);
      fixture.detectChanges();

      const headerTitle = fixture.debugElement.query(By.css('[data-testid=header-title]'));
      expect(headerTitle.nativeElement.textContent.trim()).toBe(transactionModelMock.transactionDefinitionName);
    });

    it('should display an transaction submission date', async () => {
      transaction$.next(transactionModelMock);
      fixture.detectChanges();

      const pipe = new DatePipe('en');
      const expectedSubmitDate = pipe.transform(transactionModelMock.submittedOn, 'MM/dd/yyyy hh:mm a');
      const headerSubmitDate = fixture.debugElement.query(By.css('[data-testid=header-submit-date]'));
      expect(headerSubmitDate.nativeElement.textContent.trim()).toBe(`Submitted: ${expectedSubmitDate}`);
    });

    it('should display transaction status', async () => {
      transaction$.next(transactionModelMock);
      fixture.detectChanges();

      const headerStatusLabel = fixture.debugElement.query(By.css('[data-testid=header-status-label]'));
      expect(headerStatusLabel.nativeElement.textContent.trim()).toBe(transactionModelMock.status);
    });
  });

  it('should set the html title to Review', async () => {
    const formRendererService = ngMocks.findInstance(FormRendererService);
    const titleService = ngMocks.findInstance(TitleService);

    let transactionName = '';
    formRendererService.transaction$.subscribe(t => {
      transactionName = t.transactionDefinitionName;
    });
    const titleSpy = jest.spyOn(titleService, 'setHtmlTitle');

    component.ngOnInit();

    expect(titleSpy).toHaveBeenCalledWith(`${transactionName} - Review`);
  });
});
