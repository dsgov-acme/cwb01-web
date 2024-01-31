import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import {
  DocumentRejectionReasonsMock,
  FormConfigurationModel,
  FormioConfigurationTestMock,
  TransactionMockWithDocuments,
  TransactionModel,
} from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService, UserStateService } from '@dsg/shared/feature/app-state';
import { DocumentFormService, FormRendererService } from '@dsg/shared/feature/form-nuv';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { TransactionDetailService } from '../transaction-detail/transaction-detail.service';
import { ReviewFormComponent } from './review-form.component';

const formConfigurationModel = new FormConfigurationModel(FormioConfigurationTestMock);

describe('ReviewFormComponent', () => {
  let component: ReviewFormComponent;
  let fixture: ComponentFixture<ReviewFormComponent>;

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
      imports: [ReviewFormComponent, NoopAnimationsModule],
      providers: [
        MockProvider(NuverialSnackBarService),
        MockProvider(LoggingService),
        MockProvider(DocumentFormService),
        MockProvider(TransactionDetailService, {
          customerProvidedDocuments$: of([
            { customerProvidedDocuments: TransactionMockWithDocuments.customerProvidedDocuments ?? [], hasIssues: false, isMultipleFileUpload: false },
          ]),
          storeCustomerDocuments$: jest.fn().mockImplementation(() => of([])),
        }),
        MockProvider(EnumerationsStateService, {
          getEnumMap$: jest.fn().mockImplementation(() => of(DocumentRejectionReasonsMock)),
        }),
        MockProvider(FormRendererService, {
          formConfiguration: formConfigurationModel,
          formConfiguration$: of(formConfigurationModel),
          loadTransactionDetails$: jest.fn().mockImplementation(() => of([])),
          transaction: new TransactionModel(TransactionMockWithDocuments),
          transaction$: of(new TransactionModel(TransactionMockWithDocuments)),
        }),
        MockProvider(UserStateService, {
          getUserById$: jest.fn().mockImplementation(() => of({ displayName: 'Mocked Name' })),
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ transactionId: 'testId' })),
            params: of({ transactionId: 'transactionId' }),
            snapshot: {
              paramMap: {
                get: () => TransactionMockWithDocuments.id,
              },
              params: { transactionId: TransactionMockWithDocuments.id },
              queryParams: {},
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formRendererConfiguration$', () => {
    it('should load form configuration', done => {
      component.formRendererConfiguration$?.subscribe(formConfiguration => {
        expect(formConfiguration).toEqual(formConfigurationModel.toReviewForm());

        done();
      });
    });
  });
});
