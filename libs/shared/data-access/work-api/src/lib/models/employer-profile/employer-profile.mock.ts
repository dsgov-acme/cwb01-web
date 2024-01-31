import { PagingResponseModel } from '@dsg/shared/utils/http';
import { IEmployerProfileInvite } from './employer-profile-invite.model';
import { IEmployerProfileLink } from './employer-profile-link.model';
import { IEmployerProfilePaginationResponse, IUserEmployerProfile, UserEmployerProfileModel } from './employer-profile.model';

export const EmployerProfileLinkMock: IEmployerProfileLink = {
  createdBy: '8abfb88d-b933-48e6-abf5-1d1a1bc94c5b',
  createdTimestamp: '2024-01-03T17:24:52.045188Z',
  lastUpdatedBy: '8abfb88d-b933-48e6-abf5-1d1a1bc94c5b',
  lastUpdatedTimestamp: '2024-01-03T17:24:52.045188Z',
  profileAccessLevel: 'ADMIN',
  profileId: '680f61b1-9225-4d88-92b2-3f3e695844a3',
  userId: 'fffc1cec-fb25-4847-a007-17d19019e382',
};

export const EmployerProfileLinkRequestMock: IEmployerProfilePaginationResponse<IEmployerProfileLink> = {
  items: [EmployerProfileLinkMock],
  pagingMetadata: new PagingResponseModel({
    nextPage: '',
    pageNumber: 1,
    pageSize: 10,
    totalCount: 200,
  }),
};

const UserEmployerProfiles: IUserEmployerProfile = {
  displayName: 'Test User Corp.',
  id: '123123-123-1',
  level: 'ADMIN',
  type: 'EMPLOYER',
};
const UserEmployerProfiles2: IUserEmployerProfile = {
  displayName: 'Fake User Inc.',
  id: '456456-456-1',
  level: 'WRITER',
  type: 'EMPLOYER',
};
const UserEmployerProfiles3: IUserEmployerProfile = {
  displayName: 'User LLC.',
  id: '789789-789-1',
  level: 'ADMIN',
  type: 'EMPLOYER',
};
export const UserEmployerProfilesMock = new UserEmployerProfileModel(UserEmployerProfiles);
export const UserEmployerProfilesMock2 = new UserEmployerProfileModel(UserEmployerProfiles2);
export const UserEmployerProfilesMock3 = new UserEmployerProfileModel(UserEmployerProfiles3);

export const UserEmployerProfilesListMock = [UserEmployerProfilesMock, UserEmployerProfilesMock2, UserEmployerProfilesMock3];
export const EmployerProfileInviteMock: IEmployerProfileInvite = {
  accessLevel: 'ADMIN',
  claimed: false,
  createdTimestamp: '2024-01-05T21:16:15.035646562Z',
  email: 'test.user@test.com',
  expires: '2024-01-12T21:16:15.035646562Z',
  id: '123',
  profileId: '456',
  profileType: 'EMPLOYER',
};

export const EmployerProfileInviteRequestMock: IEmployerProfilePaginationResponse<IEmployerProfileInvite> = {
  items: [EmployerProfileInviteMock],
  pagingMetadata: new PagingResponseModel({
    nextPage: '',
    pageNumber: 0,
    pageSize: 10,
    totalCount: 200,
  }),
};
