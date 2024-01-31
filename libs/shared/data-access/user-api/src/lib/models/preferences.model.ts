import { SchemaModel } from '@dsg/shared/utils/http';

export interface IUserPreferences {
  preferredLanguage: string;
  preferredCommunicationMethod: string;
}

export class UserPreferencesModel implements SchemaModel<IUserPreferences> {
  public preferredLanguage = '';
  public preferredCommunicationMethod = '';

  constructor(userPrefsSchema?: IUserPreferences) {
    if (userPrefsSchema) {
      this.fromSchema(userPrefsSchema);
    }
  }

  public fromSchema(userSchema: IUserPreferences) {
    this.preferredLanguage = userSchema.preferredLanguage || '';
    this.preferredCommunicationMethod = userSchema.preferredCommunicationMethod || '';
  }

  public toSchema(): Partial<IUserPreferences> {
    return {
      preferredCommunicationMethod: this.preferredCommunicationMethod || '',
      preferredLanguage: this.preferredLanguage || '',
    };
  }
}
