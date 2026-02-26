import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import bibleRoutes from './routes/bible.routes.js';
import authRoutes from './routes/auth.routes.js';
import { AuthService } from './services/auth.service.js';

dotenv.config();

process.on('uncaughtException', (err) => {
    console.error('CRASH FATAL (Uncaught Exception):', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('PROMESSA REJEITADA (Unhandled Rejection):', reason);
});

// Inicializa o banco de dados/seed
AuthService.init();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bible', bibleRoutes);

app.get('/api', (req, res) => {
    res.json({ message: 'BibleAppPro API rodando 🚀' });
});

// Arquivo XML da Bíblia
const xmlPath = path.join(__dirname, '..', '..', 'PortugueseBible.xml');

try {
    app.listen(PORT, () => {
        console.log(`[server]: BibleAppPro rodando em http://localhost:${PORT}`);
    });
} catch (error) {
    console.error('[server]: Erro ao iniciar servidor listen:', error);
}
