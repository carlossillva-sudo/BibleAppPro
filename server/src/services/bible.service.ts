import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

export interface Verse {
  number: string;
  content: string;
}

export interface Chapter {
  number: string;
  verses: Verse[];
}

export interface Book {
  number: string;
  name: string;
  chapters: Chapter[];
}

export interface Testament {
  name: string;
  books: Book[];
}

export interface BibleData {
  id: string;
  translation: string;
  books: Book[];
}

export interface TranslationConfig {
  id: string;
  name: string;
  file: string;
}

const TRANSLATIONS_CONFIG: TranslationConfig[] = [
  { id: '1969', name: 'Portuguese Bible Old Orthography', file: 'Portuguese1969Bible.xml' },
  { id: 'A21', name: 'Portuguese A21 (Biblia Almeida Século 21)', file: 'PortugueseA21Bible.xml' },
  {
    id: 'AL1628',
    name: 'Portuguese Almeida 1628 Public Domain',
    file: 'PortugueseAlmeida1628Bible.xml',
  },
  {
    id: 'AL1753',
    name: 'Portuguese Almeida 1753 Public Domain',
    file: 'PortugueseAlmeida1753Bible.xml',
  },
  { id: 'ARA', name: 'Almeida Revista e Atualizada (ARA 1993)', file: 'PortugueseBible.xml' },
  { id: 'BLT', name: 'Bíblia Livre Para Todos', file: 'PortugueseBLTBible.xml' },
  { id: 'BPT09', name: 'BPT09 (Aprenda Mais Sobre a BÍBLIA)', file: 'PortugueseBPT09Bible.xml' },
  { id: 'CAP', name: 'Capuchinhos', file: 'PortugueseCAPBible.xml' },
  { id: 'MZNVI', name: 'Nova Versão Internacional (Moçambique)', file: 'PortugueseMZNVIBible.xml' },
  {
    id: 'MZNVI',
    name: 'Nova Versão Internacional (Moçambique)',
    file: 'PortugueseMZNVIBible (1).xml',
  },
  { id: 'NAA', name: 'Nova Almeida Atualizada 2017', file: 'PortugueseNAABible.xml' },
  { id: 'NBV', name: 'Nova Bíblia Viva', file: 'PortugueseNBV2007Bible.xml' },
  { id: 'NTLH', name: 'Nova Tradução na Linguagem de Hoje', file: 'PortugueseNTLHBible.xml' },
  { id: 'NVI23', name: 'Nova Versão Internacional 2023', file: 'PortugueseNVI2023Bible.xml' },
  { id: 'NVI', name: 'Nova Versão Internacional 2000', file: 'PortugueseNVIBible.xml' },
  { id: 'NVT', name: 'Nova Versão Transformadora', file: 'PortugueseNVTBible.xml' },
  { id: 'OL', name: 'O Livro 2017', file: 'PortugueseOLBible.xml' },
  { id: 'TB', name: 'Tradução Brasileira', file: 'PortugueseTBBible.xml' },
  { id: 'VFL', name: 'Versão Fácil de Ler', file: 'PortugueseVFLBible.xml' },
];

const TRANSLATIONS_MAP = new Map<string, TranslationConfig>();
TRANSLATIONS_CONFIG.forEach((t) => TRANSLATIONS_MAP.set(t.file, t));

class BibleService {
  private bibles: Map<string, BibleData> = new Map();
  private booksMaps: Map<string, Map<string, Book>> = new Map();
  private versionsList: { id: string; name: string }[] = [];
  private readyPromise: Promise<void>;
  private isLoaded: boolean = false;
  private loadError: string | null = null;

  private readonly bookNames: Record<string, string> = {
    '1': 'Gênesis',
    '2': 'Êxodo',
    '3': 'Levítico',
    '4': 'Números',
    '5': 'Deuteronômio',
    '6': 'Josué',
    '7': 'Juízes',
    '8': 'Rute',
    '9': '1 Samuel',
    '10': '2 Samuel',
    '11': '1 Reis',
    '12': '2 Reis',
    '13': '1 Crônicas',
    '14': '2 Crônicas',
    '15': 'Esdras',
    '16': 'Neemias',
    '17': 'Ester',
    '18': 'Jó',
    '19': 'Salmos',
    '20': 'Provérbios',
    '21': 'Eclesiastes',
    '22': 'Cântico dos Cânticos',
    '23': 'Isaías',
    '24': 'Jeremias',
    '25': 'Lamentações de Jeremias',
    '26': 'Ezequiel',
    '27': 'Daniel',
    '28': 'Oséias',
    '29': 'Joel',
    '30': 'Amós',
    '31': 'Obadias',
    '32': 'Jonas',
    '33': 'Miquéias',
    '34': 'Naum',
    '35': 'Habacuque',
    '36': 'Sofonias',
    '37': 'Ageu',
    '38': 'Zacarias',
    '39': 'Malaquias',
    '40': 'Mateus',
    '41': 'Marcos',
    '42': 'Lucas',
    '43': 'João',
    '44': 'Atos',
    '45': 'Romanos',
    '46': '1 Coríntios',
    '47': '2 Coríntios',
    '48': 'Gálatas',
    '49': 'Efésios',
    '50': 'Filipenses',
    '51': 'Colossenses',
    '52': '1 Tessalonicenses',
    '53': '2 Tessalonicenses',
    '54': '1 Timóteo',
    '55': '2 Timóteo',
    '56': 'Tito',
    '57': 'Filemom',
    '58': 'Hebreus',
    '59': 'Tiago',
    '60': '1 Pedro',
    '61': '2 Pedro',
    '62': '1 João',
    '63': '2 João',
    '64': '3 João',
    '65': 'Judas',
    '66': 'Apocalipse',
  };

  constructor() {
    this.readyPromise = this.initialize();
  }

  private async ensureLoaded(): Promise<void> {
    await this.readyPromise;
  }

  private async initialize(): Promise<void> {
    return this.loadAllBibles();
  }

  private getTranslationId(fileName: string): { id: string; name: string } {
    const config = TRANSLATIONS_MAP.get(fileName);
    if (config) {
      return { id: config.id, name: config.name };
    }
    return { id: 'DESCONHECIDO', name: fileName };
  }

  private async loadAllBibles(): Promise<void> {
    try {
      const rootDir = process.cwd();
      const files = fs.readdirSync(rootDir);
      const bibleFiles = files.filter(
        (f) => f.startsWith('Portuguese') && f.trim().endsWith('.xml')
      );

      if (bibleFiles.length === 0) {
        const parentDir = path.join(rootDir, '..');
        if (fs.existsSync(parentDir)) {
          const parentDirFiles = fs.readdirSync(parentDir);
          const parentBibleFiles = parentDirFiles.filter(
            (f) => f.startsWith('Portuguese') && f.trim().endsWith('.xml')
          );
          if (parentBibleFiles.length > 0) {
            process.chdir('..');
            return this.loadAllBibles();
          }
        }
        throw new Error('Nenhum arquivo de Bíblia XML encontrado no diretório raiz.');
      }

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        textNodeName: 'text',
      });

      console.log('[BibleService] Iniciando carregamento das traduções...');
      console.log(`[BibleService] Traduções configuradas: ${TRANSLATIONS_CONFIG.length}`);

      for (const file of bibleFiles) {
        const filePath = path.join(rootDir, file);
        try {
          const { id: versionId, name: translationName } = this.getTranslationId(file);

          console.log(`[BibleService] Processando: ${file} → ${versionId}`);

          const xml = fs.readFileSync(filePath, 'utf8');
          const jsonObj = parser.parse(xml);
          const bible = jsonObj.bible;

          if (bible && bible.testament) {
            const books: Book[] = [];
            const testaments = Array.isArray(bible.testament) ? bible.testament : [bible.testament];

            for (const t of testaments) {
              if (!t || !t.book) continue;
              const testamentBooks = Array.isArray(t.book) ? t.book : [t.book];
              for (const b of testamentBooks) {
                if (!b || !b.number) {
                  console.warn(`[BibleService] Livro sem número em ${file}`);
                  continue;
                }
                const bookChapters = b.chapter
                  ? Array.isArray(b.chapter)
                    ? b.chapter
                    : [b.chapter]
                  : [];
                books.push({
                  number: b.number,
                  name: (this.bookNames as any)[b.number] || `Livro ${b.number}`,
                  chapters: bookChapters.map((c: any) => {
                    if (!c) return { number: '', verses: [] };
                    const chapterVerses = c.verse
                      ? Array.isArray(c.verse)
                        ? c.verse
                        : [c.verse]
                      : [];
                    return {
                      number: c.number || '',
                      verses: chapterVerses.map((v: any) => ({
                        number: v?.number || '',
                        content: String(v?.text || v?.['#text'] || '').trim(),
                      })),
                    };
                  }),
                });
              }
            }

            const bibleData: BibleData = {
              id: versionId,
              translation: translationName || bible.translation || versionId,
              books: books,
            };

            if (this.bibles.has(versionId)) {
              console.warn(`[BibleService] Versão ${versionId} já carregada, ignorando ${file}`);
              continue;
            }

            this.bibles.set(versionId, bibleData);
            this.versionsList.push({ id: versionId, name: bibleData.translation });

            const bookMap = new Map<string, Book>();
            books.forEach((book) => bookMap.set(book.number.toString(), book));
            this.booksMaps.set(versionId, bookMap);

            console.log(
              `[BibleService] ✓ Carregado: ${versionId} - "${bibleData.translation}" - ${books.length} livros`
            );
          } else {
            console.warn(`[BibleService] Arquivo ${file} não contém estrutura válida.`);
          }
        } catch (error: any) {
          console.error(`[BibleService] Erro ao carregar ${file}:`, error.message);
        }
      }

      console.log('[BibleService] Resumo das traduções carregadas:');
      this.versionsList.forEach((v, i) => {
        console.log(`  ${i + 1}. ${v.id} - ${v.name}`);
      });
      console.log(`[BibleService] Total: ${this.versionsList.length} traduções`);

      this.isLoaded = true;
    } catch (error: any) {
      this.loadError = error.message;
      console.error('[BibleService] Erro ao carregar as Bíblias:', error);
    }
  }

  public getStatus() {
    return { isLoaded: this.isLoaded, versionsCount: this.bibles.size, error: this.loadError };
  }

  public getTranslationsList(): TranslationConfig[] {
    return TRANSLATIONS_CONFIG;
  }

  public async getVersions() {
    await this.ensureLoaded();
    return this.versionsList;
  }

  private async getFirstVersionId(): Promise<string> {
    await this.ensureLoaded();
    return this.versionsList[0]?.id || 'ARA';
  }

  public async getBooks(versionId?: string) {
    await this.ensureLoaded();
    const vid = versionId || (await this.getFirstVersionId());
    const bible = this.bibles.get(vid);
    if (!bible) return [];
    return bible.books.map((book) => ({
      number: book.number,
      name: book.name,
      chaptersCount: book.chapters.length,
    }));
  }

  public async getChapter(bookNumber: string, chapterNumber: string, versionId?: string) {
    await this.ensureLoaded();
    const vid = versionId || (await this.getFirstVersionId());
    const booksMap = this.booksMaps.get(vid);
    if (!booksMap) return null;

    const book = booksMap.get(bookNumber);
    if (!book) return null;

    return book.chapters.find((c) => c.number === chapterNumber) || null;
  }

  public async searchContent(query: string, versionId?: string, booksFilter?: string) {
    await this.ensureLoaded();
    if (!this.isLoaded) return [];
    const vid = versionId || (await this.getFirstVersionId());
    const books = await this.getBooks(vid);
    if (books.length === 0) return [];

    const results = [];
    const normalizedQuery = query.toLowerCase();

    const filterBooks = booksFilter
      ? booksFilter.split(',').map((b) => b.trim().toLowerCase())
      : null;

    for (const book of books) {
      if (filterBooks && filterBooks.length > 0) {
        const bookMatches = filterBooks.some(
          (f) => book.name.toLowerCase().includes(f) || book.name.toLowerCase() === f
        );
        if (!bookMatches) continue;
      }

      for (const chapter of book.chapters) {
        for (const verse of chapter.verses) {
          if (verse.content.toLowerCase().includes(normalizedQuery)) {
            results.push({
              bookNumber: book.number,
              bookName: book.name,
              chapterNumber: chapter.number,
              verseNumber: verse.number,
              content: verse.content,
              version: vid,
            });
          }
          if (results.length >= 100) return results;
        }
      }
    }
    return results;
  }
}

export const bibleService = new BibleService();
