import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

async function diagnose() {
    const rootDir = process.cwd();
    // Go up to root if in server/
    const targetDir = rootDir.endsWith('server') ? path.join(rootDir, '..') : rootDir;
    const files = fs.readdirSync(targetDir).filter(f => f.startsWith('Portuguese') && f.endsWith('.xml'));

    console.log(`Found ${files.length} Bible files in ${targetDir}`);

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        textNodeName: 'text'
    });

    for (const file of files) {
        try {
            const xml = fs.readFileSync(path.join(targetDir, file), 'utf8');
            const jsonObj = parser.parse(xml);
            const bible = jsonObj.bible;

            if (bible && bible.testament) {
                const testaments = Array.isArray(bible.testament) ? bible.testament : [bible.testament];
                let bookCount = 0;
                for (const t of testaments) {
                    if (t.book) {
                        const books = Array.isArray(t.book) ? t.book : [t.book];
                        bookCount += books.length;
                    }
                }
                console.log(`[OK]: ${file} - Version: ${bible.translation || 'N/A'} - Books: ${bookCount}`);
            } else {
                console.warn(`[WARN]: ${file} - Invalid structure (missing bible.testament)`);
            }
        } catch (err) {
            console.error(`[ERROR]: ${file} - ${err.message}`);
        }
    }
}

diagnose();
