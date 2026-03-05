import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import UserService from '../services/user.service';
import path from 'path';
import { promises as fs } from 'fs';

const router = Router();

// Export user data (requires authentication)
router.get('/export', authMiddleware, async (req, res) => {
  const user = (req as any).user;
  const userId = user?.id || user?.email || user?.username;
  if (!userId) {
    return res.status(400).json({ ok: false, error: 'Usuário não identificado' });
  }
  try {
    const data = await UserService.exportUser(userId);
    // Create a backup for export and return info
    const backupInfo = await UserService.createBackup(userId, data);
    res.json({ ok: true, data, backup: backupInfo });
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ ok: false, error: 'Erro ao exportar dados' });
  }
});

// History of backups for a user
router.get('/backups', authMiddleware, async (req, res) => {
  const user = (req as any).user;
  const userId = user?.id || user?.email || user?.username;
  if (!userId) {
    return res.status(400).json({ ok: false, error: 'Usuário não identificado' });
  }
  try {
    const backups = await UserService.getBackupsHistory(userId);
    res.json({ ok: true, backups });
  } catch (err) {
    console.error('Backups history error:', err);
    res.status(500).json({ ok: false, error: 'Erro ao buscar histórico de backups' });
  }
});

// Restore a backup by filename (merge data with current user)
router.post('/backups/restore', authMiddleware, async (req, res) => {
  const user = (req as any).user;
  const userId = user?.id || user?.email || user?.username;
  const { filename } = req.body as { filename?: string };
  if (!userId) {
    return res.status(400).json({ ok: false, error: 'Usuário não identificado' });
  }
  if (!filename) {
    return res.status(400).json({ ok: false, error: 'Arquivo de backup não informado' });
  }
  try {
    const backupsDir = path.resolve(process.cwd(), 'server', 'data', 'backups');
    const filePath = path.join(backupsDir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    const payload = JSON.parse(content);
    await UserService.importUser(userId, payload);
    res.json({ ok: true, message: 'Backup restaurado com sucesso' });
  } catch (err) {
    console.error('Restore error:', err);
    res.status(500).json({ ok: false, error: 'Erro ao restaurar backup' });
  }
});

// Download a specific backup file (securely scoped to user)
router.get('/backups/download/:filename', authMiddleware, async (req, res) => {
  const user = (req as any).user;
  const userId = user?.id || user?.email || user?.username;
  const filename = req.params.filename;
  if (!userId) {
    return res.status(400).json({ ok: false, error: 'Usuário não identificado' });
  }
  if (!filename) {
    return res.status(400).json({ ok: false, error: 'Arquivo não especificado' });
  }
  // Simple security check: filename must start with current user's backup prefix
  const expectedPrefix = `backup_${userId}_`;
  if (!filename.startsWith(expectedPrefix)) {
    return res.status(403).json({ ok: false, error: 'Acesso negado' });
  }
  const filePath = path.resolve(process.cwd(), 'server', 'data', 'backups', filename);
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(404).json({ ok: false, error: 'Arquivo não encontrado' });
    }
  });
});

// Import/restore user data (requires authentication)
// Import/restore user data (requires authentication) with basic schema validation
router.post('/import', authMiddleware, async (req, res) => {
  const user = (req as any).user;
  const userId = user?.id || user?.email || user?.username;
  const payloadRaw = req.body;
  // Basic validation: payload should be an object
  if (!payloadRaw || typeof payloadRaw !== 'object') {
    return res.status(400).json({ ok: false, error: 'Dados inválidos' });
  }
  // Strong schema (can be extended in future). Accept any object.
  const payload = payloadRaw as any;
  if (!userId) {
    return res.status(400).json({ ok: false, error: 'Usuário não identificado' });
  }
  // if payload is empty object, still allow as empty merge
  try {
    await UserService.importUser(userId, payload);
    res.json({ ok: true, message: 'Dados importados com sucesso' });
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ ok: false, error: 'Erro ao importar dados' });
  }
});

export default router;
