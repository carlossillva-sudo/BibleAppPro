import { describe, it, beforeEach, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatPage } from '../pages/ChatPage';

// Mock modules
vi.mock('../services/chat.service', () => ({
    ChatService: {
        list: vi.fn(),
        send: vi.fn(),
    },
}));

vi.mock('../services/ai.service', () => ({
    AIService: {
        generate: vi.fn(),
    },
}));

vi.mock('../hooks/useWebSocket', () => ({
    useWebSocket: vi.fn(),
}));

// Import mocked modules
import { ChatService } from '../services/chat.service';
import { AIService } from '../services/ai.service';
import { useWebSocket } from '../hooks/useWebSocket';

const mockMessages = [
    {
        id: '1',
        userId: 'user1',
        text: 'Olá!',
        timestamp: new Date().toISOString(),
    },
    {
        id: '2',
        userId: 'assistant',
        text: 'Oi, como posso ajudar?',
        timestamp: new Date().toISOString(),
    },
];

describe('ChatPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock ChatService methods
        (ChatService.list as Mock).mockResolvedValue(mockMessages);
        (ChatService.send as Mock).mockResolvedValue({
            id: '3',
            userId: 'user1',
            text: 'Nova mensagem',
            timestamp: new Date().toISOString(),
        });

        // Mock AIService
        (AIService.generate as Mock).mockResolvedValue({
            text: 'Resposta da IA',
        });

        // Mock useWebSocket hook
        (useWebSocket as Mock).mockReturnValue({
            send: vi.fn(),
        });
    });

    it('should render ChatPage with title', async () => {
        await act(async () => {
            render(<ChatPage />);
        });
        expect(screen.getByText('Chat')).toBeTruthy();
        expect(screen.getByText(/Converse com outros usuários/)).toBeTruthy();
    });

    it('should load and display messages on mount', async () => {
        await act(async () => {
            render(<ChatPage />);
        });
        await waitFor(() => {
            expect(screen.getByText('Olá!')).toBeTruthy();
            expect(screen.getByText('Oi, como posso ajudar?')).toBeTruthy();
        });
    });

    it('should have two tabs: Usuários and Assistente', async () => {
        await act(async () => {
            render(<ChatPage />);
        });
        expect(screen.getByText('Usuários')).toBeTruthy();
        expect(screen.getByText('Assistente')).toBeTruthy();
    });

    it('should switch to users tab by default', async () => {
        await act(async () => {
            render(<ChatPage />);
        });
        const userInput = screen.getByPlaceholderText('Digite uma mensagem...');
        expect(userInput).toBeTruthy();
    });

    it('should switch to assistant tab when clicked', async () => {
        render(<ChatPage />);
        const assistantBtn = screen.getByText('Assistente');
        fireEvent.click(assistantBtn);
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Pergunte ao assistente local...')).toBeTruthy();
        });
    });

    it('should send user message and broadcast via WebSocket', async () => {
        const user = userEvent.setup();
        render(<ChatPage />);

        const input = screen.getByPlaceholderText('Digite uma mensagem...');
        const sendBtn = screen.getByText('Enviar');

        await user.type(input, 'Test message');
        await user.click(sendBtn);

        await waitFor(() => {
            expect(ChatService.send).toHaveBeenCalledWith('Test message');
        });
    });

    it('should generate AI response on assistant tab', async () => {
        const user = userEvent.setup();
        render(<ChatPage />);

        const assistantBtn = screen.getByText('Assistente');
        fireEvent.click(assistantBtn);

        await waitFor(() => {
            const input = screen.getByPlaceholderText('Pergunte ao assistente local...');
            expect(input).toBeTruthy();
        });

        const input = screen.getByPlaceholderText('Pergunte ao assistente local...');
        const generateBtn = screen.getByText('Gerar');

        await user.type(input, 'What is the Bible?');
        await user.click(generateBtn);

        await waitFor(() => {
            expect(AIService.generate).toHaveBeenCalledWith('What is the Bible?');
        });
    });

    it('should disable send button when input is empty', () => {
        render(<ChatPage />);
        const sendBtn = screen.getByText('Enviar');
        expect(sendBtn.hasAttribute('disabled')).toBe(true);
    });

    it('should clear input after sending message', async () => {
        const user = userEvent.setup();
        render(<ChatPage />);

        const input = screen.getByPlaceholderText('Digite uma mensagem...') as HTMLInputElement;
        const sendBtn = screen.getByText('Enviar');

        await user.type(input, 'Test message');
        await user.click(sendBtn);

        await waitFor(() => {
            expect(input.value).toBe('');
        });
    });

    it('should handle WebSocket messages', async () => {
        let messageHandler: ((msg: any) => void) | null = null;

        (useWebSocket as Mock).mockImplementation((handler) => {
            messageHandler = handler;
            return { send: vi.fn() };
        });

        render(<ChatPage />);

        // wait for initial messages to load so our websocket update isn't overwritten
        await waitFor(() => {
            expect(screen.getByText('Olá!')).toBeTruthy();
        });

        if (messageHandler) {
            const newMessage = {
                type: 'message',
                data: {
                    id: '3',
                    userId: 'user2',
                    text: 'Real-time message',
                    timestamp: new Date().toISOString(),
                },
            };
            // ensure React processes the state update
            await act(async () => {
                messageHandler!(newMessage);
            });

            await waitFor(() => {
                expect(screen.getByText('Real-time message')).toBeTruthy();
            });
        }
    });

    it('should display assistant messages with 🤖 emoji', async () => {
        render(<ChatPage />);
        await waitFor(() => {
            expect(screen.getByText(/🤖 Assistente/)).toBeTruthy();
        });
    });

    it('should handle Enter key to send user message', async () => {
        const user = userEvent.setup();
        render(<ChatPage />);

        const input = screen.getByPlaceholderText('Digite uma mensagem...');
        await user.type(input, 'Test message{Enter}');

        await waitFor(() => {
            expect(ChatService.send).toHaveBeenCalledWith('Test message');
        });
    });

    it('should handle Enter key to generate AI response', async () => {
        const user = userEvent.setup();
        render(<ChatPage />);

        const assistantBtn = screen.getByText('Assistente');
        fireEvent.click(assistantBtn);

        await waitFor(() => {
            const input = screen.getByPlaceholderText('Pergunte ao assistente local...');
            expect(input).toBeTruthy();
        });

        const input = screen.getByPlaceholderText('Pergunte ao assistente local...');
        await user.type(input, 'Question{Enter}');

        await waitFor(() => {
            expect(AIService.generate).toHaveBeenCalledWith('Question');
        });
    });

    it('should avoid duplicate messages from WebSocket', async () => {
        let messageHandler: ((msg: any) => void) | null = null;

        (useWebSocket as Mock).mockImplementation((handler) => {
            messageHandler = handler;
            return { send: vi.fn() };
        });

        render(<ChatPage />);

        await waitFor(() => {
            expect(screen.getByText('Olá!')).toBeTruthy();
        });

        if (messageHandler) {
            // Try to add same message twice
            const duplicateMessage = {
                type: 'message' as const,
                data: mockMessages[0],
            };
            (messageHandler as any)(duplicateMessage);
            (messageHandler as any)(duplicateMessage);

            // Count occurrences - should be only 1
            const elements = screen.queryAllByText('Olá!');
            expect(elements.length).toBe(1);
        }
    });
});
