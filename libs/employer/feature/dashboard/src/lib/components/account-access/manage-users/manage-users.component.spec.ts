import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params, Router, convertToParamMap } from '@angular/router';
import { EmployerProfileLinkMock, EmployerProfileLinkRequestMock, UserEmployerProfilesListMock, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { NuverialButtonComponent, NuverialSnackBarService, NuverialTextInputComponent } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { InviteService } from '../../../services';
import { InviteListComponent } from '../invite-list/invite-list.component';
import { UserListComponent } from '../user-list/user-list.component';
import { ManageUsersComponent } from './manage-users.component';

describe('ManageUsersComponent', () => {
  let component: ManageUsersComponent;
  let fixture: ComponentFixture<ManageUsersComponent>;
  const activatedRouteMock = {
    queryParams: of(convertToParamMap({ ...EmployerProfileLinkRequestMock.pagingMetadata, tab: 0 })),
    snapshot: {
      queryParams: convertToParamMap({ ...EmployerProfileLinkRequestMock.pagingMetadata, tab: 0 }),
      url: [{ path: 'account-access-management' }],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageUsersComponent, NuverialTextInputComponent, NuverialButtonComponent, UserListComponent, InviteListComponent, NoopAnimationsModule],
      providers: [
        InviteService,
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
        MockProvider(LoggingService),
        MockProvider(Router),
        MockProvider(NuverialSnackBarService),
        {
          provide: WorkApiRoutesService,
          useValue: {
            inviteUserEmployerProfile$: jest.fn().mockImplementation(() => of(undefined)),
          },
        },
        MockProvider(MatDialog),
        MockProvider(UserStateService, {
          userProfile$: of(UserEmployerProfilesListMock[0]),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Invite User', () => {
    it('should open dialog when user clicks on invite', () => {
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({ afterClosed: () => of({}) } as MatDialogRef<unknown, unknown>);
      const inviteSpy = jest.spyOn(component, 'inviteUser');

      const inviteButton = fixture.debugElement.query(By.css('.manage-users__invite-user'));

      inviteButton.nativeElement.click();

      expect(inviteSpy).toHaveBeenCalled();
      expect(dialogSpy).toHaveBeenCalled();
    });

    it('should show success when an invite is successfull', () => {
      const mockUser = {
        emailAddress: 'test@test.com',
        role: EmployerProfileLinkMock.profileAccessLevel,
      };
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({
        afterClosed: () => of(mockUser),
      } as MatDialogRef<unknown, unknown>);
      const inviteSpy = jest.spyOn(component, 'inviteUser');
      const workService = ngMocks.findInstance(WorkApiRoutesService);
      const userSpy = jest.spyOn(workService, 'inviteUserEmployerProfile$');
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const successSnackSpy = jest.spyOn(snackService, 'notifyApplicationSuccess');

      const inviteButton = fixture.debugElement.query(By.css('.manage-users__invite-user'));

      inviteButton.nativeElement.click();

      expect(inviteSpy).toHaveBeenCalled();
      expect(dialogSpy).toHaveBeenCalled();
      expect(userSpy).toHaveBeenCalledWith(UserEmployerProfilesListMock[0].id, mockUser.emailAddress, mockUser.role);
      expect(successSnackSpy).toHaveBeenCalled();
    });

    it('should show error when an invite has error', () => {
      const mockUser = {
        emailAddress: 'test@test.com',
        role: EmployerProfileLinkMock.profileAccessLevel,
      };
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({
        afterClosed: () => of(mockUser),
      } as MatDialogRef<unknown, unknown>);
      const inviteSpy = jest.spyOn(component, 'inviteUser');
      const workService = ngMocks.findInstance(WorkApiRoutesService);
      const workSpy = jest.spyOn(workService, 'inviteUserEmployerProfile$').mockImplementation(() => throwError(() => undefined));
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const errorSpy = jest.spyOn(snackService, 'notifyApplicationError');

      const inviteButton = fixture.debugElement.query(By.css('.manage-users__invite-user'));

      inviteButton.nativeElement.click();

      expect(inviteSpy).toHaveBeenCalled();
      expect(dialogSpy).toHaveBeenCalled();
      expect(workSpy).toHaveBeenCalledWith(UserEmployerProfilesListMock[0].id, mockUser.emailAddress, mockUser.role);
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should show that user has already been invited if status is 409', () => {
      const mockUser = {
        emailAddress: 'test@test.com',
        role: EmployerProfileLinkMock.profileAccessLevel,
      };
      const dialogSpy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({
        afterClosed: () => of(mockUser),
      } as MatDialogRef<unknown, unknown>);
      const inviteSpy = jest.spyOn(component, 'inviteUser');
      const workService = ngMocks.findInstance(WorkApiRoutesService);
      const workSpy = jest.spyOn(workService, 'inviteUserEmployerProfile$').mockImplementation(() => throwError(() => new HttpErrorResponse({ status: 409 })));
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const errorSpy = jest.spyOn(snackService, 'notifyApplicationError');

      const inviteButton = fixture.debugElement.query(By.css('.manage-users__invite-user'));

      inviteButton.nativeElement.click();

      expect(inviteSpy).toHaveBeenCalled();
      expect(dialogSpy).toHaveBeenCalled();
      expect(workSpy).toHaveBeenCalledWith(UserEmployerProfilesListMock[0].id, mockUser.emailAddress, mockUser.role);
      expect(errorSpy).toBeCalledWith('This user has already been invited');
    });
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

  it('should set selected index and navigate', () => {
    const index = 1;
    const service = ngMocks.findInstance(Router);
    const route = ngMocks.findInstance(ActivatedRoute);
    const spy = jest.spyOn(service, 'navigate');

    component.setSelectedIndex(index);
    expect(spy).toHaveBeenCalledWith([], { queryParams: { tab: index } as Params, queryParamsHandling: 'merge', relativeTo: route });
  });

  it('should set the user and invite lists counts', () => {
    const count = 10;
    expect(component.userListCount).toEqual(0);
    expect(component.inviteListCount).toEqual(0);
    component.setUserListCount(count);
    component.setInviteListCount(count);
    expect(component.userListCount).toEqual(count);
    expect(component.inviteListCount).toEqual(count);
  });
});
