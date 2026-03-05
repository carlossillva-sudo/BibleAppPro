import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';

import bibleRoutes from './routes/bible.routes';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';
import { WebSocketService } from './services/websocket.service';
import aiRoutes from './routes/ai.routes';
import googleRoutes from './routes/google.routes';
import swaggerRouter from './routes/swagger.routes';
import userRoutes from './routes/user.routes';

// Load env vars (skip in test to avoid CI env quirks)
if (process.env.NODE_ENV !== 'test') {
  dotenv.config({ path: path.resolve(process.cwd(), 'server', '.env') });
}

process.on('uncaughtException', (err) => {
  console.error('CRASH FATAL (Uncaught Exception):', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('PROMESSA REJEITADA (Unhandled Rejection):', reason);
});

// Inicializa o banco de dados/seed
AuthService.init();
ChatService.init();

export const app = express();
// also provide a default export for easier imports in tests
export default app;
const PORT = process.env.PORT || 3000;
let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'test') {
    // provide a default secret for tests to avoid process.exit during CI
    JWT_SECRET = 'test_jwt_secret';
    process.env.JWT_SECRET = JWT_SECRET;
    console.warn('JWT_SECRET ausente — usando segredo de teste.');
  } else {
    console.error('FATAL: JWT_SECRET não definido. Abortando.');
    process.exit(1);
  }
}

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bible', bibleRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/docs', swaggerRouter);
// User data backup/restore routes
app.use('/api/user', userRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'BibleAppPro API rodando 🚀' });
});

// Error handler last
import { errorHandler } from './middleware/error.middleware';
app.use(errorHandler);

// Arquivo XML da Bíblia
// note: rely on current working directory when server starts
const xmlPath = path.join(process.cwd(), 'PortugueseBible.xml');

if (process.env.NODE_ENV !== 'test') {
  try {
    const server = http.createServer(app);
    WebSocketService.init(server);
    server.listen(PORT, () => {
      console.log(`[server]: BibleAppPro rodando em http://localhost:${PORT}`);
      console.log(`[server]: WebSocket disponível em ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[server]: Erro ao iniciar servidor listen:', error);
  }
}
