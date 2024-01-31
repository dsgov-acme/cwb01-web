import { IPaginationResponse, SchemaModel } from '@dsg/shared/utils/http';

export interface IEmployerProfilePaginationResponse<T> extends IPaginationResponse {
  items: T[];
}

export interface IUserEmployerProfile {
  type: string;
  level: string;
  id: string;
  displayName: string;
}
export class UserEmployerProfileModel implements SchemaModel<IUserEmployerProfile, Partial<IUserEmployerProfile>> {
  public type = '';
  public level = '';
  public id = '';
  public displayName = '';

  constructor(userEmployerProfileSchema?: IUserEmployerProfile) {
    if (userEmployerProfileSchema) {
      this.fromSchema(userEmployerProfileSchema);
    }
  }

  public fromSchema(userEmployerProfileSchema: IUserEmployerProfile) {
    this.type = userEmployerProfileSchema.type;
    this.level = userEmployerProfileSchema.level;
    this.id = userEmployerProfileSchema.id;
    this.displayName = userEmployerProfileSchema.displayName;
  }

  public toSchema(): Partial<IUserEmployerProfile> {
    return {
      displayName: this.displayName,
      id: this.id,
      level: this.level,
      type: this.type,
    };
  }
}
