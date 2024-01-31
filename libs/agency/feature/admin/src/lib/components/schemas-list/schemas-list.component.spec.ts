import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { AgencyUsersMock, UserMock } from '@dsg/shared/data-access/user-api';
import { SchemaDefinitionListMock, SchemaDefinitionListSchemaMock, SchemaTableData, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { SchemasListComponent } from './schemas-list.component';

describe('SchemasListComponent', () => {
  let component: SchemasListComponent;
  let fixture: ComponentFixture<SchemasListComponent>;
  let activatedRoute: ActivatedRoute;
  let activatedRouteSpy: { snapshot: any };
  let userStateService: UserStateService;
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
      getSchemaDefinitionsList$: jest.fn().mockImplementation(() => of(SchemaDefinitionListSchemaMock)),
    };

    await TestBed.configureTestingModule({
      imports: [SchemasListComponent, NoopAnimationsModule],
      providers: [
        MockProvider(LoggingService),
        {
          provide: ActivatedRoute,
          useValue: activatedRouteSpy,
        },
        MockProvider(Router),
        MockProvider(NuverialSnackBarService),
        MockProvider(UserStateService, {
          getUserById$: jest.fn().mockImplementation(() => of(UserMock)),
          getUserDisplayName$: jest.fn().mockImplementation(() => of(UserMock.displayName)),
        }),
        { provide: WorkApiRoutesService, useValue: mockWorkApiRoutesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemasListComponent);
    userStateService = TestBed.inject(UserStateService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('_getSchemaDefinitionsList', () => {
    it('should load the schema list', async () => {
      fixture.componentInstance.schemaDefinitionsList$.subscribe(_ => {
        const service = ngMocks.findInstance(WorkApiRoutesService);
        const spy = jest.spyOn(service, 'getSchemaDefinitionsList$');
        expect(spy).toBeCalled();
      });
    });

    it('should handle error loading schema list', () => {
      // Arrange
      const service = ngMocks.findInstance(WorkApiRoutesService);
      const spy = jest.spyOn(service, 'getSchemaDefinitionsList$').mockReturnValue(throwError(() => new Error()));
      const snackBarService = ngMocks.findInstance(NuverialSnackBarService);
      const errorSpy = jest.spyOn(snackBarService, 'notifyApplicationError');

      // Act
      fixture.componentInstance.schemaDefinitionsList$.subscribe();

      // Assert
      expect(spy).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should set the paging metadata', async () => {
      fixture.componentInstance.schemaDefinitionsList$.subscribe(_ => {
        fixture.componentInstance.pagingMetadata = SchemaDefinitionListSchemaMock.pagingMetadata;
        expect(fixture.componentInstance.pagingMetadata.pageNumber).toEqual(activatedRoute.snapshot.queryParams['page']);
        expect(fixture.componentInstance.pagingMetadata.totalCount).toEqual(200);
      });
    });

    it('should set the paging call the _buildDataSourceTable()', async () => {
      fixture.componentInstance.schemaDefinitionsList$.subscribe(_ => {
        const methodSpy = jest.spyOn(fixture.componentInstance as any, '_buildDataSourceTable');
        expect(methodSpy).toBeCalled();
      });
    });

    it('should build the table data', async () => {
      fixture.componentInstance.schemaList = SchemaDefinitionListMock;
      fixture.componentInstance['_buildDataSourceTable']();
      expect(fixture.componentInstance.dataSourceTable.data.length).toEqual(fixture.componentInstance.schemaList.length);
    });

    it('should assign the firstName data', async () => {
      fixture.componentInstance.schemaList = SchemaDefinitionListMock;
      await fixture.componentInstance['_buildDataSourceTable']();
      const dataTableRow: SchemaTableData[] = fixture.componentInstance.dataSourceTable.data as SchemaTableData[];
      fixture.componentInstance.schemaList?.forEach((schema, i) => {
        expect(dataTableRow[i].createdBy).not.toContain(schema.createdBy);
      });
    });

    it('should set the assignedTo to first middle name and last name when they are all provided', async () => {
      const agencyUserMock = AgencyUsersMock.users.find(user => user.id === '3f7efb30-1a32-4a61-808a-64a60dbbee27');
      userStateService.getUserById$ = jest.fn().mockImplementation(() => of(agencyUserMock));

      fixture.componentInstance.schemaList = SchemaDefinitionListMock;
      const schemaDefinitonMock = SchemaDefinitionListMock.find(schema => schema.createdBy === '3f7efb30-1a32-4a61-808a-64a60dbbee27');
      expect(agencyUserMock?.firstName && agencyUserMock?.lastName).toBeTruthy();
      await fixture.componentInstance['_buildDataSourceTable']();
      const dataTableRow: SchemaTableData[] = fixture.componentInstance.dataSourceTable.data as SchemaTableData[];
      const createdByDisplayName = `${agencyUserMock?.firstName || ''} ${agencyUserMock?.middleName || ''} ${agencyUserMock?.lastName || ''}`;
      expect(dataTableRow.find(row => row.id == schemaDefinitonMock?.id)?.createdBy).toEqual(createdByDisplayName);
    });

    it('should not set the assignedTo when the userId is malformed', async () => {
      const agencyUserMock = AgencyUsersMock.users.find(user => user.id === 'New Assigned User');
      userStateService.getUserById$ = jest.fn().mockImplementation(() => of(agencyUserMock));

      fixture.componentInstance.schemaList = SchemaDefinitionListMock;
      const scehamDefinitionMock = SchemaDefinitionListMock.find(schema => schema.createdBy === 'New Assigned User');
      await fixture.componentInstance['_buildDataSourceTable']();
      const dataTableRow: SchemaTableData[] = fixture.componentInstance.dataSourceTable.data as SchemaTableData[];
      expect(dataTableRow.find(row => row.id == scehamDefinitionMock?.id)?.createdBy).toBeUndefined;
    });

    it('should not set table data when there is no schema data', async () => {
      if (!fixture.componentInstance.schemaList) {
        expect(fixture.componentInstance.dataSourceTable.data.length).toEqual(0);
      }
    });

    it('should set the page the user clicked on', async () => {
      fixture.componentInstance.pagingMetadata = SchemaDefinitionListSchemaMock.pagingMetadata;
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

    it('should call getSchemaDefinitionsList$ with proper filters when searchText has a value', () => {
      const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
      expect(containerDebugElement).toBeTruthy();

      const searchText = 'some search text';
      component.searchInput.setValue(searchText);
      containerDebugElement.triggerEventHandler('keyup.enter', {});
      fixture.detectChanges();

      const expectedSchemaFilterList = [
        { field: 'key', value: searchText },
        { field: 'name', value: searchText },
      ];

      expect(mockWorkApiRoutesService.getSchemaDefinitionsList$).toHaveBeenCalledWith(expectedSchemaFilterList, component.pagingRequestModel);
    });

    it('should ensure keys are not modified while being displayed', async () => {
      fixture.debugElement.componentInstance.transactionList = SchemaDefinitionListMock;
      fixture.debugElement.componentInstance['_buildDataSourceTable']();

      const keys = fixture.debugElement.queryAll(By.css('td.cdk-column-key.mat-column-key')).map(elem => elem.nativeElement.innerHTML);
      const schemaDefinitionListKeys = fixture.debugElement.componentInstance.transactionList.map((item: any) => item.key);

      expect(keys.sort()).toEqual(schemaDefinitionListKeys.sort());
    });

    it('should ensure keys are unique', async () => {
      fixture.debugElement.componentInstance.transactionList = SchemaDefinitionListMock;
      fixture.debugElement.componentInstance['_buildDataSourceTable']();

      const keys = fixture.debugElement.queryAll(By.css('td.cdk-column-key.mat-column-key')).map(elem => elem.nativeElement.innerHTML);
      expect(keys.length).toEqual(new Set(keys).size);
    });

    it('should call getSchemaDefinitionsList$ with proper filters when searchText is empty', () => {
      const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
      expect(containerDebugElement).toBeTruthy();

      component.searchInput.setValue('');

      containerDebugElement.triggerEventHandler('keyup.enter', {});
      fixture.detectChanges();

      const expectedSchemaFilterList = [
        { field: 'key', value: '' },
        { field: 'name', value: '' },
      ];

      expect(mockWorkApiRoutesService.getSchemaDefinitionsList$).toHaveBeenCalledWith(expectedSchemaFilterList, component.pagingRequestModel);
    });
  });

  it('should navigate to schemas with schemakey', async () => {
    const service = ngMocks.findInstance(Router);
    const spy = jest.spyOn(service, 'navigate');

    ngMocks.click('table[mat-table] tr[mat-row]');

    expect(spy).toHaveBeenCalledWith(['/admin', 'schemas', SchemaDefinitionListMock[0].key]);
  });

  it('should navigate to create schema when clicked', async () => {
    const service = ngMocks.findInstance(Router);
    const spy = jest.spyOn(service, 'navigate');

    ngMocks.click('nuverial-button.new-schema-button');

    expect(spy).toHaveBeenCalledWith(['/admin', 'schemas', 'create']);
  });
});
