import { AgencyUsersMock, UserModel } from '@dsg/shared/data-access/user-api';
import { isUserId } from './user.util';

describe('isUserId', () => {
  const users: UserModel[] = AgencyUsersMock.users;

  test('should validate proper uuids', () => {
    const userWithCorrectId = users.find(user => user.id === '3f7efb30-1a32-4a61-808a-64a60dbbee27');
    const id = userWithCorrectId?.id || '3f7efb30-1a32-4a61-808a-64a60dbbee27';
    expect(isUserId(id)).toBeTruthy();
  });

  test('should return false for improper uuids', () => {
    const userWithStringTextId = users.find(user => user.id === 'New Assigned User');
    const id = userWithStringTextId?.id || 'New Assigned User';
    expect(isUserId(id)).toBeFalsy();
  });

  test('should return false for uuids with missing digits', () => {
    const userWithMissingDigitsInId = users.find(user => user.id === '3f7efb30-1a32-4a61-808a-64a60dbbee2');
    const id = userWithMissingDigitsInId?.id || '3f7efb30-1a32-4a61-808a-64a60dbbee2';
    expect(isUserId(id)).toBeFalsy();
  });
});
