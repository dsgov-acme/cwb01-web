import { ComponentFixture } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { UserMock } from '@dsg/shared/data-access/user-api';
import {
  EmployerProfileLinkMock,
  EmployerProfileLinkRequestMock,
  ProfileAccessLevelsMock,
  UserEmployerProfilesListMock,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService, UserStateService } from '@dsg/shared/feature/app-state';
import { ConfirmationModalReponses, ITableActionEvent, LoadingService, NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { Filter, PagingRequestModel } from '@dsg/shared/utils/http';
import { LoggingService } from '@dsg/shared/utils/logging';
import { render } from '@testing-library/angular';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { UserActionModalModes } from '../user-action-modal/user-action-modal.component';
import { UserListColumn, UserListComponent } from './user-list.component';

const mockUserListColumn: UserListColumn = {
  ...EmployerProfileLinkMock,
  actions: [],
  displayName: 'Test User',
  email: 'test.user@test.com',
  role: 'Admin',
};

const activatedRouteMock = {
  snapshot: {
    queryParams: convertToParamMap(EmployerProfileLinkRequestMock.pagingMetadata),
    url: [{ path: 'account-access-management' }],
  },
};

const dependencies = MockBuilder(UserListComponent)
  .keep(NoopAnimationsModule)
  .keep(LoadingService)
  .mock(MatDialog)
  .mock(ActivatedRoute, activatedRouteMock as any)
  .mock(LoggingService)
  .mock(Router)
  .mock(NuverialSnackBarService)
  .mock(WorkApiRoutesService, {
    deleteEmployerProfileLink$: jest.fn().mockImplementation(() => of(null)),
    getEmployerProfileLinks$: jest.fn().mockImplementation(() => of(EmployerProfileLinkRequestMock)),
    inviteUserEmployerProfile$: jest.fn().mockImplementation(() => of(undefined)),
    updateEmployerProfileLinkAccessLevel$: jest.fn().mockImplementation(() => of(EmployerProfileLinkMock)),
  })
  .mock(UserStateService, {
    getUserDisplayName$: jest.fn().mockImplementation(() => of(UserMock.displayName)),
    getUserEmail$: jest.fn().mockImplementation(() => of(UserMock.email)),
    userProfile$: of(UserEmployerProfilesListMock[0]),
  })
  .mock(EnumerationsStateService, {
    getDataFromEnum$: jest.fn().mockImplementation(() => of(ProfileAccessLevelsMock.get(EmployerProfileLinkMock.profileAccessLevel))),
  })
  .build();

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(UserListComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

describe('UserListComponent', () => {
  it('should create', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('userList$', () => {
    let reset$: BehaviorSubject<boolean>;
    let search$: BehaviorSubject<string>;
    let fixture: ComponentFixture<UserListComponent> = null as any;
    let component: UserListComponent;

    beforeEach(async () => {
      reset$ = new BehaviorSubject<boolean>(false);
      search$ = new BehaviorSubject<string>('');
      const props = {
        componentProperties: {
          reset$: reset$.asObservable(),
          search$: search$.asObservable(),
        },
      };

      fixture = (await getFixture(props)).fixture;
      component = fixture.componentInstance;
    });

    it('should load users', () => {
      const route = ngMocks.findInstance(ActivatedRoute);
      const router = ngMocks.findInstance(Router);
      const pagingRequestModel = new PagingRequestModel({}, router, route);
      const service = ngMocks.findInstance(WorkApiRoutesService);
      const spy = jest.spyOn(service, 'getEmployerProfileLinks$');

      fixture.detectChanges();

      expect(component.dataSourceTable.data.length).toBe(EmployerProfileLinkRequestMock.items.length);
      expect(spy).toHaveBeenCalledWith(UserEmployerProfilesListMock[0].id, [], pagingRequestModel);
    });

    it('should search ', done => {
      const route = ngMocks.findInstance(ActivatedRoute);
      const router = ngMocks.findInstance(Router);
      const pagingRequestModel = new PagingRequestModel({}, router, route);

      const testSearchString = 'Test';
      const testSearchFilter: Filter[] = [
        {
          field: 'name',
          value: testSearchString,
        },
      ];

      const service = ngMocks.findInstance(WorkApiRoutesService);
      const spy = jest.spyOn(service, 'getEmployerProfileLinks$');

      component.usersList$.subscribe(() => {
        expect(spy).toHaveBeenCalledWith(UserEmployerProfilesListMock[0].id, testSearchFilter, pagingRequestModel);
        done();
      });

      search$.next(testSearchString);
    });

    it('should build an empty datasouce if there are no invites', async () => {
      const userList = await (component['_buildDataSourceTable'] as any)([]);
      expect(userList.length).toEqual(0);
    });
  });

  it('should set page', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;
    const service = ngMocks.findInstance(WorkApiRoutesService);
    const spy = jest.spyOn(service, 'getEmployerProfileLinks$');
    const mockEvent: PageEvent = {
      length: 200,
      pageIndex: 0,
      pageSize: 10,
    };

    component.setPage(mockEvent);

    fixture.detectChanges();

    expect(component.pagingRequestModel.pageNumber).toEqual(mockEvent.pageIndex);
    expect(component.pagingRequestModel.pageSize).toEqual(mockEvent.pageSize);
    expect(spy).toHaveBeenCalled();
  });

  it('should sort data', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;
    const service = ngMocks.findInstance(WorkApiRoutesService);
    const spy = jest.spyOn(service, 'getEmployerProfileLinks$');
    const mockEvent: Sort = {
      active: 'expires',
      direction: 'asc',
    };

    component.sortData(mockEvent);

    fixture.detectChanges();

    expect(component.pagingRequestModel.sortBy).toEqual(mockEvent.active);
    expect(component.pagingRequestModel.sortOrder).toEqual(mockEvent.direction.toUpperCase());
    expect(spy).toHaveBeenCalled();
  });

  describe('Edit User', () => {
    let fixture: ComponentFixture<UserListComponent> = null as any;
    let component: UserListComponent;

    beforeEach(async () => {
      fixture = (await getFixture({})).fixture;
      component = fixture.componentInstance;
    });
    it('should open dialog when editing user', () => {
      const mockEvent: ITableActionEvent = {
        action: UserActionModalModes.edit,
        column: mockUserListColumn,
      };
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({ afterClosed: () => of({}) } as MatDialogRef<unknown, unknown>);

      component.handleUserAction(mockEvent);

      expect(dialogSpy).toHaveBeenCalled();
    });

    it('should show success when an edit is successfull', () => {
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({
        afterClosed: () =>
          of({
            emailAddress: mockUserListColumn.email,
            role: mockUserListColumn.profileAccessLevel,
          }),
      } as MatDialogRef<unknown, unknown>);
      const workService = ngMocks.findInstance(WorkApiRoutesService);
      const workSpy = jest.spyOn(workService, 'updateEmployerProfileLinkAccessLevel$');
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const successSnackSpy = jest.spyOn(snackService, 'notifyApplicationSuccess');
      const mockEvent: ITableActionEvent = {
        action: UserActionModalModes.edit,
        column: mockUserListColumn,
      };

      component.handleUserAction(mockEvent);

      expect(dialogSpy).toHaveBeenCalled();
      expect(workSpy).toHaveBeenCalledWith(UserEmployerProfilesListMock[0].id, mockUserListColumn.userId, mockUserListColumn.profileAccessLevel);
      expect(successSnackSpy).toHaveBeenCalled();
    });

    it('should show error when an edit has error', () => {
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({
        afterClosed: () =>
          of({
            emailAddress: mockUserListColumn.email,
            role: mockUserListColumn.profileAccessLevel,
          }),
      } as MatDialogRef<unknown, unknown>);
      const workService = ngMocks.findInstance(WorkApiRoutesService);
      const workSpy = jest.spyOn(workService, 'updateEmployerProfileLinkAccessLevel$').mockImplementation(() => throwError(() => undefined));
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const errorSnackSpy = jest.spyOn(snackService, 'notifyApplicationError');
      const mockEvent: ITableActionEvent = {
        action: UserActionModalModes.edit,
        column: mockUserListColumn,
      };

      component.handleUserAction(mockEvent);

      expect(dialogSpy).toHaveBeenCalled();
      expect(workSpy).toHaveBeenCalledWith(UserEmployerProfilesListMock[0].id, mockUserListColumn.userId, mockUserListColumn.profileAccessLevel);
      expect(errorSnackSpy).toHaveBeenCalled();
    });
  });

  describe('Delete User', () => {
    let fixture: ComponentFixture<UserListComponent> = null as any;
    let component: UserListComponent;

    beforeEach(async () => {
      fixture = (await getFixture({})).fixture;
      component = fixture.componentInstance;
    });

    it('should open confirmation dialog when deleting user', () => {
      const mockEvent: ITableActionEvent = {
        action: 'delete',
        column: UserMock,
      };
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({ afterClosed: () => of({}) } as MatDialogRef<unknown, unknown>);
      const componentSpy = jest.spyOn(component as any, '_deleteUser');

      component.handleUserAction(mockEvent);

      expect(componentSpy).toHaveBeenCalled();
      expect(dialogSpy).toHaveBeenCalled();
    });

    it('should show success when an delete is successfull', () => {
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({
        afterClosed: () => of(ConfirmationModalReponses.SecondaryAction),
      } as MatDialogRef<unknown, unknown>);
      const workService = ngMocks.findInstance(WorkApiRoutesService);
      const workSpy = jest.spyOn(workService, 'deleteEmployerProfileLink$');
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const successSnackSpy = jest.spyOn(snackService, 'notifyApplicationSuccess');
      const mockEvent: ITableActionEvent = {
        action: 'delete',
        column: mockUserListColumn,
      };

      component.handleUserAction(mockEvent);

      expect(workSpy).toBeCalledWith(UserEmployerProfilesListMock[0].id, mockUserListColumn.userId);
      expect(dialogSpy).toHaveBeenCalled();
      expect(successSnackSpy).toHaveBeenCalled();
    });

    it('should show error when an delete has an error', () => {
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({
        afterClosed: () => of(ConfirmationModalReponses.SecondaryAction),
      } as MatDialogRef<unknown, unknown>);
      const workService = ngMocks.findInstance(WorkApiRoutesService);
      const workSpy = jest.spyOn(workService, 'deleteEmployerProfileLink$').mockImplementation(() => throwError(() => undefined));
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const errorSnackSpy = jest.spyOn(snackService, 'notifyApplicationError');
      const mockEvent: ITableActionEvent = {
        action: 'delete',
        column: mockUserListColumn,
      };

      component.handleUserAction(mockEvent);

      expect(workSpy).toBeCalledWith(UserEmployerProfilesListMock[0].id, mockUserListColumn.userId);
      expect(dialogSpy).toHaveBeenCalled();
      expect(errorSnackSpy).toHaveBeenCalled();
    });
  });
});
