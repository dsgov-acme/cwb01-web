import { SchemaModel } from '@dsg/shared/utils/http';

export interface AuthenticationSchema {
  example: string;
}

export class AuthenticationModel implements SchemaModel<AuthenticationSchema> {
  public example = '';

  constructor(authenticationsSchema?: AuthenticationSchema) {
    if (authenticationsSchema) {
      this.fromSchema(authenticationsSchema);
    }
  }

  public fromSchema(authenticationsSchema: AuthenticationSchema) {
    this.example = authenticationsSchema.example;
  }

  public toSchema(): AuthenticationSchema {
    return {
      example: this.example,
    };
  }
}
