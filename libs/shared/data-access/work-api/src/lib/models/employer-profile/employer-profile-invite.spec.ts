import { EmployerProfileInvite } from './employer-profile-invite.model';
import { EmployerProfileInviteMock } from './employer-profile.mock';

describe('EmployerProfileInviteModel', () => {
  let inviteModel: EmployerProfileInvite;

  beforeEach(() => {
    inviteModel = new EmployerProfileInvite(EmployerProfileInviteMock);
  });

  describe('fromSchema', () => {
    it('should model porperties from schema', () => {
      expect(inviteModel.id).toEqual(EmployerProfileInviteMock.id);
      expect(inviteModel.profileId).toEqual(EmployerProfileInviteMock.profileId);
      expect(inviteModel.profileType).toEqual(EmployerProfileInviteMock.profileType);
      expect(inviteModel.accessLevel).toEqual(EmployerProfileInviteMock.accessLevel);
      expect(inviteModel.email).toEqual(EmployerProfileInviteMock.email);
      expect(inviteModel.claimed).toEqual(EmployerProfileInviteMock.claimed);
      expect(inviteModel.expires).toEqual(EmployerProfileInviteMock.expires);
      expect(inviteModel.createdTimestamp).toEqual(EmployerProfileInviteMock.createdTimestamp);
    });
  });
});
