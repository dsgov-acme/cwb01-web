import { SchemaModel } from '@dsg/shared/utils/http';

export interface IEmployerProfileLink {
  profileId: string;
  userId: string;
  profileAccessLevel: string;
  createdBy: string;
  createdTimestamp: string;
  lastUpdatedBy: string;
  lastUpdatedTimestamp: string;
}

export class EmployerProfileLink implements SchemaModel<IEmployerProfileLink> {
  public profileId = '';
  public userId = '';
  public profileAccessLevel = '';
  public createdBy = '';
  public createdTimestamp = '';
  public lastUpdatedBy = '';
  public lastUpdatedTimestamp = '';

  constructor(linkSchema?: IEmployerProfileLink) {
    if (linkSchema) {
      this.fromSchema(linkSchema);
    }
  }

  public fromSchema(linkSchema: IEmployerProfileLink): void {
    this.profileId = linkSchema.profileId;
    this.userId = linkSchema.userId;
    this.createdTimestamp = linkSchema.createdTimestamp;
    this.lastUpdatedTimestamp = linkSchema.lastUpdatedTimestamp;
    this.profileAccessLevel = linkSchema.profileAccessLevel;
    this.createdBy = linkSchema.createdBy;
    this.lastUpdatedBy = linkSchema.lastUpdatedBy;
  }
}
