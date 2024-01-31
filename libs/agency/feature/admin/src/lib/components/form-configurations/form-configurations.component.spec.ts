import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { AgencyUsersMock, UserModel } from '@dsg/shared/data-access/user-api';
import { FormListMock, FormMetadataMock, TransactionDefinitionModelMock, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { FormBuilderService } from '@dsg/shared/feature/form-nuv';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { ENVIRONMENT_CONFIGURATION, mockEnvironment } from '@dsg/shared/utils/environment';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { FormConfigurationsComponent } from './form-configurations.component';
import { FormConfigurationService } from './form-configurations.service';

describe('FormConfigurationsComponent', () => {
  let component: FormConfigurationsComponent;
  let fixture: ComponentFixture<FormConfigurationsComponent>;
  let mockWorkApiRoutesService: Partial<WorkApiRoutesService>;
  let mockFormConfigurationService: Partial<FormConfigurationService>;
  let _buildDataSourceTableSpy: jest.SpyInstance;

  const user = AgencyUsersMock.users.find(u => u.id === '111');
  const userMockModel = new UserModel(user);

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(async () => {
    mockWorkApiRoutesService = {
      getFormConfigurations$: jest.fn().mockImplementation(() => of(FormListMock)),
    };

    mockFormConfigurationService = {
      formConfigurationsList$: of(FormListMock),
      getFormConfigurations$: jest.fn().mockImplementation(() => of(FormListMock)),
      notifyNewFormConfig: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FormConfigurationsComponent, NoopAnimationsModule, HttpClientModule],
      providers: [
        MockProvider(LoggingService),
        MockProvider(UserStateService, {
          getUserById$: jest.fn().mockImplementation(() => of(userMockModel)),
        }),
        MockProvider(Router),
        MockProvider(FormBuilderService),
        MockProvider(ChangeDetectorRef),
        MockProvider(NuverialSnackBarService),
        MockProvider(MatDialog),
        { provide: WorkApiRoutesService, useValue: mockWorkApiRoutesService },
        { provide: FormConfigurationService, useValue: mockFormConfigurationService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: ENVIRONMENT_CONFIGURATION, useValue: mockEnvironment },
        { provide: MatSnackBar, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormConfigurationsComponent);
    component = fixture.componentInstance;
    _buildDataSourceTableSpy = jest.spyOn(component as any, '_buildDataSourceTable');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set formConfigurationListIsLoading to false after getting form configurations', () => {
    expect(component.formConfigurationListIsLoading).toBe(false);
  });

  it('should set formConfigurationList after getting form configurations', () => {
    expect(component.formConfigurationList).toEqual(FormListMock);
  });

  it('should call the _buildDataSourceTable() on init', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(_buildDataSourceTableSpy).toBeCalled();
  });

  it('should build the table data', async () => {
    fixture.componentInstance.formConfigurationList = FormListMock;
    fixture.componentInstance['_buildDataSourceTable']();
    expect(fixture.componentInstance.dataSourceTable.data.length).toEqual(fixture.componentInstance.formConfigurationList.length);
  });

  it('should emit changeDefaultFormConfiguration event when setDefaultFormConfiguration is called', () => {
    const formConfigurationKey = 'testKey';
    const emitSpy = jest.spyOn(component.changeDefaultFormConfiguration, 'emit');
    component.setDefaultFormConfiguration(formConfigurationKey);
    expect(emitSpy).toHaveBeenCalledWith(formConfigurationKey);
  });

  it('should navigate to builder when navigateToBuilder method is called', () => {
    component.transactionDefinition = TransactionDefinitionModelMock;
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToBuilder('key');
    expect(navigateSpy).toHaveBeenCalledWith(['/admin', 'transaction-definitions', TransactionDefinitionModelMock.key, 'key']);
  });

  it('should call getFormConfigurations$ on ngOnInit and handle the response', () => {
    const formConfigurationsSpy = jest.spyOn(mockFormConfigurationService, 'getFormConfigurations$');
    const buildDataSourceTableSpy = jest.spyOn(component as any, '_buildDataSourceTable');

    component.ngOnInit();

    expect(formConfigurationsSpy).toHaveBeenCalledWith(component.transactionDefinition.key);
    expect(component.formConfigurationListIsLoading).toBe(false);
    expect(component.formConfigurationList).toEqual(FormListMock);
    expect(buildDataSourceTableSpy).toHaveBeenCalled();
  });

  describe('open', () => {
    it('dialog should open if metadata is defined', async () => {
      component.metaData = FormMetadataMock;
      jest
        .spyOn(component['_dialog'], 'open')
        .mockReturnValue({ afterClosed: () => of({ metaData: FormMetadataMock, save: true }) } as MatDialogRef<unknown, unknown>);
      component.open();
      expect(component.dialogRef).toBeDefined();
      expect(component.dialogRef?.afterClosed).toBeDefined();
    });

    it('should not update metadata if the dialog is closed without data', async () => {
      component.transactionDefinition = TransactionDefinitionModelMock;
      jest.spyOn(component['_dialog'], 'open').mockReturnValue({
        afterClosed: () => of({}),
      } as MatDialogRef<unknown, unknown>);
      const updateMetaDataSpy = jest.spyOn(component['_formConfigurationService'], 'notifyNewFormConfig');
      component.open();
      await component.dialogRef?.afterClosed().toPromise();
      expect(updateMetaDataSpy).not.toHaveBeenCalled();
    });

    it('should update metadata if the dialog is closed with data', async () => {
      jest
        .spyOn(component['_dialog'], 'open')
        .mockReturnValue({ afterClosed: () => of({ metaData: FormMetadataMock, save: false }) } as MatDialogRef<unknown, unknown>);
      const buildDataSourceTableSpy = jest.spyOn(component as any, '_buildDataSourceTable');

      component.open();

      expect(component.metaData).toEqual(FormMetadataMock);
      expect(buildDataSourceTableSpy).toHaveBeenCalled();
    });
  });

  it('should ensure keys are not modified while being displayed', async () => {
    fixture.debugElement.componentInstance.formConfigurationList = FormListMock;
    fixture.debugElement.componentInstance['_buildDataSourceTable']();

    const keys = fixture.debugElement.queryAll(By.css('td.cdk-column-key.mat-column-key')).map(elem => elem.nativeElement.innerHTML);
    const formListKeys = fixture.debugElement.componentInstance.formConfigurationList.map((item: any) => item.key);

    expect(keys.sort()).toEqual(formListKeys.sort());
  });
});
