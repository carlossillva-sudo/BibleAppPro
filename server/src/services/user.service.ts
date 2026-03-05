import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple user-data storage wrapper
export class UserService {
  // In-memory cache to stabilize MVP tests and speed up access
  private static memory: Record<string, any> = {};
  // Backups directory for user data
  private static backupsDir = path.resolve(__dirname, '../../data/backups');
  // Path to the JSON store: server/data/users.json
  private static dataPath = path.resolve(__dirname, '../../data/users.json');

  // Load all user data from store
  static async loadAll(): Promise<Record<string, any>> {
    // Prefer in-memory cache when present
    if (Object.keys(this.memory).length > 0) {
      return this.memory;
    }
    try {
      const content = await fs.promises.readFile(this.dataPath, 'utf-8');
      const parsed = JSON.parse(content);
      this.memory = parsed;
      return parsed;
    } catch {
      // If file doesn't exist yet, start fresh
      this.memory = {};
      return {};
    }
  }

  // Persist all user data to store
  static async saveAll(data: Record<string, any>): Promise<void> {
    this.memory = data;
    await fs.promises.mkdir(path.dirname(this.dataPath), { recursive: true });
    await fs.promises.writeFile(this.dataPath, JSON.stringify(data, null, 2));
  }

  // Create a backup file for a user and return metadata
  static async createBackup(
    userId: string,
    data: any
  ): Promise<{ filename: string; timestamp: number }> {
    await fs.promises.mkdir(this.backupsDir, { recursive: true });
    const timestamp = Date.now();
    const filename = `backup_${userId}_${timestamp}.json`;
    const filePath = path.join(this.backupsDir, filename);
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    // Update history file
    const historyPath = path.join(this.backupsDir, `history_${userId}.json`);
    let history: Array<{ filename: string; timestamp: number; size?: number }> = [];
    try {
      const content = await fs.promises.readFile(historyPath, 'utf-8');
      history = JSON.parse(content);
    } catch {
      history = [];
    }
    const stat = await fs.promises.stat(filePath);
    history.unshift({ filename, timestamp, size: stat.size });
    await fs.promises.writeFile(historyPath, JSON.stringify(history, null, 2));
    return { filename, timestamp };
  }

  // Get backups history for a user
  static async getBackupsHistory(
    userId: string
  ): Promise<Array<{ filename: string; timestamp: number; size?: number }>> {
    const historyPath = path.join(this.backupsDir, `history_${userId}.json`);
    try {
      const content = await fs.promises.readFile(historyPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  // Export data for a given user (public MVP export)
  static async exportUser(userId: string): Promise<any> {
    const all = await this.loadAll();
    return all[userId] || {};
  }

  // Import/merge data for a given user
  static async importUser(userId: string, payload: any): Promise<void> {
    const all = await this.loadAll();
    const current = all[userId] || {};
    // Merge payload over existing data (simple MVP behavior)
    all[userId] = { ...current, ...payload };
    await this.saveAll(all);
  }
}

export default UserService;
