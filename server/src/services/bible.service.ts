import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface Verse {
    number: string;
    text: string;
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
    translation: string;
    testaments: Testament[];
}

class BibleService {
    private bibleData: BibleData | null = null;
    private readonly xmlPath = path.join(__dirname, '..', '..', '..', 'PortugueseBible.xml');

    constructor() {
        this.loadBible();
    }

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

    private loadBible() {
        try {
            const xmlContent = fs.readFileSync(this.xmlPath, 'utf8');
            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: '',
                textNodeName: 'text'
            });
            const jsonObj = parser.parse(xmlContent);

            const bible = jsonObj.bible;
            const testaments = Array.isArray(bible.testament) ? bible.testament : [bible.testament];

            this.bibleData = {
                translation: bible.translation,
                testaments: testaments.map((t: any) => ({
                    name: t.name,
                    books: (Array.isArray(t.book) ? t.book : [t.book]).map((b: any) => ({
                        number: b.number,
                        name: this.bookNames[b.number] || `Livro ${b.number}`,
                        chapters: (Array.isArray(b.chapter) ? b.chapter : [b.chapter]).map((c: any) => ({
                            number: c.number,
                            verses: (Array.isArray(c.verse) ? c.verse : [c.verse]).map((v: any) => ({
                                number: v.number,
                                text: v.text || v['#text'] || ''
                            }))
                        }))
                    }))
                }))
            };
            console.log(`[BibleService]: Bíblia carregada com sucesso. Tradução: ${this.bibleData.translation}`);
        } catch (error) {
            console.error('[BibleService]: Erro ao carregar a Bíblia:', error);
        }
    }

    public getBooks() {
        if (!this.bibleData) return [];
        return this.bibleData.testaments.flatMap(t => t.books);
    }

    public getChapter(bookNumber: string, chapterNumber: string) {
        const book = this.getBooks().find(b => b.number === bookNumber);
        if (!book) return null;
        return book.chapters.find(c => c.number === chapterNumber) || null;
    }
}

export const bibleService = new BibleService();
