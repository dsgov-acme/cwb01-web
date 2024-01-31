import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { TransactionDefinitionListMock, TransactionDefinitionListSchemaMock, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import { TransactionDefinitionsComponent } from './transaction-definitions.component';

describe('TransactionDefinitionsComponent', () => {
  let component: TransactionDefinitionsComponent;
  let fixture: ComponentFixture<TransactionDefinitionsComponent>;
  let activatedRoute: ActivatedRoute;
  let activatedRouteSpy: { snapshot: any };
  let mockWorkApiRoutesService: Partial<WorkApiRoutesService>;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(async () => {
    activatedRouteSpy = {
      snapshot: {
        queryParams: convertToParamMap({
          pageNumber: 3,
          pageSize: 10,
          sortBy: 'key',
          sortOrder: 'ASC',
        }),
      },
    };
    mockWorkApiRoutesService = {
      getTransactionDefinitionsList$: jest.fn().mockImplementation(() => of(TransactionDefinitionListSchemaMock)),
    };

    await TestBed.configureTestingModule({
      imports: [TransactionDefinitionsComponent, NoopAnimationsModule],
      providers: [
        MockProvider(LoggingService),
        {
          provide: ActivatedRoute,
          useValue: activatedRouteSpy,
        },
        MockProvider(Router),
        MockProvider(NuverialSnackBarService),
        { provide: WorkApiRoutesService, useValue: mockWorkApiRoutesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to transaction-definitions/new when navigateToCreateTransactionDefinition method is called', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToCreateTransactionDefinition();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin', 'transaction-definitions', 'create']);
  });

  it('should navigate to transaction-definitions/transactionKey when navigateToTransactionDefinition method is called', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToTransactionDefinition('key123');
    expect(navigateSpy).toHaveBeenCalledWith(['/admin', 'transaction-definitions', 'key123']);
  });

  describe('_getTransactionDefinitionsList', () => {
    it('should load the transaction list', async () => {
      fixture.componentInstance.transactionDefinitionsList$.subscribe(_ => {
        const service = ngMocks.findInstance(WorkApiRoutesService);
        const spy = jest.spyOn(service, 'getTransactionDefinitionsList$');
        expect(spy).toBeCalled();
      });
    });

    it('should handle error loading transaction definitions list', async () => {
      const service = ngMocks.findInstance(WorkApiRoutesService);
      const spy = jest.spyOn(service, 'getTransactionDefinitionsList$').mockImplementation(() => {
        throw Error();
      });
      const snackBarService = ngMocks.findInstance(NuverialSnackBarService);
      const errorSpy = jest.spyOn(snackBarService, 'notifyApplicationError');

      fixture.componentInstance.transactionDefinitionsList$.subscribe();
      expect(spy).toBeCalled();
      expect(errorSpy).toBeCalledWith();
    });

    it('should set the paging metadata', async () => {
      fixture.componentInstance.transactionDefinitionsList$.subscribe(_ => {
        fixture.componentInstance.pagingMetadata = TransactionDefinitionListSchemaMock.pagingMetadata;
        expect(fixture.componentInstance.pagingMetadata.pageNumber).toEqual(activatedRoute.snapshot.queryParams['page']);
        expect(fixture.componentInstance.pagingMetadata.totalCount).toEqual(200);
      });
    });

    it('should set the paging call the _buildDataSourceTable()', async () => {
      fixture.componentInstance.transactionDefinitionsList$.subscribe(_ => {
        const methodSpy = jest.spyOn(fixture.componentInstance as any, '_buildDataSourceTable');
        expect(methodSpy).toBeCalled();
      });
    });

    it('should build the table data', async () => {
      fixture.componentInstance.transactionList = TransactionDefinitionListMock;
      fixture.componentInstance['_buildDataSourceTable']();
      expect(fixture.componentInstance.dataSourceTable.data.length).toEqual(fixture.componentInstance.transactionList.length);
    });

    it('should not set table data when there is no transaction data', async () => {
      if (!fixture.componentInstance.transactionList) {
        expect(fixture.componentInstance.dataSourceTable.data.length).toEqual(0);
      }
    });

    it('should set the page the user clicked on', async () => {
      fixture.componentInstance.pagingMetadata = TransactionDefinitionListSchemaMock.pagingMetadata;
      fixture.autoDetectChanges();
      const nextPage = fixture.debugElement.query(By.css('.mat-mdc-paginator-navigation-next'));
      const methodSpy = jest.spyOn(fixture.componentInstance, 'setPage');
      nextPage.nativeElement.click();
      expect(methodSpy).toHaveBeenCalled();
    });

    it('should sort table by date created', () => {
      const sortHeaders = fixture.debugElement.queryAll(By.css('th[mat-header-cell]'));
      fixture.autoDetectChanges();

      const dateCreatedSortHeader = sortHeaders.find(header => header.nativeElement.textContent.trim() === 'Date  Created');
      const methodSpy = jest.spyOn(fixture.componentInstance, 'sortData');
      expect(dateCreatedSortHeader).toBeTruthy();

      dateCreatedSortHeader?.nativeElement.click();
      expect(methodSpy).toHaveBeenCalled();
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

    it('should ensure keys are not modified while being displayed', async () => {
      fixture.debugElement.componentInstance.transactionList = TransactionDefinitionListMock;
      fixture.debugElement.componentInstance['_buildDataSourceTable']();

      const keys = fixture.debugElement.queryAll(By.css('td.cdk-column-key.mat-column-key')).map(elem => elem.nativeElement.innerHTML);
      const transactionDefinitionListKeys = fixture.debugElement.componentInstance.transactionList.map((item: any) => item.key);

      expect(keys.sort()).toEqual(transactionDefinitionListKeys.sort());
    });

    it('should ensure keys are unique', async () => {
      fixture.debugElement.componentInstance.transactionList = TransactionDefinitionListMock;
      fixture.debugElement.componentInstance['_buildDataSourceTable']();

      const keys = fixture.debugElement.queryAll(By.css('td.cdk-column-key.mat-column-key')).map(elem => elem.nativeElement.innerHTML);
      expect(keys.length).toEqual(new Set(keys).size);
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

    it('should call getTransactionDefinitionList$ with proper filters when searchText has a value', () => {
      const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
      expect(containerDebugElement).toBeTruthy();

      const searchText = 'some search text';
      component.searchInput.setValue(searchText);
      containerDebugElement.triggerEventHandler('keyup.enter', {});
      fixture.detectChanges();

      const expectedFilter = { field: 'name', value: searchText.toLowerCase().trim() };
      const expectedTransactionFilterList = [expectedFilter];

      expect(mockWorkApiRoutesService.getTransactionDefinitionsList$).toHaveBeenCalledWith(expectedTransactionFilterList, component.pagingRequestModel);
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

    it('should call getTransactionDefinitionsList$ with proper filters when searchText is empty', () => {
      const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
      expect(containerDebugElement).toBeTruthy();

      component.searchInput.setValue('');

      containerDebugElement.triggerEventHandler('keyup.enter', {});
      fixture.detectChanges();

      const expectedFilter = { field: 'name', value: '' };
      const expectedTransactionFilterList = [expectedFilter];

      expect(mockWorkApiRoutesService.getTransactionDefinitionsList$).toHaveBeenCalledWith(expectedTransactionFilterList, component.pagingRequestModel);
    });
  });
});
