export interface BibleBook {
  number: string;
  name: string;
  chapters: BibleChapter[];
}

export interface BibleChapter {
  number: string;
  verses: BibleVerse[];
}

export interface BibleVerse {
  number: string;
  text: string;
}

export interface BibleVersion {
  id: string;
  name: string;
  filename: string;
}

export const BIBLE_VERSIONS: BibleVersion[] = [
  { id: 'ARA', name: 'Almeida Revista e Atualizada', filename: 'PortugueseBible.xml' },
  { id: 'NVI', name: 'Nova Versão Internacional', filename: 'PortugueseNVIBible.xml' },
  { id: 'NVT', name: 'Nova Versão Transformadora', filename: 'PortugueseNVTBible.xml' },
  { id: 'NTLH', name: 'Nova Tradução na Linguagem de Hoje', filename: 'PortugueseNTLHBible.xml' },
  { id: 'A21', name: 'Almeida Século 21', filename: 'PortugueseA21Bible.xml' },
  { id: 'NAA', name: 'Nova Almeida Atualizada', filename: 'PortugueseNAABible.xml' },
  { id: 'NBV', name: 'Nova Bíblia Viva', filename: 'PortugueseNBV2007Bible.xml' },
  { id: 'NVI2023', name: 'Nova Versão Internacional 2023', filename: 'PortugueseNVI2023Bible.xml' },
  { id: 'KJV', name: 'King James Version', filename: 'PortugueseBible.xml' },
  { id: 'BLT', name: 'Bíblia Livre na Linguagem de Hoje', filename: 'PortugueseBLTBible.xml' },
  { id: 'BPT09', name: 'Bíblica Pentecostal 2009', filename: 'PortugueseBPT09Bible.xml' },
  { id: 'CAP', name: 'Contemporary Academic Portuguese', filename: 'PortugueseCAPBible.xml' },
  { id: 'MZNVI', name: 'MSG - Nova Versão Internacional', filename: 'PortugueseMZNVIBible.xml' },
  { id: 'OLB', name: 'Olive Tree Literal Bible', filename: 'PortugueseOLBible.xml' },
  { id: 'TB', name: 'Tradução Brasileira', filename: 'PortugueseTBBible.xml' },
  { id: 'VFL', name: 'Versão Fiel', filename: 'PortugueseVFLBible.xml' },
  { id: 'ARA1628', name: 'Almeida 1628', filename: 'PortugueseAlmeida1628Bible.xml' },
  { id: 'ARA1753', name: 'Almeida 1753', filename: 'PortugueseAlmeida1753Bible.xml' },
  { id: '1969', name: 'Almeida 1969', filename: 'Portuguese1969Bible.xml' },
];

class BibleClientService {
  private cache: Map<string, BibleBook[]> = new Map();
  private loading: Map<string, Promise<BibleBook[]>> = new Map();

  async getVersions(): Promise<BibleVersion[]> {
    return BIBLE_VERSIONS;
  }

  async getBooks(
    versionId: string = 'ARA'
  ): Promise<{ number: string; name: string; chaptersCount: number }[]> {
    const books = await this.loadBible(versionId);
    return books.map((book) => ({
      number: book.number,
      name: book.name,
      chaptersCount: book.chapters.length,
    }));
  }

  async getChapter(
    bookNumber: string,
    chapterNumber: string,
    versionId: string = 'ARA'
  ): Promise<BibleVerse[]> {
    const books = await this.loadBible(versionId);
    const book = books.find((b) => b.number === bookNumber);
    if (!book) return [];

    const chapter = book.chapters.find((c) => c.number === chapterNumber);
    return chapter?.verses || [];
  }

  async searchContent(
    query: string,
    versionId: string = 'ARA'
  ): Promise<{ bookId: string; bookName: string; chapter: string; verse: string; text: string }[]> {
    const books = await this.loadBible(versionId);
    const results: {
      bookId: string;
      bookName: string;
      chapter: string;
      verse: string;
      text: string;
    }[] = [];
    const normalizedQuery = query.toLowerCase();

    for (const book of books) {
      for (const chapter of book.chapters) {
        for (const verse of chapter.verses) {
          if (verse.text.toLowerCase().includes(normalizedQuery)) {
            results.push({
              bookId: book.number,
              bookName: book.name,
              chapter: chapter.number,
              verse: verse.number,
              text: verse.text,
            });
          }
        }
      }
    }

    return results.slice(0, 50);
  }

  private async loadBible(versionId: string): Promise<BibleBook[]> {
    if (this.cache.has(versionId)) {
      return this.cache.get(versionId)!;
    }

    if (this.loading.has(versionId)) {
      return this.loading.get(versionId)!;
    }

    const loadingPromise = this.loadAndParseBible(versionId);
    this.loading.set(versionId, loadingPromise);

    try {
      const books = await loadingPromise;
      this.cache.set(versionId, books);
      return books;
    } finally {
      this.loading.delete(versionId);
    }
  }

  private async loadAndParseBible(versionId: string): Promise<BibleBook[]> {
    const version = BIBLE_VERSIONS.find((v) => v.id === versionId) || BIBLE_VERSIONS[0];

    try {
      const response = await fetch(`/${version.filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${version.filename}`);
      }

      const xmlText = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      const books: BibleBook[] = [];

      const bookNodes = xmlDoc.getElementsByTagName('Book');

      for (let i = 0; i < bookNodes.length; i++) {
        const bookNode = bookNodes[i];
        const bookNumber =
          bookNode.getAttribute('number') || bookNode.getAttribute('name') || String(i + 1);
        const bookName = bookNode.getAttribute('name') || 'Unknown';

        const chapters: BibleChapter[] = [];
        const chapterNodes = bookNode.getElementsByTagName('Chapter');

        for (let j = 0; j < chapterNodes.length; j++) {
          const chapterNode = chapterNodes[j];
          const chapterNumber = chapterNode.getAttribute('number') || String(j + 1);

          const verses: BibleVerse[] = [];
          const verseNodes = chapterNode.getElementsByTagName('Verse');

          for (let k = 0; k < verseNodes.length; k++) {
            const verseNode = verseNodes[k];
            const verseNumber = verseNode.getAttribute('number') || String(k + 1);
            const verseText = verseNode.textContent || '';

            verses.push({
              number: verseNumber,
              text: verseText.trim(),
            });
          }

          chapters.push({
            number: chapterNumber,
            verses,
          });
        }

        books.push({
          number: bookNumber,
          name: bookName,
          chapters,
        });
      }

      return books;
    } catch (error) {
      console.error('Error loading Bible XML:', error);
      return [];
    }
  }
}

export const bibleClient = new BibleClientService();
