import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface BibleDB extends DBSchema {
  verses: {
    key: string;
    value: {
      id: string;
      bookId: number;
      chapter: number;
      verse: number;
      text: string;
      version: string;
    };
    indexes: { 'by-book': number; 'by-chapter': number };
  };
  favorites: {
    key: string;
    value: {
      id: string;
      bookId: number;
      chapter: number;
      verse: number;
      text: string;
      color?: string;
      note?: string;
      createdAt: string;
    };
  };
  notes: {
    key: string;
    value: {
      id: string;
      bookId: number;
      chapter: number;
      verse?: number;
      content: string;
      tags: string[];
      createdAt: string;
      updatedAt: string;
    };
  };
  readingHistory: {
    key: string;
    value: {
      id: string;
      bookId: number;
      chapter: number;
      timestamp: string;
    };
    indexes: { 'by-timestamp': string };
  };
  cache: {
    key: string;
    value: {
      key: string;
      data: unknown;
      timestamp: number;
    };
  };
}

class OfflineService {
  private db: IDBPDatabase<BibleDB> | null = null;
  private dbName = 'bibleapp-offline';
  private version = 1;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<BibleDB>(this.dbName, this.version, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('verses')) {
          const versesStore = db.createObjectStore('verses', { keyPath: 'id' });
          versesStore.createIndex('by-book', 'bookId');
          versesStore.createIndex('by-chapter', 'chapter');
        }

        if (!db.objectStoreNames.contains('favorites')) {
          db.createObjectStore('favorites', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('readingHistory')) {
          const historyStore = db.createObjectStore('readingHistory', { keyPath: 'id' });
          historyStore.createIndex('by-timestamp', 'timestamp');
        }

        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
      },
    });
  }

  async saveVerse(verse: BibleDB['verses']['value']): Promise<void> {
    await this.init();
    await this.db!.put('verses', verse);
  }

  async saveVerses(verses: BibleDB['verses']['value'][]): Promise<void> {
    await this.init();
    const tx = this.db!.transaction('verses', 'readwrite');
    await Promise.all([...verses.map((verse) => tx.store.put(verse)), tx.done]);
  }

  async getVerse(id: string): Promise<BibleDB['verses']['value'] | undefined> {
    await this.init();
    return this.db!.get('verses', id);
  }

  async getChapter(bookId: number, _chapter: number): Promise<BibleDB['verses']['value'][]> {
    await this.init();
    return this.db!.getAllFromIndex('verses', 'by-book', bookId);
  }

  async addFavorite(favorite: BibleDB['favorites']['value']): Promise<void> {
    await this.init();
    await this.db!.put('favorites', favorite);
  }

  async removeFavorite(id: string): Promise<void> {
    await this.init();
    await this.db!.delete('favorites', id);
  }

  async getFavorites(): Promise<BibleDB['favorites']['value'][]> {
    await this.init();
    return this.db!.getAll('favorites');
  }

  async addNote(note: BibleDB['notes']['value']): Promise<void> {
    await this.init();
    await this.db!.put('notes', note);
  }

  async updateNote(note: BibleDB['notes']['value']): Promise<void> {
    await this.init();
    await this.db!.put('notes', note);
  }

  async deleteNote(id: string): Promise<void> {
    await this.init();
    await this.db!.delete('notes', id);
  }

  async getNotes(): Promise<BibleDB['notes']['value'][]> {
    await this.init();
    return this.db!.getAll('notes');
  }

  async addToHistory(entry: BibleDB['readingHistory']['value']): Promise<void> {
    await this.init();
    await this.db!.put('readingHistory', entry);
  }

  async getReadingHistory(limit = 50): Promise<BibleDB['readingHistory']['value'][]> {
    await this.init();
    const all = await this.db!.getAllFromIndex('readingHistory', 'by-timestamp');
    return all.slice(-limit).reverse();
  }

  async cacheData(key: string, data: unknown, ttlMinutes = 60): Promise<void> {
    await this.init();
    await this.db!.put('cache', {
      key,
      data,
      timestamp: Date.now() + ttlMinutes * 60 * 1000,
    });
  }

  async getCachedData<T>(key: string): Promise<T | null> {
    await this.init();
    const cached = await this.db!.get('cache', key);

    if (!cached) return null;

    if (Date.now() > cached.timestamp) {
      await this.db!.delete('cache', key);
      return null;
    }

    return cached.data as T;
  }

  async clearCache(): Promise<void> {
    await this.init();
    await this.db!.clear('cache');
  }

  async getStorageUsage(): Promise<{ used: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
      };
    }
    return { used: 0, quota: 0 };
  }

  async exportData(): Promise<string> {
    await this.init();

    const [favorites, notes, history] = await Promise.all([
      this.db!.getAll('favorites'),
      this.db!.getAll('notes'),
      this.db!.getAll('readingHistory'),
    ]);

    return JSON.stringify(
      {
        favorites,
        notes,
        readingHistory: history,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }

  async importData(jsonData: string): Promise<void> {
    await this.init();

    const data = JSON.parse(jsonData);

    const tx = this.db!.transaction(['favorites', 'notes', 'readingHistory'], 'readwrite');

    if (data.favorites) {
      for (const fav of data.favorites) {
        await tx.objectStore('favorites').put(fav);
      }
    }

    if (data.notes) {
      for (const note of data.notes) {
        await tx.objectStore('notes').put(note);
      }
    }

    if (data.readingHistory) {
      for (const history of data.readingHistory) {
        await tx.objectStore('readingHistory').put(history);
      }
    }

    await tx.done;
  }
}

export const offlineService = new OfflineService();
