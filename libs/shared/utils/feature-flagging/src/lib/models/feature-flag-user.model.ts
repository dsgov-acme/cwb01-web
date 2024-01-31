export interface FeatureFlagUserSchema {
  emailAddress?: string;
  firstName?: string;
  id?: string;
  lastName?: string;
  tags?: Record<string, string | boolean | number | Array<string | boolean | number>>;
  username?: string;
}

export class FeatureFlagUserModel {
  public emailAddress?: FeatureFlagUserSchema['emailAddress'];
  public firstName?: FeatureFlagUserSchema['firstName'];
  public id?: FeatureFlagUserSchema['id'];
  public lastName?: FeatureFlagUserSchema['lastName'];
  public tags?: FeatureFlagUserSchema['tags'];
  public username?: FeatureFlagUserSchema['username'];

  constructor(featureFlagUserSchema?: FeatureFlagUserSchema) {
    if (featureFlagUserSchema) {
      this.fromSchema(featureFlagUserSchema);
    }
  }

  public fromSchema(featureFlagUserSchema: FeatureFlagUserSchema): void {
    this.emailAddress = featureFlagUserSchema.emailAddress;
    this.firstName = featureFlagUserSchema.firstName;
    this.id = featureFlagUserSchema.id;
    this.lastName = featureFlagUserSchema.lastName;
    this.tags = featureFlagUserSchema.tags;
    this.username = featureFlagUserSchema.username;
  }
}
