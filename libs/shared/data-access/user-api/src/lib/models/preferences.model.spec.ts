import { PreferencesMock } from './preferences.mock';
import { IUserPreferences, UserPreferencesModel } from './preferences.model';

describe('UserPreferencesModel', () => {
  let userPreferencesModel: UserPreferencesModel;
  let emptyUserPreferencesModel: UserPreferencesModel;
  let userPreferencesInterface: IUserPreferences;

  beforeEach(() => {
    userPreferencesModel = new UserPreferencesModel(PreferencesMock);
    emptyUserPreferencesModel = new UserPreferencesModel();
    userPreferencesInterface = PreferencesMock;
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(userPreferencesModel.preferredCommunicationMethod).toEqual(PreferencesMock.preferredCommunicationMethod);
      expect(userPreferencesModel.preferredLanguage).toEqual(PreferencesMock.preferredLanguage);
    });

    test('should set all interface properties', () => {
      expect(userPreferencesInterface.preferredCommunicationMethod).toEqual(PreferencesMock.preferredCommunicationMethod);
      expect(userPreferencesInterface.preferredLanguage).toEqual(PreferencesMock.preferredLanguage);
    });

    test('should not set the schema when user model is undefined', () => {
      expect(userPreferencesModel.fromSchema(emptyUserPreferencesModel)).toBeUndefined();
    });
  });

  describe('toSchema', () => {
    test('should use existing properties', () => {
      expect(userPreferencesModel.toSchema()).toEqual(PreferencesMock);
    });

    test('should set properties to empty', () => {
      userPreferencesModel.preferredCommunicationMethod = '';
      userPreferencesModel.preferredLanguage = '';
      expect(userPreferencesModel.toSchema()).toEqual({ preferredCommunicationMethod: '', preferredLanguage: '' });
    });
  });
});
