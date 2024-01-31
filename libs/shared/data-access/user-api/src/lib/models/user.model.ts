import { IPaginationResponse, SchemaModel } from '@dsg/shared/utils/http';

export interface IUser {
  assignedRoles: unknown[];
  displayName: string;
  email: string;
  externalId: string;
  firstName: string;
  id: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  preferredLanguage: string;
  preferredCommunicationMethod: string;
}

export interface IUsersPaginationResponse<T> extends IPaginationResponse {
  users: T[];
}

export interface IUserRole {
  id: string;
  description: string;
  name: string;
  permissions: unknown[];
}

export class UserModel implements SchemaModel<IUser> {
  private _displayName? = '';
  public assignedRoles: unknown[] = [];
  public email = '';
  public externalId = '';
  public firstName = '';
  public id = '';
  public lastName = '';
  public middleName = '';
  public phoneNumber = '';
  public preferences = { preferredCommunicationMethod: '', preferredLanguage: '' };

  public get displayName(): string {
    if (!this._displayName) {
      this._displayName = `${this.firstName} ${this.middleName} ${this.lastName}`.replace(/\s{2,}/g, ' ').trim() || this.email || this.id;
    }

    return this._displayName;
  }

  public set displayName(displayName: string) {
    this._displayName = displayName;
  }

  constructor(userSchema?: IUser) {
    if (userSchema) {
      this.fromSchema(userSchema);
    }
  }

  public fromSchema(userSchema: IUser) {
    this.assignedRoles = userSchema.assignedRoles || [];
    this._displayName = userSchema.displayName || '';
    this.email = userSchema.email || '';
    this.externalId = userSchema.externalId || '';
    this.firstName = userSchema.firstName || '';
    this.id = userSchema.id || '';
    this.lastName = userSchema.lastName || '';
    this.middleName = userSchema.middleName || '';
    this.phoneNumber = userSchema.phoneNumber || '';
    this.preferences = userSchema.preferences || { preferredCommunicationMethod: '', preferredLanguage: '' };
  }

  public toSchema(): Partial<IUser> {
    return {
      email: this.email || '',
      firstName: this.firstName || '',
      lastName: this.lastName || '',
      middleName: this.middleName || '',
      phoneNumber: this.phoneNumber || '',
    };
  }
}
