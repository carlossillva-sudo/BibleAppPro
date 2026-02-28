import { Router } from 'express';
import { z } from 'zod';
import { ChatService } from '../services/chat.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();

const messageSchema = z.object({
    text: z.string().min(1)
});

// return all messages (public)
router.get('/messages', authMiddleware, (req, res) => {
    const msgs = ChatService.list();
    res.json(msgs);
});

// post a new message
router.post(
    '/messages',
    authMiddleware,
    validateBody(messageSchema),
    (req, res) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) return res.status(400).json({ message: 'Usuário não identificado.' });
            const { text } = req.body;
            const msg = ChatService.add(userId, text);
            res.status(201).json(msg);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
);

export default router;
