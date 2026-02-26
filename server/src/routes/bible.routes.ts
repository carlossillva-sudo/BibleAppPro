import { Router } from 'express';
import { bibleService } from '../services/bible.service.js';

const router = Router();

router.get('/livros', (req, res) => {
    const books = bibleService.getBooks();
    res.json(books.map(b => ({
        number: b.number,
        name: b.name,
        chaptersCount: b.chapters.length
    })));
});

router.get('/livros/:livroId/capitulos/:capId/versiculos', (req, res) => {
    const { livroId, capId } = req.params;
    const chapter = bibleService.getChapter(livroId, capId);
    if (!chapter) {
        return res.status(404).json({ message: 'Capítulo não encontrado' });
    }
    res.json(chapter.verses);
});

export default router;
