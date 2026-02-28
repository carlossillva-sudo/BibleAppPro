import { bibleService } from './src/services/bible.service';

async function test() {
    console.log('--- Bible Service DIAGNOSTIC ---');
    const status = bibleService.getStatus();
    console.log('Status:', status);

    const versions = bibleService.getVersions();
    console.log('Available Versions:', versions.map(v => v.id));

    for (const v of versions) {
        const books = bibleService.getBooks(v.id);
        console.log(`Books for ${v.id}:`, books.length);
    }

    if (status.error) {
        console.error('ERROR DETECTED:', status.error);
    }
}

// Wait longer for service to load
console.log('Waiting 5 seconds for service to initialize...');
setTimeout(test, 5000);
