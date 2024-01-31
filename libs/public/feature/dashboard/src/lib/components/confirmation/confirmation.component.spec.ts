import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TransactionModelMock } from '@dsg/shared/data-access/work-api';
import { FormRendererService, FormTransactionConfirmationComponent } from '@dsg/shared/feature/form-nuv';
import { TitleService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import { ConfirmationComponent } from './confirmation.component';

global.structuredClone = (val: unknown) => JSON.parse(JSON.stringify(val));

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

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
      imports: [ConfirmationComponent, NoopAnimationsModule, FormTransactionConfirmationComponent],
      providers: [
        MockProvider(HttpClient),
        MockProvider(LoggingService),
        MockProvider(FormRendererService, {
          loadTransactionDetails$: jest.fn().mockImplementation(() => of([])),
          transaction: TransactionModelMock,
          transaction$: of(TransactionModelMock),
        }),
        MockProvider(TitleService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadApplicationId$', () => {
    it('should load the externalTransactionId', async () => {
      component.externalTransactionId$.subscribe(applicationId => {
        expect(applicationId).toEqual('mw');
      });
    });
  });

  it('should set the html title to Application Submitted', async () => {
    const formRendererService = ngMocks.findInstance(FormRendererService);
    const titleService = ngMocks.findInstance(TitleService);

    const transactionName = formRendererService.transaction.transactionDefinitionName;
    const titleSpy = jest.spyOn(titleService, 'setHtmlTitle');

    component.ngOnInit();

    expect(titleSpy).toHaveBeenCalledWith(`${transactionName} - Application Submitted`);
  });
});
