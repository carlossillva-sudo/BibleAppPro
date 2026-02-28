import { Router } from 'express';
import { z } from 'zod';
import { bibleService } from '../services/bible.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();

// proteger rotas abaixo desta linha
router.use(authMiddleware);

const searchSchema = z.object({
    q: z.string().min(1),
    v: z.string().optional()
});

router.get('/versoes', async (req, res) => {
    res.json(await bibleService.getVersions());
});

router.get('/livros', async (req, res) => {
    const { v } = req.query;
    const books = await bibleService.getBooks(v as string);
    res.json(books.map(b => ({
        number: b.number,
        name: b.name,
        chaptersCount: b.chapters.length
    })));
});

router.get('/status', (req, res) => {
    res.json(bibleService.getStatus());
});

router.get('/busca', validateBody(searchSchema), async (req, res) => {
    const { q, v } = req.query as any;
    const results = await bibleService.searchContent(q, v as string);
    res.json(results);
});

router.get('/livros/:livroId/capitulos/:capId/versiculos', async (req, res) => {
    const { livroId, capId } = req.params;
    const { v } = req.query;
    const chapter = await bibleService.getChapter(livroId, capId, v as string);
    if (!chapter) {
        return res.status(404).json({ message: 'Capítulo não encontrado' });
    }
    res.json(chapter.verses);
});

export default router;
