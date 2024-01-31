import { SchemaModel } from '@dsg/shared/utils/http';

export interface IEmployerDetail {
  assignedTo?: string;
  displayName: string;
  accountId: string;
  email: string;
  preferences: EmployerPreferences;
}

export interface EmployerPreferences {
  preferredLanguage: string;
  preferredCommunicationMethod: string;
}

export class EmployerDetailModel implements SchemaModel<IEmployerDetail> {
  public assignedTo?: string;
  public displayName = '';
  public accountId = '';
  public email = '';
  public preferences = { preferredCommunicationMethod: '', preferredLanguage: '' };

  constructor(employerDetails?: IEmployerDetail) {
    if (employerDetails) {
      this.fromSchema(employerDetails);
    }
  }

  public fromSchema(employerDetails: IEmployerDetail) {
    this.assignedTo = employerDetails.assignedTo;
    this.displayName = employerDetails.displayName;
    this.accountId = employerDetails.accountId;
    this.email = employerDetails.email;
    this.preferences = employerDetails.preferences;
  }

  public toSchema(): IEmployerDetail {
    return {
      accountId: this.accountId,
      assignedTo: this.assignedTo,
      displayName: this.displayName,
      email: this.email,
      preferences: this.preferences,
    };
  }
}
