import { UserMock } from './user.mock';
import { UserModel } from './user.model';

describe('userModel', () => {
  let userModel: UserModel;
  let emptyUserModel: UserModel;

  beforeEach(() => {
    userModel = new UserModel(UserMock);
    emptyUserModel = new UserModel();
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(userModel.assignedRoles).toEqual(UserMock.assignedRoles);
      expect(userModel.displayName).toEqual(UserMock.displayName);
      expect(userModel.email).toEqual(UserMock.email);
      expect(userModel.externalId).toEqual(UserMock.externalId);
      expect(userModel.firstName).toEqual(UserMock.firstName);
      expect(userModel.id).toEqual(UserMock.id);
      expect(userModel.lastName).toEqual(UserMock.lastName);
      expect(userModel.middleName).toEqual(UserMock.middleName);
      expect(userModel.phoneNumber).toEqual(UserMock.phoneNumber);
      expect(userModel.preferences).toEqual(UserMock.preferences);
    });
  });

  test('toSchema', () => {
    expect(userModel.toSchema()).toEqual(UserMock.toSchema());
  });

  test('should not set the schema when user model is undefined', () => {
    expect(userModel.fromSchema(emptyUserModel)).toBeUndefined();
  });

  describe('displayName', () => {
    test('should get the displayName from displayName when one is provided', () => {
      const user = new UserModel({
        assignedRoles: [],
        displayName: 'display',
        email: 'test@email.com',
        externalId: '',
        firstName: 'first',
        id: 'testId',
        lastName: 'last',
        middleName: 'middle',
        phoneNumber: '',
      });

      expect(user.displayName).toContain('display');
    });

    test('should combine first middle last name if available from displayName', () => {
      const user = new UserModel({
        assignedRoles: [],
        displayName: '',
        email: 'test@email.com',
        externalId: '',
        firstName: 'first',
        id: 'testId',
        lastName: 'last',
        middleName: 'middle',
        phoneNumber: '',
      });

      expect(user.displayName).toContain('first middle last');
    });

    test('should combine first and last name when no middle name available from displayName', () => {
      const user = new UserModel({
        assignedRoles: [],
        displayName: '',
        email: 'test@email.com',
        externalId: '',
        firstName: 'first',
        id: 'testId',
        lastName: 'last',
        middleName: '',
        phoneNumber: '',
      });

      expect(user.displayName).toContain('first last');
    });

    test('should get first name from displayName if no middle name and last name exist', () => {
      const user = new UserModel({
        assignedRoles: [],
        displayName: '',
        email: 'test@email.com',
        externalId: '',
        firstName: 'first',
        id: 'testId',
        lastName: '',
        middleName: '',
        phoneNumber: '',
      });

      expect(user.displayName).toContain('first');
    });

    test('should get last name from displayName if no middle name and first name exist', () => {
      const user = new UserModel({
        assignedRoles: [],
        displayName: '',
        email: 'test@email.com',
        externalId: '',
        firstName: '',
        id: 'testId',
        lastName: 'last',
        middleName: '',
        phoneNumber: '',
      });

      expect(user.displayName).toContain('last');
    });

    test('should get email from displayName when provided and first middle last names do not exist', () => {
      const user = new UserModel({
        assignedRoles: [],
        displayName: '',
        email: 'test@email.com',
        externalId: '',
        firstName: '',
        id: 'testId',
        lastName: '',
        middleName: '',
        phoneNumber: '',
      });

      expect(user.displayName).toContain('test@email.com');
    });

    test('should get the id from displayName when provided and first middle last names and email do not exist', () => {
      const user = new UserModel({
        assignedRoles: [],
        displayName: '',
        email: '',
        externalId: '',
        firstName: '',
        id: 'testId',
        lastName: '',
        middleName: '',
        phoneNumber: '',
      });

      expect(user.displayName).toContain('testId');
    });
  });
});
