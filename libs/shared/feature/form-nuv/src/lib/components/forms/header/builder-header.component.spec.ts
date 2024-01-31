import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AgencyUsersMock, UserModel } from '@dsg/shared/data-access/user-api';
import { FormMetadataMock, IFormMetaData } from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { axe } from 'jest-axe';
import { MockProvider } from 'ng-mocks';
import { Observable, of, throwError } from 'rxjs';
import { FormBuilderService } from '../../../services';
import { BuilderHeaderComponent } from './builder-header.component';
describe('BuilderHeaderComponent', () => {
  let component: BuilderHeaderComponent;
  let fixture: ComponentFixture<BuilderHeaderComponent>;
  let mockUserStateService: UserStateService;
  let mockFormBuilderService: FormBuilderService;

  const user = AgencyUsersMock.users.find(u => u.id === '111');
  const userMockModel = new UserModel(user);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderHeaderComponent, NoopAnimationsModule],
      providers: [
        MockProvider(LoggingService),
        MockProvider(UserStateService, {
          getUserById$: jest.fn().mockImplementation(() => of(userMockModel)),
        }),
        MockProvider(FormBuilderService),
        MockProvider(NuverialSnackBarService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderHeaderComponent);
    component = fixture.componentInstance;
    mockFormBuilderService = TestBed.inject(FormBuilderService);
    mockUserStateService = TestBed.inject(UserStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const axeResults = await axe(fixture.nativeElement);
      expect(axeResults).toHaveNoViolations();
    });
  });

  describe('updateLastUpdatedBy', () => {
    it('should not call the service if metaData is undefined', async () => {
      component.metaData = undefined;
      await component.updateLastUpdatedBy();
      expect(mockUserStateService.getUserById$).not.toHaveBeenCalled();
    });

    it('should not display lastUpdatedDisplay if display name is undefined', async () => {
      component.metaData = undefined;
      jest.spyOn(mockUserStateService, 'getUserById$').mockReturnValueOnce(of(new UserModel({} as any)));
      await component.updateLastUpdatedBy();
      expect(component.lastUpdatedDisplay).toEqual('');
    });

    it('should update lastUpdatedDisplay if new display name is different than metaData', async () => {
      component.metaData = FormMetadataMock;
      component.metaData.lastUpdatedBy = 'OldName';
      await component.updateLastUpdatedBy();
      expect(component.lastUpdatedDisplay).toEqual(userMockModel.displayName);
    });

    it('should not update lastUpdatedDisplay if new display name is the same as metaData', async () => {
      component.metaData = FormMetadataMock;
      component.metaData.lastUpdatedBy = userMockModel.displayName;
      await component.updateLastUpdatedBy();
      expect(component.lastUpdatedDisplay).toEqual(userMockModel.displayName);
    });
  });

  describe('updateCreatedBy', () => {
    it('should not call the service if metaData is undefined', async () => {
      component.metaData = undefined;
      await component.updateCreatedBy();
      expect(mockUserStateService.getUserById$).not.toHaveBeenCalled();
    });

    it('should not display createdByDisplay if display name is undefined', async () => {
      component.metaData = undefined;
      jest.spyOn(mockUserStateService, 'getUserById$').mockReturnValueOnce(of(new UserModel({} as any)));
      await component.updateCreatedBy();
      expect(component.createdByDisplay).toEqual('');
    });

    it('should update createdByDisplay if new display name is different than lastUpdatedBy in metaData', async () => {
      component.metaData = FormMetadataMock;
      component.metaData.createdBy = '111';
      component.metaData.lastUpdatedBy = 'OldName';
      await component.updateCreatedBy();
      expect(component.createdByDisplay).toEqual(userMockModel.displayName);
    });

    it('should not update createdByDisplay if new display name is the same as lastUpdatedBy in metaData', async () => {
      component.metaData = FormMetadataMock;
      component.metaData.createdBy = '111';
      component.metaData.lastUpdatedBy = userMockModel.displayName;
      await component.updateCreatedBy();
      expect(component.createdByDisplay).toEqual(userMockModel.displayName);
    });
  });
  describe('ngOnChanges', () => {
    it('should not call updateLastUpdatedBy and updateCreatedBy if metaData did not change', async () => {
      const spyUpdateLastUpdatedBy = jest.spyOn(component, 'updateLastUpdatedBy');
      const spyUpdateCreatedBy = jest.spyOn(component, 'updateCreatedBy');

      await component.ngOnChanges({});

      expect(spyUpdateLastUpdatedBy).not.toHaveBeenCalled();
      expect(spyUpdateCreatedBy).not.toHaveBeenCalled();
    });

    it('should call updateLastUpdatedBy and updateCreatedBy if metaData has changed', async () => {
      const spyUpdateLastUpdatedBy = jest.spyOn(component, 'updateLastUpdatedBy');
      const spyUpdateCreatedBy = jest.spyOn(component, 'updateCreatedBy');
      component.metaData = FormMetadataMock;
      component.metaData.lastUpdatedBy = 'testUser2';

      await component.ngOnChanges({
        metaData: {
          currentValue: { lastUpdatedBy: 'testUser1' },
          firstChange: false,
          isFirstChange: () => false,
          previousValue: null,
        },
      });

      expect(spyUpdateLastUpdatedBy).toHaveBeenCalled();
      expect(spyUpdateCreatedBy).toHaveBeenCalled();
    });

    it('should not call updateLastUpdatedBy and updateCreatedBy if metaData changes from one value to another but component metaData is falsy', async () => {
      component.metaData = undefined;

      const spyUpdateLastUpdatedBy = jest.spyOn(component, 'updateLastUpdatedBy');
      const spyUpdateCreatedBy = jest.spyOn(component, 'updateCreatedBy');

      await component.ngOnChanges({
        metaData: {
          currentValue: { lastUpdatedBy: 'newUser' },
          firstChange: false,
          isFirstChange: () => false,
          previousValue: { lastUpdatedBy: 'oldUser' },
        },
      });

      expect(spyUpdateLastUpdatedBy).not.toHaveBeenCalled();
      expect(spyUpdateCreatedBy).not.toHaveBeenCalled();
    });

    it('should call _cdr.detectChanges when metaData changes', async () => {
      const spyDetectChanges = jest.spyOn((component as any)._cdr, 'detectChanges');
      component.metaData = FormMetadataMock;
      component.metaData.lastUpdatedBy = 'testUser';

      await component.ngOnChanges({
        metaData: {
          currentValue: { lastUpdatedBy: 'testUser' },
          firstChange: false,
          isFirstChange: () => false,
          previousValue: null,
        },
      });

      expect(spyDetectChanges).toHaveBeenCalled();
    });
  });

  describe('open', () => {
    it('should not open dialog if metadata is null', async () => {
      component.metaData = undefined;
      jest.spyOn(component['_dialog'], 'open');
      component.open();
      expect(component.dialogRef).toBeUndefined();
      expect(component['_dialog'].open).not.toHaveBeenCalled();
    });

    it('dialog should open if metadata is defined', async () => {
      component.metaData = FormMetadataMock;
      jest
        .spyOn(component['_dialog'], 'open')
        .mockReturnValue({ afterClosed: () => of({ metaData: FormMetadataMock, save: true }) } as MatDialogRef<unknown, unknown>);
      component.open();
      expect(component.dialogRef).toBeDefined();
      expect(component.dialogRef?.afterClosed).toBeDefined();
    });
  });

  it('should update metadata if dialog is closed with save', async () => {
    component.metaData = FormMetadataMock;
    const dialogRefSpy = { afterClosed: jest.fn().mockReturnValue(of({ metaData: FormMetadataMock, save: true })) };
    jest.spyOn(component['_dialog'], 'open').mockReturnValue(dialogRefSpy as unknown as MatDialogRef<unknown>);
    jest.spyOn(mockFormBuilderService, 'updateMetaData').mockReturnValue(of(FormMetadataMock) as unknown as Observable<IFormMetaData>);
    jest.spyOn(component, 'updateLastUpdatedBy').mockImplementation(() => Promise.resolve());
    component.open();
    await component.dialogRef?.afterClosed().toPromise();
    expect(mockFormBuilderService.updateMetaData).toHaveBeenCalledWith(FormMetadataMock);
    expect(component.updateLastUpdatedBy).toHaveBeenCalled();
    expect(component.metaData).toEqual(FormMetadataMock);
  });

  it('should not update metadata if dialog is closed without save', async () => {
    component.metaData = FormMetadataMock;
    const dialogRefSpy = { afterClosed: jest.fn().mockReturnValue(of({ metaData: FormMetadataMock, save: false })) };
    jest.spyOn(component['_dialog'], 'open').mockReturnValue(dialogRefSpy as unknown as MatDialogRef<unknown>);
    jest.spyOn(mockFormBuilderService, 'updateMetaData').mockReturnValue(of({ success: true }) as unknown as Observable<IFormMetaData>);
    jest.spyOn(mockUserStateService, 'getUser$').mockReturnValue(of({ id: 'test-id' }) as Observable<UserModel>);
    jest.spyOn(component, 'updateLastUpdatedBy').mockImplementation(() => Promise.resolve());
    component.open();
    await component.dialogRef?.afterClosed().toPromise();
    expect(mockFormBuilderService.updateMetaData).not.toHaveBeenCalled();
    expect(component.updateLastUpdatedBy).not.toHaveBeenCalled();
    expect(component.metaData).toEqual(FormMetadataMock);
  });

  it('should handle error when update metadata fails', async () => {
    component.metaData = FormMetadataMock;
    jest.spyOn(component['_formBuilderService'], 'updateMetaData').mockReturnValue(throwError(() => ({ status: 404 })));
    jest
      .spyOn(component['_dialog'], 'open')
      .mockReturnValue({ afterClosed: () => of({ metaData: FormMetadataMock, save: true }) } as MatDialogRef<unknown, unknown>);
    jest.spyOn(component, 'updateLastUpdatedBy').mockImplementation(() => Promise.resolve());

    const notifyApplicationErrorSpy = jest.spyOn(component['_nuverialSnackBarService'], 'notifyApplicationError');

    component.open();
    await component.dialogRef?.afterClosed().toPromise();
    expect(component.loading).toBeFalsy();
    expect(component.updateLastUpdatedBy).not.toHaveBeenCalled();
    expect(notifyApplicationErrorSpy).toHaveBeenCalled();
  });
});
