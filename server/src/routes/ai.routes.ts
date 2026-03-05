import { Router } from 'express';
import { z } from 'zod';
import { LlamaService } from '../services/llama.service';
import { ChatService } from '../services/chat.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

const genSchema = z.object({
    prompt: z.string().min(1),
    options: z.any().optional()
});

router.post('/generate', authMiddleware, async (req, res) => {
    try {
        const parsed = genSchema.parse(req.body);
        const text = await LlamaService.generate(parsed.prompt, parsed.options);
        // Persist the assistant response into chat
        ChatService.addAssistant(text);
        res.json({ text });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
