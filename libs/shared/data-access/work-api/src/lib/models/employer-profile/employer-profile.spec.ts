import { IUserEmployerProfile, UserEmployerProfileModel } from './employer-profile.model';

const EmployerProfileMock: IUserEmployerProfile = {
  displayName: 'Test User Corp.',
  id: '123123-123-1',
  level: 'ADMIN',
  type: 'EMPLOYER',
};

describe('EmployerProfileModel', () => {
  const employerProfileModel = new UserEmployerProfileModel(EmployerProfileMock);

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(employerProfileModel.displayName).toEqual(EmployerProfileMock.displayName);
      expect(employerProfileModel.id).toEqual(EmployerProfileMock.id);
      expect(employerProfileModel.level).toEqual(EmployerProfileMock.level);
      expect(employerProfileModel.type).toEqual(EmployerProfileMock.type);
    });
  });

  test('toSchema', () => {
    expect(employerProfileModel.toSchema()).toEqual(EmployerProfileMock);
  });
});
