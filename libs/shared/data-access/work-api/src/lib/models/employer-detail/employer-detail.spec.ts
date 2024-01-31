import { EmployerDetailModel, IEmployerDetail } from './employer-detail.model';

const employerDetailMock: IEmployerDetail = {
  accountId: 'testAccountId',
  assignedTo: 'testAssignedTo',
  displayName: 'testDisplayName',
  email: 'testEmail',
  preferences: {
    preferredCommunicationMethod: 'testMethod',
    preferredLanguage: 'testLanguage',
  },
};
describe('EmployerDetailModel', () => {
  const employerDetailModel = new EmployerDetailModel(employerDetailMock);

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(employerDetailModel.assignedTo).toEqual(employerDetailMock.assignedTo);
      expect(employerDetailModel.displayName).toEqual(employerDetailMock.displayName);
      expect(employerDetailModel.accountId).toEqual(employerDetailMock.accountId);
      expect(employerDetailModel.email).toEqual(employerDetailMock.email);
      expect(employerDetailModel.preferences).toEqual(employerDetailMock.preferences);
    });
  });

  test('toSchema', () => {
    expect(employerDetailModel.toSchema()).toEqual(employerDetailMock);
  });
});
