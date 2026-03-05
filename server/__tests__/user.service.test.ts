import path from 'path';
import { promises as fs } from 'fs';
import { UserService } from '../src/services/user.service';

describe('UserService backup/restore (MVP)', () => {
  const testUserId = 'test-user-for-backup';
  const dataPath = path.resolve(__dirname, '../server/data/users.json');

  beforeAll(async () => {
    // Clean any existing test data
    await fs.rm(dataPath, { recursive: true, force: true });
  });

  test('should export and import user data', async () => {
    await UserService.importUser(testUserId, {
      favorites: [1, 2],
      notes: [],
      settings: { theme: 'light' },
    });
    const exported = await UserService.exportUser(testUserId);
    expect(exported).toEqual({ favorites: [1, 2], notes: [], settings: { theme: 'light' } });
  });
});
