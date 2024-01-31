import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, NavigationEnd, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NuverialSpinnerComponent } from '@dsg/shared/ui/nuverial';
import { MockProvider, ngMocks } from 'ng-mocks';
import { Subject, of } from 'rxjs';
import { DashboardCategoryMock, DashboardCategoryWithListMock, DashboardConfigurationMock } from '../../models';
import { DashboardService } from '../../services';
import { CategoryRoutingComponent } from './category-routing.component';

describe('CategoryRoutingComponent', () => {
  let component: CategoryRoutingComponent;
  let fixture: ComponentFixture<CategoryRoutingComponent>;
  const routerEventsSubject = new Subject<NavigationEnd>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), NoopAnimationsModule, NuverialSpinnerComponent],
      providers: [
        MockProvider(Router, {
          events: routerEventsSubject.asObservable(),
          navigate: jest.fn(),
        }),
        MockProvider(DashboardService, {
          getDashboardCategoryByRoute: jest.fn().mockImplementation(() => DashboardCategoryMock),
          getDashboardConfiguration: jest.fn().mockImplementation(() => DashboardConfigurationMock),
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ category: 'testCategory' })),
            snapshot: { children: [{ children: [{ paramMap: convertToParamMap({ subCategory: DashboardCategoryMock.subCategories[1].relativeRoute }) }] }] },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set loading to false when navigation ends', () => {
    routerEventsSubject.next(new NavigationEnd(1, '/test', '/test'));

    expect(component.loading).toBeFalsy();
  });

  it("should navigate to selected subcategory if it doesn't have a transactions lists", () => {
    const dashboardService = ngMocks.findInstance(DashboardService);
    const dashboardSpy = jest.spyOn(dashboardService, 'getDashboardCategoryByRoute');

    const routerService = ngMocks.findInstance(Router);
    const routerSpy = jest.spyOn(routerService, 'navigate');

    const route = ngMocks.findInstance(ActivatedRoute);

    expect(dashboardSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith([DashboardCategoryMock.subCategories[1].relativeRoute], { queryParamsHandling: 'merge', relativeTo: route });
  });

  it("should navigate to first subcategory if it doesn't have a transactions lists or subCateogry", () => {
    const dashboardService = ngMocks.findInstance(DashboardService);
    const dashboardSpy = jest.spyOn(dashboardService, 'getDashboardCategoryByRoute');

    const routerService = ngMocks.findInstance(Router);
    const routerSpy = jest.spyOn(routerService, 'navigate');

    const route = ngMocks.findInstance(ActivatedRoute);
    route.snapshot.children[0].children[0] = undefined as any;

    fixture = TestBed.createComponent(CategoryRoutingComponent);
    fixture.detectChanges();

    expect(dashboardSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith([DashboardCategoryMock.subCategories[0].relativeRoute], { queryParamsHandling: 'merge', relativeTo: route });
  });

  it('should navigate to transactions if it has a transactions lists', () => {
    const dashboardService = ngMocks.findInstance(DashboardService);
    const dashboardSpy = jest.spyOn(dashboardService, 'getDashboardCategoryByRoute');
    dashboardSpy.mockImplementation(() => DashboardCategoryWithListMock);

    fixture = TestBed.createComponent(CategoryRoutingComponent);
    fixture.detectChanges();

    const routerService = ngMocks.findInstance(Router);
    const routerSpy = jest.spyOn(routerService, 'navigate');

    const route = ngMocks.findInstance(ActivatedRoute);

    expect(dashboardSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['transactions'], { relativeTo: route });
  });
});
