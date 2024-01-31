import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormConfigurationModel, FormioConfigurationTestMock, TransactionMock, TransactionModel } from '@dsg/shared/data-access/work-api';
import { DocumentFormService, FormRendererService } from '@dsg/shared/feature/form-nuv';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider } from 'ng-mocks';
import { ReplaySubject, of } from 'rxjs';
import { ReadonlyComponent } from './readonly.component';

const formConfigurationModel = new FormConfigurationModel(FormioConfigurationTestMock);

describe('ReadonlyComponent', () => {
  let component: ReadonlyComponent;
  let fixture: ComponentFixture<ReadonlyComponent>;
  let transaction: ReplaySubject<TransactionModel>;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      { teardown: { destroyAfterEach: false } }, // required in formly tests
    );
  });

  beforeEach(async () => {
    transaction = new ReplaySubject<TransactionModel>(1);

    await TestBed.configureTestingModule({
      imports: [ReadonlyComponent, RouterTestingModule.withRoutes([]), NoopAnimationsModule],
      providers: [
        MockProvider(LoggingService),
        MockProvider(NuverialSnackBarService),
        MockProvider(DocumentFormService),
        MockProvider(HttpClient),
        MockProvider(FormRendererService, {
          formConfiguration$: of(formConfigurationModel),
          transaction$: transaction.asObservable(),
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
      component.reviewFormFields$?.subscribe(formConfiguration => {
        expect(formConfiguration).toEqual(formConfigurationModel.toReviewForm());

        done();
      });
    });
  });

  describe('formData$', () => {
    it('should be the data of the transaction', done => {
      transaction.next(new TransactionModel({ ...TransactionMock, data: { test: 'test' } }));

      component.formData$?.subscribe(formData => {
        expect(formData).toEqual({ test: 'test' });

        done();
      });
    });
  });
});
