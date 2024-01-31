import { ComponentFixture } from '@angular/core/testing';
import {
  ITransactionsPaginationResponse,
  TransactionMock,
  TransactionMock2,
  TransactionMock3,
  TransactionModel,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import { NuverialButtonComponent, NuverialSnackBarService, TitleService } from '@dsg/shared/ui/nuverial';
import { PagingResponseModel } from '@dsg/shared/utils/http';
import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder, MockProvider, ngMocks } from 'ng-mocks';
import { ReplaySubject, of, throwError } from 'rxjs';
import { DashboardService } from '../../services';
import { DashboardComponent } from './dashboard.component';

const transactions: TransactionModel[] = [
  new TransactionModel(TransactionMock),
  new TransactionModel(TransactionMock2),
  new TransactionModel(TransactionMock3),
];

const transactionPaginationResponse = new ReplaySubject<ITransactionsPaginationResponse<TransactionModel>>(1);

const dependencies = MockBuilder(DashboardComponent)
  .keep(NuverialButtonComponent)
  .provide(
    MockProvider(WorkApiRoutesService, {
      createTransaction$: jest.fn().mockImplementation(() => of(new TransactionModel(TransactionMock))),
    }),
  )
  .provide(
    MockProvider(DashboardService, {
      activeTransactions$: transactionPaginationResponse.asObservable(),

      loadActiveTransactions$: () => transactionPaginationResponse.asObservable(),
      loadPastTransactions$: () => transactionPaginationResponse.asObservable(),
      pastTransactions$: transactionPaginationResponse.asObservable(),
    }),
  )
  .provide(
    MockProvider(TitleService, {
      portalTitle$: of('Public portal'),
    }),
  )
  .build();

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  transactionPaginationResponse.next({ items: transactions, pagingMetadata: new PagingResponseModel() });

  const { fixture } = await render(DashboardComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    fixture = (await getFixture({})).fixture;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });

  it('trackByFn', async () => {
    const results = component.trackByFn(1, {});

    expect(results).toEqual({});
  });

  describe('transactions$', () => {
    it('should get all transactions', async () => {
      expect(screen.getByText('Transaction ID: MW')).toBeInTheDocument();
      expect(screen.getByText('One or more documents require correction')).toBeInTheDocument();
      expect(screen.getByText('documents.proofOfIncome')).toBeInTheDocument();
    });

    it('should show rejected document by label', async () => {
      const transaction = new TransactionModel(TransactionMock3);
      transaction.rejectedDocuments = [
        {
          dataPath: 'personalInformation.firstName',
          index: 0,
          label: 'Test Label',
        },
      ];

      transactionPaginationResponse.next({ items: [transaction], pagingMetadata: new PagingResponseModel() });

      fixture.detectChanges();

      expect(screen.getByText('Transaction ID: CD')).toBeInTheDocument();
      expect(screen.getByText('One or more documents require correction')).toBeInTheDocument();
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    describe('createNewTransaction', () => {
      it('should create a transaction', async () => {
        const service = ngMocks.findInstance(WorkApiRoutesService);
        const spy = jest.spyOn(service, 'createTransaction$');

        component.createNewTransaction({
          disabled: false,
          displayTextValue: 'Financial Benefit',
          key: 'FinancialBenefit',
          selected: false,
        });

        expect(spy).toHaveBeenCalled();
      });

      it('should handle create transaction error', async () => {
        const wmService = ngMocks.findInstance(WorkApiRoutesService);
        const spy = jest.spyOn(wmService, 'createTransaction$').mockImplementation(() => throwError(() => new Error('an error')));
        const snackBarService = ngMocks.findInstance(NuverialSnackBarService);
        const snackBarSpy = jest.spyOn(snackBarService, 'notifyApplicationError');

        component.createNewTransaction({
          disabled: false,
          displayTextValue: 'Financial Benefit',
          key: 'FinancialBenefit',
          selected: false,
        });

        expect(spy).toHaveBeenCalled();
        expect(snackBarSpy).toHaveBeenCalled();
      });
    });
  });
  it('should load more active applications', () => {
    const initialPageNumber = component['_activeTransactionsPagination'].value.pageNumber;
    component.loadMoreActiveApplications();
    expect(component['_activeTransactionsPagination'].value.pageNumber).toBe(initialPageNumber + 1);
  });

  it('should load more past applications', () => {
    const initialPageNumber = component['_pastTransactionsPagination'].value.pageNumber;
    component.loadMorePastApplications();
    expect(component['_pastTransactionsPagination'].value.pageNumber).toBe(initialPageNumber + 1);
  });

  it('should call cleanUp method of _dashboardService on ngOnDestroy', () => {
    const dashboardServiceSpy = jest.spyOn(component['_dashboardService'], 'cleanUp');
    component.ngOnDestroy();
    expect(dashboardServiceSpy).toHaveBeenCalled();
  });

  it('should set the html title OnInit to Dashboard', async () => {
    const titleService = ngMocks.findInstance(TitleService);
    const titleSpy = jest.spyOn(titleService, 'setHtmlTitle');

    component.ngOnInit();

    expect(titleSpy).toHaveBeenCalledWith(`Dashboard`, true);
  });
});
