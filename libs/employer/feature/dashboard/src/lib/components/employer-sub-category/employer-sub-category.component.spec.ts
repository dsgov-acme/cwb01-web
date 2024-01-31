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
import { DashboardCategoryMock, DashboardConfigurationMock, SubCategoryMock } from '../../models';
import { DashboardService } from '../../services';
import { EmployerDetailService } from '../employer-detail/employer-detail.service';
import { EmployerSubCategoryComponent } from './employer-sub-category.component';

describe('EmployerSubCategoryComponent', () => {
  let component: EmployerSubCategoryComponent;
  let fixture: ComponentFixture<EmployerSubCategoryComponent>;
  let activatedRouteSpy: { paramMap: any };

  beforeEach(async () => {
    activatedRouteSpy = {
      paramMap: new Subject(),
    };

    await TestBed.configureTestingModule({
      imports: [EmployerSubCategoryComponent, NoopAnimationsModule],
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
          getCurrentDashboardSubCategories: jest.fn().mockImplementation(() => [SubCategoryMock]),
          getDashboardCategoryByRoute: jest.fn().mockImplementation(() => DashboardCategoryMock),
          getDashboardConfiguration: jest.fn().mockImplementation(() => DashboardConfigurationMock),
        }),
        MockProvider(NuverialSnackBarService),
        {
          provide: ActivatedRoute,
          useValue: activatedRouteSpy,
        },
        MockProvider(FormRendererService, {
          transaction$: of(TransactionModelMock),
        }),
      ],
    }).compileComponents();

    const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;
    paramMapSubject.next(convertToParamMap({ category: 'tax-wage-reporting', subCategory: 'previously-filed-reports' }));
    fixture = TestBed.createComponent(EmployerSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadSubCategory$', () => {
    it('should load the sub category when given correct route params', async () => {
      const dashboardService = ngMocks.findInstance(DashboardService);
      const spy = jest.spyOn(dashboardService, 'getCurrentDashboardSubCategories');
      const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;
      paramMapSubject.next(convertToParamMap({ category: 'tax-wage-reporting', subCategory: 'quarterly-tax-wage-report' }));

      component.loadSubCategory$.subscribe();

      expect(spy).toBeCalled();
    });
    it('should navigate to the first sub category tab if subCategoryRoute does not match any tab key', async () => {
      const dashboardService = ngMocks.findInstance(DashboardService);
      const snackBarService = ngMocks.findInstance(NuverialSnackBarService);

      const spy = jest.spyOn(dashboardService, 'getCurrentDashboardSubCategories');

      const snackBarSpy = jest.spyOn(snackBarService, 'notifyApplicationError');
      const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;
      paramMapSubject.next(convertToParamMap({ category: 'tax-wage-reporting', subCategory: 'previously-filed-reports' }));

      component.loadSubCategory$.subscribe();

      expect(spy).toHaveBeenCalled();
      expect(snackBarSpy).toHaveBeenCalled();
    });

    it('should handle when no sub category is provided', async () => {
      const dashboardService = ngMocks.findInstance(DashboardService);
      const snackBarService = ngMocks.findInstance(NuverialSnackBarService);

      const spy = jest.spyOn(dashboardService, 'getCurrentDashboardSubCategories');

      const snackBarSpy = jest.spyOn(snackBarService, 'notifyApplicationError');
      const paramMapSubject = TestBed.inject(ActivatedRoute).paramMap as Subject<any>;
      paramMapSubject.next(convertToParamMap({ category: 'tax-wage-reporting' }));

      component.loadSubCategory$.subscribe();

      expect(spy).toHaveBeenCalled();
      expect(snackBarSpy).not.toHaveBeenCalled();
    });
  });

  describe('loadTransactionDetails$', () => {
    it('should load transaction', async () => {
      component.loadTransactionDetails$.subscribe(transactionModel => {
        expect(transactionModel).toEqual(TransactionModelMock);
      });
    });
  });
});
