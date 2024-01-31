import { SchemaModel } from '@dsg/shared/utils/http';

export interface IEmployerProfileInvite {
  id: string;
  profileId: string;
  profileType: string;
  accessLevel: string;
  email: string;
  claimed: boolean;
  expires: string;
  createdTimestamp?: string;
}

export class EmployerProfileInvite implements SchemaModel<IEmployerProfileInvite> {
  public id = '';
  public profileId = '';
  public profileType = '';
  public accessLevel = '';
  public email = '';
  public claimed = false;
  public expires = '';
  public createdTimestamp?: string;

  constructor(linkSchema?: IEmployerProfileInvite) {
    if (linkSchema) {
      this.fromSchema(linkSchema);
    }
  }

  public fromSchema(linkSchema: IEmployerProfileInvite): void {
    this.id = linkSchema.id;
    this.profileId = linkSchema.profileId;
    this.profileType = linkSchema.profileType;
    this.accessLevel = linkSchema.accessLevel;
    this.email = linkSchema.email;
    this.claimed = linkSchema.claimed;
    this.expires = linkSchema.expires;
    this.createdTimestamp = linkSchema.createdTimestamp;
  }
}
