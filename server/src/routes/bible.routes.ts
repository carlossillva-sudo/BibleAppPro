import { Router } from 'express';
import { z } from 'zod';
import { bibleService } from '../services/bible.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();

// Public endpoints - no auth required
router.get('/versoes', async (req, res) => {
  res.json(await bibleService.getVersions());
});

router.get('/livros', async (req, res) => {
  const { v } = req.query;
  const books = await bibleService.getBooks(v as string);
  res.json(books);
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

// Search - public, accepts query params
const searchSchema = z.object({
  q: z.string().min(1),
  v: z.string().optional(),
  livros: z.string().optional(),
});

router.get('/busca', async (req, res) => {
  try {
    const { q, v, livros } = req.query as any;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    const results = await bibleService.searchContent(q, v as string, livros as string | undefined);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Erro na busca' });
  }
});

// Protected routes below
router.use(authMiddleware);

router.get('/status', (req, res) => {
  res.json(bibleService.getStatus());
});

export default router;
