import { UserPreferencesModel } from './preferences.model';
import { UserPreferences } from './user.model';

export const PreferencesMock: UserPreferences = {
  preferredCommunicationMethod: 'Email',
  preferredLanguage: 'Eng',
};

export const PreferencesModelMock: UserPreferencesModel = new UserPreferencesModel(PreferencesMock);
