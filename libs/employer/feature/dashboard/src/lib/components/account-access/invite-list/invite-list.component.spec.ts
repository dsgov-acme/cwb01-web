import { ComponentFixture } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { UserMock } from '@dsg/shared/data-access/user-api';
import {
  EmployerProfileInviteMock,
  EmployerProfileInviteRequestMock,
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
import { InviteService } from '../../../services';
import { InviteListActions, InviteListColumn, InviteListComponent } from './invite-list.component';
const mockInviteListColumn: InviteListColumn = {
  ...EmployerProfileInviteMock,
  actions: [],
  role: 'Admin',
  status: {
    label: 'Expired',
  },
};

const activatedRouteMock = {
  snapshot: {
    queryParams: convertToParamMap(EmployerProfileLinkRequestMock.pagingMetadata),
    url: [{ path: 'account-access-management' }],
  },
};

const dependencies = MockBuilder(InviteListComponent)
  .keep(NoopAnimationsModule)
  .keep(InviteService)
  .keep(LoadingService)
  .mock(MatDialog)
  .mock(ActivatedRoute, activatedRouteMock as any)
  .mock(LoggingService)
  .mock(Router)
  .mock(NuverialSnackBarService)
  .mock(WorkApiRoutesService, {
    deleteEmployerProfileInvite$: jest.fn().mockImplementation(() => of(undefined)),
    getEmployerProfileInvites$: jest.fn().mockImplementation(() => of(EmployerProfileInviteRequestMock)),
    inviteUserEmployerProfile$: jest.fn().mockImplementation(() => of(undefined)),
  })
  .mock(UserStateService, { userProfile$: of(UserEmployerProfilesListMock[0]) })
  .mock(EnumerationsStateService, {
    getDataFromEnum$: jest.fn().mockImplementation(() => of(ProfileAccessLevelsMock.get(EmployerProfileLinkMock.profileAccessLevel))),
  })
  .build();

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(InviteListComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

describe('InviteListComponent', () => {
  it('should create', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('invitesList$', () => {
    let reset$: BehaviorSubject<boolean>;
    let search$: BehaviorSubject<string>;
    let fixture: ComponentFixture<InviteListComponent> = null as any;
    let component: InviteListComponent;

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

    it('should load invites', () => {
      const route = ngMocks.findInstance(ActivatedRoute);
      const router = ngMocks.findInstance(Router);
      const pagingRequestModel = new PagingRequestModel({}, router, route);
      const service = ngMocks.findInstance(WorkApiRoutesService);
      const spy = jest.spyOn(service, 'getEmployerProfileInvites$');

      fixture.detectChanges();

      expect(component.dataSourceTable.data.length).toBe(EmployerProfileInviteRequestMock.items.length);
      expect(spy).toHaveBeenCalledWith(UserEmployerProfilesListMock[0].id, [], pagingRequestModel);
    });

    it('should search ', done => {
      const route = ngMocks.findInstance(ActivatedRoute);
      const router = ngMocks.findInstance(Router);
      const pagingRequestModel = new PagingRequestModel({}, router, route);

      const testSearchString = 'Test';
      const testSearchFilter: Filter[] = [
        {
          field: 'email',
          value: testSearchString,
        },
      ];

      const service = ngMocks.findInstance(WorkApiRoutesService);
      const spy = jest.spyOn(service, 'getEmployerProfileInvites$');

      component.invitesList$.subscribe(() => {
        expect(spy).toHaveBeenCalledWith(UserEmployerProfilesListMock[0].id, testSearchFilter, pagingRequestModel);
        done();
      });

      search$.next(testSearchString);
    });

    it('should build an empty datasouce if there are no invites', async () => {
      const invitesList = await (component['_buildDataSourceTable'] as any)([]);
      expect(invitesList.length).toEqual(0);
    });
  });

  it('should return the correct status label', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;

    let status = '';
    const date = new Date();

    status = component['_getStatusLabel'](true, date);
    expect(status).toEqual('Claimed');

    date.setDate(date.getDate() - 1);
    status = component['_getStatusLabel'](false, date);
    expect(status).toEqual('Expired');

    date.setDate(date.getDate() + 2);
    status = component['_getStatusLabel'](false, date);
    expect(status).toEqual('Pending');
  });

  it('should return the correct status color', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;

    let status = '';
    const date = new Date();

    status = component['_getStatusColor'](true, date);
    expect(status).toEqual('--theme-color-success');

    date.setDate(date.getDate() - 1);
    status = component['_getStatusColor'](false, date);
    expect(status).toEqual('--theme-color-error');

    date.setDate(date.getDate() + 2);
    status = component['_getStatusColor'](false, date);
    expect(status).toEqual('--theme-color-primary');
  });

  it('should return the correct status icon', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;

    let status;
    const date = new Date();

    date.setDate(date.getDate() - 1);
    status = component['_getStatusIcon'](date);
    expect(status).toEqual('error');

    date.setDate(date.getDate() + 2);
    status = component['_getStatusIcon'](date);
    expect(status).toEqual(undefined);
  });

  it('should set page', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;
    const service = ngMocks.findInstance(WorkApiRoutesService);
    const spy = jest.spyOn(service, 'getEmployerProfileInvites$');
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
    const spy = jest.spyOn(service, 'getEmployerProfileInvites$');
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

  describe('Resend Invite', () => {
    let fixture: ComponentFixture<InviteListComponent> = null as any;
    let component: InviteListComponent;

    beforeEach(async () => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
      fixture = (await getFixture({})).fixture;
      component = fixture.componentInstance;
    });
    it('should open dialog when resending invite', () => {
      const mockEvent: ITableActionEvent = {
        action: InviteListActions.Resend,
        column: mockInviteListColumn,
      };
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({ afterClosed: () => of({}) } as MatDialogRef<unknown, unknown>);

      component.handleInviteAction(mockEvent);

      expect(dialogSpy).toHaveBeenCalled();
    });

    it('should show success when an invite is successfully resent', done => {
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({
        afterClosed: () => of(ConfirmationModalReponses.SecondaryAction),
      } as MatDialogRef<unknown, unknown>);
      const workService = ngMocks.findInstance(WorkApiRoutesService);
      const workSpyDelete = jest.spyOn(workService, 'deleteEmployerProfileInvite$');
      const workSpyInvite = jest.spyOn(workService, 'inviteUserEmployerProfile$');
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const successSnackSpy = jest.spyOn(snackService, 'notifyApplicationSuccess');
      const mockEvent: ITableActionEvent = {
        action: InviteListActions.Resend,
        column: mockInviteListColumn,
      };

      component['_getInvites$'].asObservable().subscribe(() => {
        expect(component.pagingRequestModel.pageNumber).toBe(0);
        expect(dialogSpy).toHaveBeenCalled();
        expect(workSpyDelete).toHaveBeenCalledWith(mockInviteListColumn.profileId, mockInviteListColumn.id);
        expect(workSpyInvite).toHaveBeenCalledWith(mockInviteListColumn.profileId, mockInviteListColumn.email, mockInviteListColumn.accessLevel);
        expect(successSnackSpy).toHaveBeenCalled();
        done();
      });

      component.handleInviteAction(mockEvent);
    });

    it('should show error when an resend has error', () => {
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({
        afterClosed: () => of(ConfirmationModalReponses.SecondaryAction),
      } as MatDialogRef<unknown, unknown>);
      const workService = ngMocks.findInstance(WorkApiRoutesService);
      const workSpyDelete = jest.spyOn(workService, 'deleteEmployerProfileInvite$').mockImplementationOnce(() => throwError(() => undefined));
      const workSpyInvite = jest.spyOn(workService, 'inviteUserEmployerProfile$');
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const errorSnackSpy = jest.spyOn(snackService, 'notifyApplicationError');
      const mockEvent: ITableActionEvent = {
        action: InviteListActions.Resend,
        column: mockInviteListColumn,
      };

      component.handleInviteAction(mockEvent);
      fixture.detectChanges();

      expect(dialogSpy).toHaveBeenCalled();
      expect(workSpyDelete).toHaveBeenCalledWith(mockInviteListColumn.profileId, mockInviteListColumn.id);
      expect(workSpyInvite).not.toHaveBeenCalled();
      expect(errorSnackSpy).toHaveBeenCalled();
    });
  });

  describe('Delete invite', () => {
    let fixture: ComponentFixture<InviteListComponent> = null as any;
    let component: InviteListComponent;

    beforeEach(async () => {
      fixture = (await getFixture({})).fixture;
      component = fixture.componentInstance;
    });

    it('should open confirmation dialog when deleting invite', () => {
      const mockEvent: ITableActionEvent = {
        action: 'delete',
        column: UserMock,
      };
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({ afterClosed: () => of({}) } as MatDialogRef<unknown, unknown>);
      const componentSpy = jest.spyOn(component as any, '_deleteInvite');

      component.handleInviteAction(mockEvent);

      expect(componentSpy).toHaveBeenCalled();
      expect(dialogSpy).toHaveBeenCalled();
    });

    it('should show success when an delete is successfull', done => {
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({
        afterClosed: () => of(ConfirmationModalReponses.SecondaryAction),
      } as MatDialogRef<unknown, unknown>);
      const inviteService = ngMocks.findInstance(InviteService);
      const inviteSpy = jest.spyOn(inviteService, 'deleteEmployerProfileInvite$');
      const workService = ngMocks.findInstance(WorkApiRoutesService);
      const workSpy = jest.spyOn(workService, 'deleteEmployerProfileInvite$');
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const successSnackSpy = jest.spyOn(snackService, 'notifyApplicationSuccess');
      const mockEvent: ITableActionEvent = {
        action: InviteListActions.Delete,
        column: mockInviteListColumn,
      };

      component['_getInvites$'].asObservable().subscribe(() => {
        expect(component.pagingRequestModel.pageNumber).toBe(0);
        expect(inviteSpy).toHaveBeenCalled();
        expect(workSpy).toHaveBeenCalledWith(mockInviteListColumn.profileId, mockInviteListColumn.id);
        expect(dialogSpy).toHaveBeenCalled();
        expect(successSnackSpy).toHaveBeenCalled();
        done();
      });

      component.handleInviteAction(mockEvent);
    });

    it('should show error when an delete has an error', () => {
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({
        afterClosed: () => of(ConfirmationModalReponses.SecondaryAction),
      } as MatDialogRef<unknown, unknown>);
      const workService = ngMocks.findInstance(WorkApiRoutesService);
      const workSpy = jest.spyOn(workService, 'deleteEmployerProfileInvite$').mockImplementation(() => throwError(() => undefined));
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const successSnackSpy = jest.spyOn(snackService, 'notifyApplicationError');
      const mockEvent: ITableActionEvent = {
        action: InviteListActions.Delete,
        column: mockInviteListColumn,
      };

      component.handleInviteAction(mockEvent);

      expect(workSpy).toHaveBeenCalledWith(mockInviteListColumn.profileId, mockInviteListColumn.id);
      expect(dialogSpy).toHaveBeenCalled();
      expect(successSnackSpy).toHaveBeenCalled();
    });
  });
});
