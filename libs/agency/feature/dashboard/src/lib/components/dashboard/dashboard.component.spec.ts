import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { UserMock } from '@dsg/shared/data-access/user-api';
import {
  DashboardModel,
  DashboardModelMock,
  DashboardTabCountList,
  IDashboardCount,
  SingleTransactionModelListSchemaMock,
  TransactionListMock,
  TransactionListSchemaMock,
  TransactionMock2,
  TransactionPrioritiesMock,
  TransactionStatusCountList,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService, UserStateService } from '@dsg/shared/feature/app-state';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { axe } from 'jest-axe';
import { MockProvider, ngMocks } from 'ng-mocks';
import { EMPTY, ReplaySubject, of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';

describe('TransactionsListComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockWorkApiRoutesService: Partial<WorkApiRoutesService>;
  let mockActivatedRoute: { snapshot: any };

  let dashboardSubject: ReplaySubject<DashboardModel | undefined>;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(async () => {
    dashboardSubject = new ReplaySubject<DashboardModel | undefined>(1);
    dashboardSubject.next(DashboardModelMock);

    mockActivatedRoute = {
      snapshot: {
        queryParams: convertToParamMap({
          pageNumber: 3,
          pageSize: 10,
          sortBy: 'priority',
          sortOrder: 'ASC',
        }),
      },
    };

    mockWorkApiRoutesService = {
      getDashboardCounts$: jest.fn().mockImplementation(() => of([DashboardTabCountList])),
      getTransactionStatuses$: jest.fn().mockImplementation(() => of([TransactionStatusCountList])),
      getTransactionsList$: jest.fn().mockImplementation(() => of(TransactionListSchemaMock)),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, NoopAnimationsModule],
      providers: [
        MockProvider(LoggingService),
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
        MockProvider(Router),
        MockProvider(UserStateService, {
          getUserById$: jest.fn().mockImplementation(() => of(UserMock)),
          getUserDisplayName$: jest.fn().mockImplementation(() => of(UserMock.displayName)),
        }),
        MockProvider(DashboardService, {
          getDashboardTabCount$: jest.fn().mockImplementation(() => of(DashboardTabCountList)),
          loadDashboard$: jest.fn().mockImplementation(() => dashboardSubject.asObservable()),
        }),
        { provide: WorkApiRoutesService, useValue: mockWorkApiRoutesService },
        MockProvider(NuverialSnackBarService),
        MockProvider(EnumerationsStateService, {
          getDataFromEnum$: jest.fn().mockReturnValue(of(TransactionPrioritiesMock.get('MEDIUM'))),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  describe('dashboardDetails', () => {
    it('should load the transaction list when theres no errors', async () => {
      const service = ngMocks.findInstance(WorkApiRoutesService);
      const spy = jest.spyOn(service, 'getTransactionsList$');

      expect(spy).toBeCalled();
    });

    it('should handle empty dashboard', () => {
      const spy = jest.spyOn(mockWorkApiRoutesService, 'getTransactionsList$');
      spy.mockClear();
      dashboardSubject.next(undefined);

      fixture.detectChanges();

      expect(component.transactionSetKey).toBe('');
      expect(component.tabs.length).toBe(0);
      expect(component.displayedColumns.length).toBe(0);
      expect(spy).not.toBeCalled();
    });
  });

  describe('_buildDataSourceTable', () => {
    it('should build the table data', async () => {
      fixture.componentInstance.transactionList = TransactionListMock;
      await fixture.componentInstance['_buildDataSourceTable']();

      expect(fixture.componentInstance.dataSourceTable.data.length).toEqual(fixture.componentInstance.transactionList.length);
    });

    it('should build the dataSourceTable from the dashboard config columns attribute path', async () => {
      component.transactionList = [TransactionMock2];
      component.displayedColumns = [{ attributePath: 'status', label: 'Status', sortable: true, type: 'default' }];

      await component['_buildDataSourceTable']();

      expect((component.dataSourceTable.data[0] as any).status).toBe(TransactionMock2.status);
    });

    it('should apply proper formatting for PRIORITY columns', async () => {
      component.transactionList = [TransactionMock2];

      await component['_buildDataSourceTable']();

      fixture.detectChanges();

      const outerSpanDebugElement = fixture.debugElement.query(By.css('span.priority.medium'));
      expect(outerSpanDebugElement).toBeTruthy();

      const nuverialIconDebugElement = outerSpanDebugElement.query(By.css('nuverial-icon.priority-icon'));
      const innerSpanDebugElement = outerSpanDebugElement.query(By.css('span'));

      expect(nuverialIconDebugElement).toBeTruthy();
      expect(innerSpanDebugElement).toBeTruthy();

      const matIconElement: HTMLElement = nuverialIconDebugElement.query(By.css('mat-icon[fonticon="drag_handle"]')).nativeElement;
      expect(matIconElement).toBeTruthy();

      const innerSpanElement: HTMLElement = innerSpanDebugElement.nativeElement;
      if (innerSpanElement.textContent) {
        expect(innerSpanElement.textContent.trim()).toBe('Medium');
      } else {
        fail('Null priority label');
      }
    });

    it('should call getUserDisplayName for columns with displayFormat USERDATA - assignedTo', async () => {
      const spy = jest.spyOn(component['_userStateService'], 'getUserDisplayName$');

      component.transactionList = [TransactionMock2];
      await component['_buildDataSourceTable']();
      expect(spy).toHaveBeenCalledWith(TransactionMock2.assignedTo);
    });

    it('should call getDataFromEnum for columns with displayFormat PRIORITY - priority', async () => {
      const spy = jest.spyOn(component['_enumService'], 'getDataFromEnum$');
      fixture.componentInstance.transactionList = [TransactionMock2];

      spy.mockClear();
      await component['_buildDataSourceTable']();
      expect(spy).toHaveBeenCalledWith('transaction-priorities', TransactionMock2.priority);
    });
  });

  it('should set sortBy and sortOrder and call getTransactionsList on sortData', () => {
    const spy = jest.spyOn(component, 'getTransactionsList');

    component.sortData({ active: 'createdTimestamp', direction: 'asc' });

    expect(component.pagingRequestModel.sortBy).toBe('createdTimestamp');
    expect(component.pagingRequestModel.sortOrder).toBe('ASC');
    expect(spy).toHaveBeenCalled();
  });

  it('should navigate to transaction details page', () => {
    const routerSpy = jest.spyOn(component['_router'], 'navigate');
    component.navigateToTransactionDetails('123');

    expect(routerSpy).toHaveBeenCalledWith(['/dashboard/transaction/123']);
  });

  it('should set the active tab index based of the url params', fakeAsync(() => {
    mockActivatedRoute.snapshot = { queryParams: { status: 'Denied' } };

    component.dashboardDetails$.subscribe(_ => {
      expect(component.activeTabIndex).toEqual(component.tabs?.findIndex(tab => tab.label === 'Denied'));
    });
    tick();
  }));

  it('should set the page the user clicked on', async () => {
    component.pagingMetadata = TransactionListSchemaMock.pagingMetadata;
    fixture.autoDetectChanges();
    const nextPage = fixture.debugElement.query(By.css('.mat-mdc-paginator-navigation-next'));
    const methodSpy = jest.spyOn(fixture.componentInstance, 'setPage');
    nextPage.nativeElement.click();
    expect(methodSpy).toHaveBeenCalled();
  });

  it('should set the tab data in the DOM', async () => {
    fixture.detectChanges();
    const tabs = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'));
    expect(tabs.length).toEqual(fixture.componentInstance.tabs.length);
  });

  it('should clear the search input', () => {
    component.searchInput.setValue('test');
    fixture.detectChanges();

    const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
    expect(containerDebugElement).toBeTruthy();

    const clearIconDebugElement = containerDebugElement.query(By.css('nuverial-button'));
    expect(clearIconDebugElement).toBeTruthy();

    clearIconDebugElement.triggerEventHandler('click', null);
    expect(component.searchInput.value).toEqual('');
  });

  it('should set the search box icon', () => {
    fixture.detectChanges();

    //get the dom element
    const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
    expect(containerDebugElement).toBeTruthy();

    const buttonDebugElement = containerDebugElement.query(By.css('nuverial-button'));
    expect(buttonDebugElement).toBeTruthy();

    const iconDebugElement = buttonDebugElement.query(By.css('nuverial-icon'));
    expect(iconDebugElement).toBeTruthy();

    //assert that when the search box is empty, the icon must be search
    let iconName = iconDebugElement.nativeElement.getAttribute('ng-reflect-icon-name');
    expect(iconName).toBe('search');

    //simulate typing something in the serach box
    component.searchInput.setValue('test');
    containerDebugElement.triggerEventHandler('keyup', {});
    fixture.detectChanges();

    //assert that when the search box is not empty, the icon must be cancel
    iconName = iconDebugElement.nativeElement.getAttribute('ng-reflect-icon-name');
    expect(iconName).toBe('cancel_outline');
  });

  it('should call getTransactionsList$ with proper filters when searchText has a value', () => {
    const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
    expect(containerDebugElement).toBeTruthy();

    const searchText = 'some search text';
    component.searchInput.setValue(searchText);
    containerDebugElement.triggerEventHandler('keyup.enter', {});
    fixture.detectChanges();

    const expectedSearchFilter = { field: 'externalId', value: searchText.toLowerCase().trim() };
    const expectedTransactionFilterList = [expectedSearchFilter];

    expect(mockWorkApiRoutesService.getTransactionsList$).toHaveBeenCalledWith(
      component.transactionSetKey,
      expectedTransactionFilterList,
      component.pagingRequestModel,
    );
  });

  it('should navigate to transaction if searchText has a value and finds a transaction', () => {
    const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
    expect(containerDebugElement).toBeTruthy();

    const workApiRoutesService = ngMocks.findInstance(WorkApiRoutesService);
    jest.spyOn(workApiRoutesService, 'getTransactionsList$').mockReturnValue(of(SingleTransactionModelListSchemaMock));
    const navigateToTransactionDetailsSpy = jest.spyOn(component, 'navigateToTransactionDetails');

    const searchText = 'some search text';
    component.searchInput.setValue(searchText);
    containerDebugElement.triggerEventHandler('keyup.enter', {});
    fixture.detectChanges();

    expect(navigateToTransactionDetailsSpy).toHaveBeenCalledWith(SingleTransactionModelListSchemaMock.items[0].id);
  });

  it('should not navigate to transaction if searchText has a value and does not find a transaction', () => {
    const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
    expect(containerDebugElement).toBeTruthy();

    const workApiRoutesService = ngMocks.findInstance(WorkApiRoutesService);
    jest.spyOn(workApiRoutesService, 'getTransactionsList$').mockReturnValue(EMPTY);
    const navigateToTransactionDetailsSpy = jest.spyOn(component, 'navigateToTransactionDetails');

    const searchText = 'some search text';
    component.searchInput.setValue(searchText);
    containerDebugElement.triggerEventHandler('keyup.enter', {});
    fixture.detectChanges();

    expect(navigateToTransactionDetailsSpy).not.toHaveBeenCalled();
  });

  it('should set pageNumber to 0 on search', () => {
    const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
    expect(containerDebugElement).toBeTruthy();
    fixture.componentInstance.pagingRequestModel.pageNumber = 1;

    const searchText = 'some search text';
    component.searchInput.setValue(searchText);
    containerDebugElement.triggerEventHandler('keyup.enter', {});
    fixture.detectChanges();

    expect(fixture.componentInstance.pagingRequestModel.pageNumber).toEqual(0);
  });

  it('should call getTransactionsList$ with proper filters when searchText is empty', () => {
    const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
    expect(containerDebugElement).toBeTruthy();

    component.searchInput.setValue('');

    containerDebugElement.triggerEventHandler('keyup.enter', {});
    fixture.detectChanges();

    const expectedFilter = { field: 'status', value: component.tabs[component.activeTabIndex]?.label };
    const expectedTransactionFilterList = [expectedFilter];

    expect(mockWorkApiRoutesService.getTransactionsList$).toHaveBeenCalledWith(
      component.transactionSetKey,
      expectedTransactionFilterList,
      component.pagingRequestModel,
    );
  });

  it('should notify error when get transaction list fails', async () => {
    const snackService = ngMocks.findInstance(NuverialSnackBarService);
    const snackSpy = jest.spyOn(snackService, 'notifyApplicationError');

    const workService = ngMocks.findInstance(WorkApiRoutesService);
    const workSpy = jest.spyOn(workService, 'getTransactionsList$').mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })));

    component.getTransactionsList();

    expect(workSpy).toHaveBeenCalled();
    expect(snackSpy).toHaveBeenCalled();
  });

  it('should notify error when get transaction list fails', async () => {
    const snackService = ngMocks.findInstance(NuverialSnackBarService);
    const snackSpy = jest.spyOn(snackService, 'notifyApplicationError');

    const dashService = ngMocks.findInstance(DashboardService);
    const dashSpy = jest.spyOn(dashService, 'getDashboardTabCount$').mockImplementation(() => throwError(() => new HttpErrorResponse({ status: 500 })));

    component.updateTabCounts('key').subscribe();

    expect(dashSpy).toHaveBeenCalled();
    expect(snackSpy).toHaveBeenCalled();
  });
  it('should have an empty transaction list when get transaction list fails', async () => {
    const workService = ngMocks.findInstance(WorkApiRoutesService);
    jest.spyOn(workService, 'getTransactionsList$').mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 400 })));

    component.getTransactionsList();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.transactionList.length).toBe(0);
  });

  it('should return dashboard count for tab', async () => {
    component.dashboardCounts = [
      {
        count: 1,
        fromSchema: () => null,
        tabLabel: 'tab',
        toSchema: () => ({} as IDashboardCount),
      },
    ];

    expect(component.getCountByTabLabel('tab')).toEqual(1);
  });

  it('should reset pagingRequestModels page number to zero on function call', () => {
    component.pagingRequestModel.pageNumber = 5;
    component.pagingRequestModel.pageSize = 20;
    component.pagingRequestModel.sortBy = 'date';
    component.pagingRequestModel.sortOrder = 'DESC';
    const routerSpy = jest.spyOn(component['_router'], 'navigate');

    component.pagingRequestModel.reset({ pageSize: component.pagingRequestModel.pageSize });

    expect(component.pagingRequestModel.pageNumber).toEqual(0);
    expect(component.pagingRequestModel.pageSize).toEqual(20);
    expect(component.pagingRequestModel.sortBy).toEqual('');
    expect(component.pagingRequestModel.sortOrder).toEqual('ASC');
    expect(routerSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: {
          pageNumber: null,
          pageSize: 20,
          sortBy: null,
          sortOrder: null,
        },
      }),
    );
  });
});
