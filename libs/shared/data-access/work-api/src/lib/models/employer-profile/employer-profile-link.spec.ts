import { EmployerProfileLink } from './employer-profile-link.model';
import { EmployerProfileLinkMock } from './employer-profile.mock';

describe('EmployerProfileInviteModel', () => {
  let linkModel: EmployerProfileLink;

  beforeEach(() => {
    linkModel = new EmployerProfileLink(EmployerProfileLinkMock);
  });

  describe('fromSchema', () => {
    it('should model porperties from schema', () => {
      expect(linkModel.profileId).toEqual(EmployerProfileLinkMock.profileId);
      expect(linkModel.userId).toEqual(EmployerProfileLinkMock.userId);
      expect(linkModel.profileAccessLevel).toEqual(EmployerProfileLinkMock.profileAccessLevel);
      expect(linkModel.createdBy).toEqual(EmployerProfileLinkMock.createdBy);
      expect(linkModel.createdTimestamp).toEqual(EmployerProfileLinkMock.createdTimestamp);
      expect(linkModel.lastUpdatedBy).toEqual(EmployerProfileLinkMock.lastUpdatedBy);
      expect(linkModel.lastUpdatedTimestamp).toEqual(EmployerProfileLinkMock.lastUpdatedTimestamp);
    });
  });
});
