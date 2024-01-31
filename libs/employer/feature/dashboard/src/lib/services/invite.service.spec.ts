import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { MockProvider, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import { InviteService } from './invite.service';

describe('InviteService', () => {
  let inviteService: InviteService;
  const profileId = '123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MockProvider(WorkApiRoutesService, {
          deleteEmployerProfileInvite$: jest.fn().mockImplementation(() => of(undefined)),
          inviteUserEmployerProfile$: jest.fn().mockImplementation(() => of(undefined)),
        }),
      ],
    });
    inviteService = TestBed.inject(InviteService);
  });

  it('should be created', () => {
    expect(inviteService).toBeTruthy();
  });

  it('should invite user to employer profile', done => {
    const mockUser = {
      accessLevel: 'ADMIN',
      email: 'test@test.com',
    };

    const service = ngMocks.findInstance(WorkApiRoutesService);
    const spy = jest.spyOn(service, 'inviteUserEmployerProfile$');
    inviteService.inviteUserEmployerProfile$(profileId, mockUser.email, mockUser.accessLevel).subscribe(() => {
      expect(spy).toBeCalledWith(profileId, mockUser.email, mockUser.accessLevel);
      done();
    });
  });
  it('should delete an invite', done => {
    const inviteId = '456';

    const service = ngMocks.findInstance(WorkApiRoutesService);
    const spy = jest.spyOn(service, 'deleteEmployerProfileInvite$');
    inviteService.deleteEmployerProfileInvite$(profileId, inviteId).subscribe(() => {
      expect(spy).toBeCalledWith(profileId, inviteId);
      done();
    });
  });

  it('should resend an invite to a user', done => {
    const mockUser = {
      accessLevel: 'ADMIN',
      email: 'test@test.com',
    };
    const inviteId = '456';

    const service = ngMocks.findInstance(WorkApiRoutesService);
    const inviteSpy = jest.spyOn(service, 'inviteUserEmployerProfile$');
    const deleteSpy = jest.spyOn(service, 'deleteEmployerProfileInvite$');
    inviteService.resendInvite$(profileId, inviteId, mockUser.email, mockUser.accessLevel).subscribe(() => {
      expect(deleteSpy).toBeCalledWith(profileId, inviteId);
      expect(inviteSpy).toBeCalledWith(profileId, mockUser.email, mockUser.accessLevel);
      done();
    });
  });
});
