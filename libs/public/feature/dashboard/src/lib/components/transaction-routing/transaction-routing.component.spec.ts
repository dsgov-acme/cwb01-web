import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Event, NavigationEnd, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormMock, ITransactionActiveTask, TransactionMock, TransactionModel } from '@dsg/shared/data-access/work-api';
import { DocumentFormService, FormRendererService } from '@dsg/shared/feature/form-nuv';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { TransactionRoutingComponent } from './transaction-routing.component';

describe('IntakeFormRouterComponent', () => {
  let component: TransactionRoutingComponent;
  let fixture: ComponentFixture<TransactionRoutingComponent>;
  let routerEventsSubject: Subject<Event>;
  const paramMap$ = new BehaviorSubject(convertToParamMap({ transactionId: 'testId' }));

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      { teardown: { destroyAfterEach: false } }, // required in formly tests
    );
  });

  beforeEach(async () => {
    routerEventsSubject = new Subject<Event>();
    paramMap$.next(convertToParamMap({ transactionId: 'testId' }));

    await TestBed.configureTestingModule({
      imports: [TransactionRoutingComponent, RouterTestingModule.withRoutes([]), NoopAnimationsModule],
      providers: [
        MockProvider(Router, {
          events: routerEventsSubject.asObservable(),
          navigate: jest.fn(),
        } as any),
        MockProvider(LoggingService),
        MockProvider(NuverialSnackBarService),
        MockProvider(DocumentFormService),
        MockProvider(FormRendererService, {
          loadTransactionDetails$: jest.fn().mockImplementation(() => of([])),
          transaction$: of(new TransactionModel(TransactionMock)),
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMap$,
            snapshot: {
              queryParams: { resume: 'true' },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadTransactionDetails$', () => {
    it('should load the transaction details', async () => {
      const service = ngMocks.findInstance(FormRendererService);
      const spy = jest.spyOn(service, 'loadTransactionDetails$');

      component.loadTransactionDetails$?.subscribe();

      expect(spy).toBeCalledWith('testId');
    });

    it('should load the transaction details empty', async () => {
      paramMap$.next(convertToParamMap({}));
      const service = ngMocks.findInstance(FormRendererService);
      const spy = jest.spyOn(service, 'loadTransactionDetails$');

      component.loadTransactionDetails$?.subscribe();

      expect(spy).toBeCalledWith('');
    });

    it('should handle error loading transaction details', async () => {
      const service = ngMocks.findInstance(FormRendererService);
      const spy = jest.spyOn(service, 'loadTransactionDetails$').mockImplementation(() => throwError(() => new Error('an error')));
      const snackBarService = ngMocks.findInstance(NuverialSnackBarService);
      const snackBarSpy = jest.spyOn(snackBarService, 'notifyApplicationError');

      component.loadTransactionDetails$?.subscribe();

      expect(spy).toHaveBeenCalledWith('testId');
      expect(snackBarSpy).toHaveBeenCalled();
    });
  });

  describe('router navigation', () => {
    it('should navigate to the intake form', done => {
      const testActiveTask: ITransactionActiveTask = {
        actions: [
          {
            key: 'testKey',
            uiClass: 'Primary',
            uiLabel: 'testLabel',
          },
        ],
        key: 'testKey',
        name: 'testName',
      };

      const formRendererService = ngMocks.findInstance(FormRendererService);
      formRendererService.loadTransactionDetails$ = jest
        .fn()
        .mockImplementation(() => of([FormMock, { ...TransactionMock, activeTasks: [testActiveTask], id: 'testId' }]));
      const router = ngMocks.findInstance(Router);
      const spy = jest.spyOn(router, 'navigate');

      component.loadTransactionDetails$?.subscribe(() => {
        expect(spy).toHaveBeenCalledWith(['/dashboard', 'transaction', 'testId'], { queryParams: { resume: 'true' }, replaceUrl: true });
        done();
      });
    });

    it('should navigate to the readonly form', done => {
      const formRendererService = ngMocks.findInstance(FormRendererService);
      formRendererService.loadTransactionDetails$ = jest.fn().mockImplementation(() => of([FormMock, { ...TransactionMock, activeTasks: [], id: 'testId' }]));
      const router = ngMocks.findInstance(Router);
      const spy = jest.spyOn(router, 'navigate');

      component.loadTransactionDetails$?.subscribe(() => {
        expect(spy).toHaveBeenCalledWith(['/dashboard', 'transaction', 'testId', 'readonly'], { replaceUrl: true });
        done();
      });
    });
  });

  it('should finish loading when navigation ends', fakeAsync(() => {
    expect(component.loading).toBeTruthy();

    routerEventsSubject.next(new NavigationEnd(1, 'test', 'test'));
    tick();

    expect(component.loading).toBeFalsy();
  }));
});
