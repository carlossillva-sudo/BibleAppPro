import { Router } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1)
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

router.post('/register', validateBody(registerSchema), async (req, res) => {
    try {
        const user = await AuthService.register(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', validateBody(loginSchema), async (req, res) => {
    try {
        const result = await AuthService.login(req.body);
        res.json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
});

export default router;
