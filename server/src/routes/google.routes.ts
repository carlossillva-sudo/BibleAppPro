import { Router } from 'express';
import { googleService, GoogleTokens } from '../services/google.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthService } from '../services/auth.service';

const router = Router();

interface AuthRequest extends Express.Request {
  userId?: string;
}

router.get('/auth-url', authMiddleware, (req, res) => {
  try {
    const authUrl = googleService.getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ message: 'Erro ao gerar URL de autenticação' });
  }
});

router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ message: 'Código não fornecido' });
    }

    const tokens = await googleService.getTokensFromCode(code as string);

    res.redirect(`http://localhost:5173/settings/google-auth?success=true`);
  } catch (error) {
    console.error('Error in callback:', error);
    res.redirect(`http://localhost:5173/settings/google-auth?error=true`);
  }
});

router.post('/save-tokens', authMiddleware, async (req, res) => {
  try {
    const { tokens } = req.body as { tokens: GoogleTokens };
    const userId = (req as any).userId;

    if (!tokens || !tokens.access_token) {
      return res.status(400).json({ message: 'Tokens inválidos' });
    }

    const userInfo = await googleService.getUserInfo(tokens);

    await AuthService.updateUser(userId, {
      googleTokens: tokens,
      googleEmail: userInfo.email,
    });

    res.json({
      message: 'Conta Google conectada com sucesso',
      email: userInfo.email,
      name: userInfo.name,
    });
  } catch (error) {
    console.error('Error saving tokens:', error);
    res.status(500).json({ message: 'Erro ao salvar tokens' });
  }
});

router.get('/status', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const user = await AuthService.findById(userId);

    if (!user || !user.googleTokens) {
      return res.json({ connected: false });
    }

    const userInfo = await googleService.getUserInfo(user.googleTokens as GoogleTokens);

    res.json({
      connected: true,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    });
  } catch (error) {
    console.error('Error getting Google status:', error);
    res.status(500).json({ message: 'Erro ao verificar status' });
  }
});

router.post('/disconnect', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;

    await AuthService.updateUser(userId, {
      googleTokens: null,
      googleEmail: null,
    });

    res.json({ message: 'Conta Google desconectada' });
  } catch (error) {
    console.error('Error disconnecting:', error);
    res.status(500).json({ message: 'Erro ao desconectar' });
  }
});

router.post('/backup/drive', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const user = await AuthService.findById(userId);

    if (!user || !user.googleTokens) {
      return res.status(401).json({ message: 'Conta Google não conectada' });
    }

    const { data, fileName } = req.body;

    if (!data) {
      return res.status(400).json({ message: 'Dados não fornecidos' });
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const name = fileName || `bibleapppro-backup-${timestamp}.json`;

    const result = await googleService.uploadToDrive(
      user.googleTokens as GoogleTokens,
      name,
      JSON.stringify(data, null, 2)
    );

    res.json({
      message: 'Backup realizado com sucesso',
      fileId: result.fileId,
      webViewLink: result.webViewLink,
    });
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    res.status(500).json({ message: 'Erro ao fazer backup' });
  }
});

router.get('/backup/list', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const user = await AuthService.findById(userId);

    if (!user || !user.googleTokens) {
      return res.status(401).json({ message: 'Conta Google não conectada' });
    }

    const files = await googleService.listBackupFiles(user.googleTokens as GoogleTokens);

    res.json({ files });
  } catch (error) {
    console.error('Error listing backups:', error);
    res.status(500).json({ message: 'Erro ao listar backups' });
  }
});

router.post('/backup/restore', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const user = await AuthService.findById(userId);
    const { fileId } = req.body;

    if (!user || !user.googleTokens) {
      return res.status(401).json({ message: 'Conta Google não conectada' });
    }

    if (!fileId) {
      return res.status(400).json({ message: 'ID do arquivo não fornecido' });
    }

    const content = await googleService.downloadFromDrive(
      user.googleTokens as GoogleTokens,
      fileId
    );

    res.json({ data: JSON.parse(content) });
  } catch (error) {
    console.error('Error restoring backup:', error);
    res.status(500).json({ message: 'Erro ao restaurar backup' });
  }
});

router.post('/calendar/event', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const user = await AuthService.findById(userId);

    if (!user || !user.googleTokens) {
      return res.status(401).json({ message: 'Conta Google não conectada' });
    }

    const { title, description, startTime, endTime, location } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({ message: 'Dados do evento incompletos' });
    }

    const result = await googleService.createCalendarEvent(user.googleTokens as GoogleTokens, {
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      location,
    });

    res.json({
      message: 'Evento criado com sucesso',
      eventId: result.eventId,
      htmlLink: result.htmlLink,
    });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ message: 'Erro ao criar evento' });
  }
});

router.get('/calendar/events', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const user = await AuthService.findById(userId);

    if (!user || !user.googleTokens) {
      return res.status(401).json({ message: 'Conta Google não conectada' });
    }

    const maxResults = parseInt(req.query.maxResults as string) || 10;
    const events = await googleService.listCalendarEvents(
      user.googleTokens as GoogleTokens,
      maxResults
    );

    res.json({ events });
  } catch (error) {
    console.error('Error listing calendar events:', error);
    res.status(500).json({ message: 'Erro ao listar eventos' });
  }
});

router.delete('/calendar/event/:eventId', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const user = await AuthService.findById(userId);
    const { eventId } = req.params;

    if (!user || !user.googleTokens) {
      return res.status(401).json({ message: 'Conta Google não conectada' });
    }

    await googleService.deleteCalendarEvent(user.googleTokens as GoogleTokens, eventId);

    res.json({ message: 'Evento excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({ message: 'Erro ao excluir evento' });
  }
});

export default router;
