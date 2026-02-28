const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

async function diagnose() {
    const rootDir = process.cwd();
    const files = fs.readdirSync(rootDir).filter(f => f.startsWith('Portuguese') && f.endsWith('.xml'));

    console.log(`Found ${files.length} Bible files.`);

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        textNodeName: 'text'
    });

    for (const file of files) {
        try {
            const xml = fs.readFileSync(path.join(rootDir, file), 'utf8');
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
