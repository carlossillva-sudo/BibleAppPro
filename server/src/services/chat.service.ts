import fs from 'fs';
import path from 'path';
import { ChatMessage } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketService } from './websocket.service';

// store messages under server/data to keep data separate from root
const CHAT_FILE = path.join(process.cwd(), 'server', 'data', 'messages.json');

export class ChatService {
    static init() {
        const dataDir = path.dirname(CHAT_FILE);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        if (!fs.existsSync(CHAT_FILE)) {
            this.saveMessages([]);
        }
    }

    private static getMessages(): ChatMessage[] {
        if (!fs.existsSync(CHAT_FILE)) return [];
        const data = fs.readFileSync(CHAT_FILE, 'utf8');
        try {
            return JSON.parse(data || '[]');
        } catch (err) {
            return [];
        }
    }

    private static saveMessages(msgs: ChatMessage[]) {
        fs.writeFileSync(CHAT_FILE, JSON.stringify(msgs, null, 2));
    }

    static list(): ChatMessage[] {
        const msgs = this.getMessages();
        // sort by timestamp ascending
        return msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    static add(userId: string, text: string): ChatMessage {
        const msgs = this.getMessages();
        const message: ChatMessage = {
            id: uuidv4(),
            userId,
            text,
            timestamp: new Date().toISOString()
        };
        msgs.push(message);
        this.saveMessages(msgs);
        // broadcast to WebSocket clients
        WebSocketService.broadcast(message);
        return message;
    }

    /**
     * Add an assistant message (AI response)
     */
    static addAssistant(text: string): ChatMessage {
        return this.add('assistant', text);
    }
}
