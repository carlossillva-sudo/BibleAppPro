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

class BibleService {
    private bibles: Map<string, BibleData> = new Map();
    private booksMaps: Map<string, Map<string, Book>> = new Map();
    private versionsList: { id: string, name: string }[] = [];
    private readyPromise: Promise<void>;
    private isLoaded: boolean = false;
    private loadError: string | null = null;

    private readonly bookNames: Record<string, string> = {
        "1": "Gênesis", "2": "Êxodo", "3": "Levítico", "4": "Números", "5": "Deuteronômio",
        "6": "Josué", "7": "Juízes", "8": "Rute", "9": "1 Samuel", "10": "2 Samuel",
        "11": "1 Reis", "12": "2 Reis", "13": "1 Crônicas", "14": "2 Crônicas", "15": "Esdras",
        "16": "Neemias", "17": "Ester", "18": "Jó", "19": "Salmos", "20": "Provérbios",
        "21": "Eclesiastes", "22": "Cântico dos Cânticos", "23": "Isaías", "24": "Jeremias", "25": "Lamentações de Jeremias",
        "26": "Ezequiel", "27": "Daniel", "28": "Oséias", "29": "Joel", "30": "Amós",
        "31": "Obadias", "32": "Jonas", "33": "Miquéias", "34": "Naum", "35": "Habacuque",
        "36": "Sofonias", "37": "Ageu", "38": "Zacarias", "39": "Malaquias", "40": "Mateus",
        "41": "Marcos", "42": "Lucas", "43": "João", "44": "Atos", "45": "Romanos",
        "46": "1 Coríntios", "47": "2 Coríntios", "48": "Gálatas", "49": "Efésios", "50": "Filipenses",
        "51": "Colossenses", "52": "1 Tessalonicenses", "53": "2 Tessalonicenses", "54": "1 Timóteo", "55": "2 Timóteo",
        "56": "Tito", "57": "Filemom", "58": "Hebreus", "59": "Tiago", "60": "1 Pedro",
        "61": "2 Pedro", "62": "1 João", "63": "2 João", "64": "3 João", "65": "Judas", "66": "Apocalipse"
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

    private async loadAllBibles(): Promise<void> {
        try {
            const rootDir = process.cwd();
            const files = fs.readdirSync(rootDir);
            const bibleFiles = files.filter(f => f.startsWith('Portuguese') && f.endsWith('.xml'));

            if (bibleFiles.length === 0) {
                const parentDir = path.join(rootDir, '..');
                if (fs.existsSync(parentDir)) {
                    const parentDirFiles = fs.readdirSync(parentDir);
                    const parentBibleFiles = parentDirFiles.filter(f => f.startsWith('Portuguese') && f.endsWith('.xml'));
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
                textNodeName: 'text'
            });

            for (const file of bibleFiles) {
                const filePath = path.join(rootDir, file);
                try {
                    const xml = fs.readFileSync(filePath, 'utf8');
                    const jsonObj = parser.parse(xml);
                    const bible = jsonObj.bible;

                    if (bible && bible.testament) { // Check for bible.testament as well
                        let versionId = file.replace('Portuguese', '').replace('Bible.xml', '') || 'PADRAO';

                        // Robust book mapping
                        const books: Book[] = [];
                        const testaments = Array.isArray(bible.testament) ? bible.testament : [bible.testament];

                        for (const t of testaments) {
                            if (!t || !t.book) continue;
                            const testamentBooks = Array.isArray(t.book) ? t.book : [t.book];
                            for (const b of testamentBooks) {
                                if (!b || !b.number) {
                                    console.warn(`[BibleService] Book missing number in ${file}`);
                                    continue;
                                }
                                books.push({
                                    number: b.number,
                                    name: (this.bookNames as any)[b.number] || `Livro ${b.number}`,
                                    chapters: (Array.isArray(b.chapter) ? b.chapter : [b.chapter]).map((c: any) => ({
                                        number: c.number,
                                        verses: (Array.isArray(c.verse) ? c.verse : [c.verse]).map((v: any) => ({
                                            number: v.number,
                                            content: String(v.text || v['#text'] || '').trim() // Changed from 'text' to 'content'
                                        }))
                                    }))
                                });
                            }
                        }

                        const bibleData: BibleData = {
                            id: versionId,
                            translation: bible.translation || versionId,
                            books: books
                        };

                        this.bibles.set(versionId, bibleData);
                        this.versionsList.push({ id: versionId, name: bibleData.translation });

                        const bookMap = new Map<string, Book>();
                        books.forEach(book => bookMap.set(book.number.toString(), book));
                        this.booksMaps.set(versionId, bookMap);

                        console.log(`[BibleService]: Versão carregada: ${versionId} (${bibleData.translation}) - Livros: ${books.length}`);
                    } else {
                        console.warn(`[BibleService]: Arquivo ${file} não contém estrutura de Bíblia válida.`);
                    }
                } catch (error: any) {
                    console.error(`[BibleService]: Erro ao carregar o arquivo ${file}:`, error.message);
                }
            }

            this.isLoaded = true;
        } catch (error: any) {
            this.loadError = error.message;
            console.error('[BibleService]: Erro ao carregar as Bíblias:', error);
        }
    }

    public getStatus() {
        return { isLoaded: this.isLoaded, versionsCount: this.bibles.size, error: this.loadError };
    }

    public async getVersions() {
        await this.ensureLoaded();
        return this.versionsList;
    }

    private async getFirstVersionId(): Promise<string> {
        await this.ensureLoaded();
        return this.versionsList[0]?.id || '';
    }

    public async getBooks(versionId?: string) {
        await this.ensureLoaded();
        const vid = versionId || await this.getFirstVersionId();
        const bible = this.bibles.get(vid);
        if (!bible) return [];
        return bible.books;
    }

    public async getChapter(bookNumber: string, chapterNumber: string, versionId?: string) {
        await this.ensureLoaded();
        const vid = versionId || await this.getFirstVersionId();
        const booksMap = this.booksMaps.get(vid);
        if (!booksMap) return null;

        const book = booksMap.get(bookNumber);
        if (!book) return null;

        return book.chapters.find(c => c.number === chapterNumber) || null;
    }

    public async searchContent(query: string, versionId?: string) {
        await this.ensureLoaded();
        if (!this.isLoaded) return [];
        const vid = versionId || await this.getFirstVersionId();
        const books = await this.getBooks(vid);
        if (books.length === 0) return [];

        const results = [];
        const normalizedQuery = query.toLowerCase();

        for (const book of books) {
            for (const chapter of book.chapters) {
                for (const verse of chapter.verses) {
                    if (verse.content.toLowerCase().includes(normalizedQuery)) {
                        results.push({
                            bookNumber: book.number,
                            bookName: book.name,
                            chapterNumber: chapter.number,
                            verseNumber: verse.number,
                            content: verse.content,
                            version: vid
                        });
                    }
                    if (results.length >= 50) return results;
                }
            }
        }
        return results;
    }
}

export const bibleService = new BibleService();
