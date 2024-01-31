import { FeatureFlagUserModel, FeatureFlagUserSchema } from './feature-flag-user.model';

describe('FeatureFlagUserModel', () => {
  it('should set properties from schema', () => {
    const schema: FeatureFlagUserSchema = {
      emailAddress: 'test@example.com',
      firstName: 'John',
      id: '123',
      lastName: 'Doe',
      tags: {
        age: 30,
        hobbies: ['reading', 'gaming'],
        isAdmin: true,
      },
      username: 'johndoe',
    };
    const featureFlagUserModel = new FeatureFlagUserModel(schema);

    expect(featureFlagUserModel.emailAddress).toEqual(schema.emailAddress);
    expect(featureFlagUserModel.firstName).toEqual(schema.firstName);
    expect(featureFlagUserModel.id).toEqual(schema.id);
    expect(featureFlagUserModel.lastName).toEqual(schema.lastName);
    expect(featureFlagUserModel.tags).toEqual(schema.tags);
    expect(featureFlagUserModel.username).toEqual(schema.username);
  });

  it('should set properties from schema', () => {
    const schema: FeatureFlagUserSchema = {
      emailAddress: 'test@example.com',
      firstName: 'John',
      id: '123',
      lastName: 'Doe',
      tags: {
        age: 30,
        hobbies: ['reading', 'gaming'],
        isAdmin: true,
      },
      username: 'johndoe',
    };
    const featureFlagUserModel = new FeatureFlagUserModel();

    featureFlagUserModel.fromSchema(schema);

    expect(featureFlagUserModel.emailAddress).toEqual(schema.emailAddress);
    expect(featureFlagUserModel.firstName).toEqual(schema.firstName);
    expect(featureFlagUserModel.id).toEqual(schema.id);
    expect(featureFlagUserModel.lastName).toEqual(schema.lastName);
    expect(featureFlagUserModel.tags).toEqual(schema.tags);
    expect(featureFlagUserModel.username).toEqual(schema.username);
  });

  it('should not set properties if schema is not provided', () => {
    const featureFlagUserModel = new FeatureFlagUserModel();

    expect(featureFlagUserModel.emailAddress).toBeUndefined();
    expect(featureFlagUserModel.firstName).toBeUndefined();
    expect(featureFlagUserModel.id).toBeUndefined();
    expect(featureFlagUserModel.lastName).toBeUndefined();
    expect(featureFlagUserModel.tags).toBeUndefined();
    expect(featureFlagUserModel.username).toBeUndefined();
  });
});
