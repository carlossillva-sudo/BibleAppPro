import React, { useEffect, useState, useRef } from 'react';
import type { ChatMessage, WebSocketMessage } from '../types';
import { ChatService } from '../services/chat.service';
import { AIService } from '../services/ai.service';
import { useWebSocket } from '../hooks/useWebSocket';
import { Button } from '../components/ui/Button';

export const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [text, setText] = useState('');
    const [aiPrompt, setAiPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState<'users' | 'assistant'>('users');
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const fetchMessages = async () => {
        try {
            const msgs = await ChatService.list();
            setMessages(msgs);
        } catch (err) {
            console.error('Erro ao carregar mensagens', err);
        }
    };

    // WebSocket handler for real-time messages
    const handleWebSocketMessage = (msg: WebSocketMessage) => {
        if (msg.type === 'message' && msg.data) {
            setMessages((prevMsgs) => {
                // avoid duplicates
                if (prevMsgs.some(m => m.id === msg.data.id)) {
                    return prevMsgs;
                }
                return [...prevMsgs, msg.data];
            });
        } else if (msg.type === 'typing') {
            console.log(`[Chat] ${msg.userId} está digitando...`);
        }
    };

    const { send: sendWS } = useWebSocket(handleWebSocketMessage);

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        // scroll to bottom when messages change
        if (bottomRef.current && typeof bottomRef.current.scrollIntoView === 'function') {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const msg = await ChatService.send(text.trim());
            setMessages((msgs) => [...msgs, msg]);
            setText('');
            // broadcast via WebSocket
            sendWS({ type: 'user_message', data: msg });
        } catch (err) {
            console.error('Erro ao enviar', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt.trim()) return;
        setLoading(true);
        try {
            await AIService.generate(aiPrompt.trim());
            // Message should already be persisted by backend, refresh from server
            await fetchMessages();
            setAiPrompt('');
        } catch (err) {
            console.error('Erro ao gerar com AI', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto flex flex-col h-full">
            <header className="mb-4">
                <h1 className="text-3xl font-bold">Chat</h1>
                <p className="text-sm text-muted-foreground">Converse com outros usuários (beta) ou pergunte ao assistente local.</p>
            </header>

            <div className="flex gap-2 mb-4">
                <button className={`px-4 py-2 rounded-lg ${tab === 'users' ? 'bg-card' : 'bg-muted'}`} onClick={() => setTab('users')}>Usuários</button>
                <button className={`px-4 py-2 rounded-lg ${tab === 'assistant' ? 'bg-card' : 'bg-muted'}`} onClick={() => setTab('assistant')}>Assistente</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {messages.map((m) => (
                    <div key={m.id} className={`p-2 rounded-xl ${m.userId === 'assistant' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-card'}`}>
                        <div className="text-xs text-muted-foreground">{m.userId === 'assistant' ? '🤖 Assistente' : m.userId} • {new Date(m.timestamp).toLocaleTimeString()}</div>
                        <div className="text-sm mt-1">{m.text}</div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {tab === 'users' ? (
                <div className="flex gap-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2 bg-background"
                        placeholder="Digite uma mensagem..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <Button onClick={handleSend} disabled={loading || !text.trim()}>
                        Enviar
                    </Button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <input
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2 bg-background"
                        placeholder="Pergunte ao assistente local..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAiGenerate();
                            }
                        }}
                    />
                    <Button onClick={handleAiGenerate} disabled={loading || !aiPrompt.trim()}>
                        Gerar
                    </Button>
                </div>
            )}
        </div>
    );
};
