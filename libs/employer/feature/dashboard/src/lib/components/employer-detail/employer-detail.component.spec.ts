import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { UserMock } from '@dsg/shared/data-access/user-api';
import { EmployerDetailModelMock, TransactionModelMock } from '@dsg/shared/data-access/work-api';
import { FormRendererService } from '@dsg/shared/feature/form-nuv';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingAdapter } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { Subject, of } from 'rxjs';
import { DashboardCategoryMock, DashboardCategoryWithListMock, DashboardConfigurationMock } from '../../models';
import { DashboardService } from '../../services';
import { EmployerDetailComponent } from './employer-detail.component';
import { EmployerDetailService } from './employer-detail.service';

describe('EmployerDetailComponent', () => {
  let component: EmployerDetailComponent;
  let fixture: ComponentFixture<EmployerDetailComponent>;
  let activatedRouteSpy: { paramMap: any };

  beforeEach(async () => {
    activatedRouteSpy = {
      paramMap: new Subject(),
    };

    await TestBed.configureTestingModule({
      imports: [EmployerDetailComponent, NoopAnimationsModule],
      providers: [
        MockProvider(EmployerDetailService, {
          getEmployerAgents$: jest.fn().mockImplementation(() => of([UserMock])),
          getEmployerDetails$: jest.fn().mockImplementation(() => of(EmployerDetailModelMock)),
        }),
        MockProvider(Router, {
          navigate: jest.fn(),
        }),
        MockProvider(LoggingAdapter),
        MockProvider(DashboardService, {
          getDashboardCategoryByRoute: jest.fn().mockImplementation(() => DashboardCategoryMock),
          getDashboardConfiguration: jest.fn().mockImplementation(() => DashboardConfigurationMock),
        }),
        MockProvider(NuverialSnackBarService),
        {
          provide: ActivatedRoute,
          useValue: activatedRouteSpy,
        },
        MockProvider(FormRendererService, {
          cleanUp: jest.fn(),
          loadTransactionDetails$: jest.fn().mockImplementation(() => of([undefined, TransactionModelMock])),
        }),
      ],
    }).compileComponents();

    const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;
    paramMapSubject.next(convertToParamMap({ category: 'tax-wage-reporting', subCategory: 'previously-filed-reports' }));
    fixture = TestBed.createComponent(EmployerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadSubCategories$', () => {
    it('should load the sub categories when given correct route params', async () => {
      const service = ngMocks.findInstance(DashboardService);
      const spy = jest.spyOn(service, 'getDashboardCategoryByRoute');
      const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;

      component.loadSubCategories$.subscribe();

      paramMapSubject.next(convertToParamMap({ category: 'tax-wage-reporting', subCategory: 'previously-filed-reports' }));

      expect(spy).toBeCalledWith('tax-wage-reporting');
    });

    it('should handle error loading categories', async () => {
      const service = ngMocks.findInstance(DashboardService);
      const spy = jest.spyOn(service, 'getDashboardCategoryByRoute').mockImplementation(() => undefined);
      const snackBarService = ngMocks.findInstance(NuverialSnackBarService);
      const snackBarSpy = jest.spyOn(snackBarService, 'notifyApplicationError');
      const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;

      component.loadSubCategories$.subscribe();

      paramMapSubject.next(convertToParamMap({ category: 'tax-wage-reporting', subCategory: 'previously-filed-reports' }));

      expect(spy).toHaveBeenCalledWith('tax-wage-reporting');
      expect(snackBarSpy).toHaveBeenCalled();
    });

    it('should handle when no category is provided', async () => {
      const service = ngMocks.findInstance(DashboardService);
      const spy = jest.spyOn(service, 'getDashboardCategoryByRoute').mockImplementation(() => undefined);
      const snackBarService = ngMocks.findInstance(NuverialSnackBarService);
      const snackBarSpy = jest.spyOn(snackBarService, 'notifyApplicationError');
      const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;
      component.loadSubCategories$.subscribe();

      paramMapSubject.next(convertToParamMap({}));

      expect(spy).toHaveBeenCalledWith('');
      expect(snackBarSpy).toHaveBeenCalled();
    });

    it('should load transaction details if there is a transaction ID', async () => {
      const formRendererService = ngMocks.findInstance(FormRendererService);
      const formTransactionSpy = jest.spyOn(formRendererService, 'loadTransactionDetails$');

      component.loadTransaction$.subscribe();

      const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;
      paramMapSubject.next(convertToParamMap({ category: 'tax-wage-reporting', transactionId: TransactionModelMock.id }));

      expect(formTransactionSpy).toHaveBeenCalledWith(TransactionModelMock.id);
      expect(component.transaction).toEqual(TransactionModelMock);
    });

    it('should navigate to transactions if there is no transaction id and it has transaction list', async () => {
      const dashboardService = ngMocks.findInstance(DashboardService);
      jest.spyOn(dashboardService, 'getDashboardCategoryByRoute').mockReturnValue(DashboardCategoryWithListMock);

      const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;

      const routerService = ngMocks.findInstance(Router);
      const routerSpy = jest.spyOn(routerService, 'navigate');

      const route = ngMocks.findInstance(ActivatedRoute);

      paramMapSubject.next(convertToParamMap({ category: 'tax-wage-reporting' }));

      component.loadSubCategories$.subscribe();

      expect(routerSpy).toHaveBeenCalledWith(['transactions'], { relativeTo: route });
      expect(component.breadCrumbs).toEqual([
        { label: 'Back To Transactions', navigationPath: `/dashboard/${DashboardCategoryWithListMock.route}/transactions` },
      ]);
    });
  });

  describe('agentsSelectOptions$', () => {
    it('should map agents to select options', done => {
      component.agentsSelectOptions$.subscribe(options => {
        const ExmployerNuverialOptionsMock = {
          disabled: false,
          displayTextValue: `${UserMock.displayName} - ${UserMock.email}`,
          key: UserMock.id,
          selected: false,
        };
        expect(options).toEqual([ExmployerNuverialOptionsMock]);
        done();
      });
    });
  });

  it('should copy id to clipboard', () => {
    const id = '123';
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
    const spy = jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(() => Promise.resolve());

    component.copyId(id);

    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should set assignedToControl value to EmployerUserMock.id when employer$ is subscribed', done => {
    component.employer$.subscribe(() => {
      expect(component.assignedToControl.value).toEqual(EmployerDetailModelMock.assignedTo);
      done();
    });
  });
});
