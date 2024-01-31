import { PagingResponseModel } from '@dsg/shared/utils/http';
import { IUser, IUserRole, IUsersPaginationResponse, UserModel } from './user.model';

export const UserModelMock: IUser = {
  assignedRoles: [],
  displayName: 'Chandler Muriel Bing',
  email: 'c.m.bing@aol.com',
  externalId: '345354567567567567',
  firstName: 'Chandler',
  id: '4534546575675',
  lastName: 'Bing',
  middleName: 'Muriel',
  phoneNumber: '555-776-3322',
  preferences: { preferredCommunicationMethod: 'email', preferredLanguage: 'en' },
};

export const UserMock: UserModel = new UserModel(UserModelMock);

export const AgencyUsersMock: IUsersPaginationResponse<UserModel> = {
  pagingMetadata: new PagingResponseModel({
    nextPage: '',
    pageNumber: 1,
    pageSize: 10,
    totalCount: 200,
  }),
  users: [
    new UserModel({
      assignedRoles: [],
      displayName: 'Chandler M Bing',
      email: 'c.m.bing@aol.com',
      externalId: '345354567567567567',
      firstName: 'Chandler',
      id: '3f7efb30-1a32-4a61-808a-64a60dbbee27',
      lastName: 'Bing',
      middleName: 'Muriel',
      phoneNumber: '555-776-3322',
      preferences: { preferredCommunicationMethod: 'email', preferredLanguage: 'en' },
    }),
    new UserModel({
      assignedRoles: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          roleName: 'agency',
        },
      ],
      displayName: 'Chandler M Bing',
      email: 'c.m.bing@aol.com',
      externalId: '345354567567567567',
      firstName: 'Chandler',
      id: '222',
      lastName: '',
      middleName: 'Muriel',
      phoneNumber: '555-776-3322',
      preferences: { preferredCommunicationMethod: 'email', preferredLanguage: 'en' },
    }),
    new UserModel({
      assignedRoles: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          roleName: 'agency',
        },
      ],
      displayName: 'Monica Gellar Bing',
      email: 'm.g.bing@aol.com',
      externalId: '345354567hh567567',
      firstName: '',
      id: '8888',
      lastName: 'Gellar Bing',
      middleName: '',
      phoneNumber: '555-776-3322',
      preferences: { preferredCommunicationMethod: 'email', preferredLanguage: 'en' },
    }),
    new UserModel({
      assignedRoles: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          roleName: 'agency',
        },
      ],
      displayName: '',
      email: 'j.t@aol.com',
      externalId: '34535456756756sas7567',
      firstName: '',
      id: '9999',
      lastName: '',
      middleName: '',
      phoneNumber: '555-776-3322',
      preferences: { preferredCommunicationMethod: 'email', preferredLanguage: 'en' },
    }),
    new UserModel({
      assignedRoles: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          roleName: 'agency',
        },
      ],
      displayName: '',
      email: 'j.t@aol.com',
      externalId: '34535456756756sas7567',
      firstName: '',
      id: 'New Assigned User',
      lastName: '',
      middleName: '',
      phoneNumber: '555-776-3322',
      preferences: { preferredCommunicationMethod: 'email', preferredLanguage: 'en' },
    }),
    new UserModel({
      assignedRoles: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          roleName: 'agency',
        },
      ],
      displayName: '',
      email: 'j.t@aol.com',
      externalId: '34535456756756sas7567',
      firstName: '',
      id: '3f7efb30-1a32-4a61-808a-64a60dbbee2',
      lastName: '',
      middleName: '',
      phoneNumber: '555-776-3322',
      preferences: { preferredCommunicationMethod: 'email', preferredLanguage: 'en' },
    }),
    new UserModel({
      assignedRoles: [
        {
          id: '3f7efb30-1a32-4a61-808a-64a60dbbee29',
          roleName: 'agency',
        },
      ],
      displayName: '',
      email: 'c.m.ling@aol.com',
      externalId: '345354567567567567',
      firstName: '',
      id: '3f7efb30-1a32-4a61-808a-64a60dbbee29',
      lastName: '',
      middleName: '',
      phoneNumber: '555-776-3322',
      preferences: { preferredCommunicationMethod: 'email', preferredLanguage: 'en' },
    }),
  ],
};

export const RolesMock: IUserRole[] = [
  {
    description: '',
    id: '1',
    name: 'Role1',
    permissions: [],
  },
  {
    description: '',
    id: '2',
    name: 'Role2',
    permissions: [],
  },
];
