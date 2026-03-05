import WebSocket, { WebSocketServer } from 'ws';
import { ChatMessage } from '../types/chat';

/**
 * WebSocket server for real-time chat.
 * Allows clients to receive messages as they are posted.
 */
export class WebSocketService {
  private static clients: Set<WebSocket> = new Set();

  static init(server: any) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket) => {
      console.log('[WebSocket] Nova conexão');
      WebSocketService.clients.add(ws);

      ws.on('close', () => {
        console.log('[WebSocket] Conexão fechada');
        WebSocketService.clients.delete(ws);
      });

      ws.on('error', (err: any) => {
        console.error('[WebSocket] Erro:', err);
      });

      // Send welcome message
      ws.send(JSON.stringify({ type: 'welcome', message: 'Conectado ao chat' }));
    });

    console.log('[WebSocket] Servidor iniciado na porta 3000 (compartilhada com HTTP)');
  }

  /**
   * Broadcast a new message to all connected clients
   */
  static broadcast(message: ChatMessage) {
    const payload = JSON.stringify({ type: 'message', data: message });
    WebSocketService.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  /**
   * Broadcast a typing indicator
   */
  static broadcastTyping(userId: string) {
    const payload = JSON.stringify({ type: 'typing', userId });
    WebSocketService.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }
}
