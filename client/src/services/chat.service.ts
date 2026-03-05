import api from './api';

export interface ChatMessage {
    id: string;
    userId: string;
    text: string;
    timestamp: string;
}

export const ChatService = {
    list: async (): Promise<ChatMessage[]> => {
        const res = await api.get<ChatMessage[]>('/chat/messages');
        return res.data;
    },
    send: async (text: string): Promise<ChatMessage> => {
        const res = await api.post<ChatMessage>('/chat/messages', { text });
        return res.data;
    }
};
