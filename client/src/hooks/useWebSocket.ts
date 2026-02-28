import { useEffect, useRef, useCallback } from 'react';

export interface WebSocketMessage {
    type: 'welcome' | 'message' | 'typing' | 'error';
    data?: any;
    message?: string;
    userId?: string;
}

export const useWebSocket = (onMessage: (msg: WebSocketMessage) => void) => {
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Connect to WebSocket server
        const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
        console.log('[WebSocket] Conectando em', wsUrl);

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log('[WebSocket] Conectado');
        };

        ws.current.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                onMessage(msg);
            } catch (err) {
                console.error('[WebSocket] Erro ao parsear mensagem:', err);
            }
        };

        ws.current.onerror = (error) => {
            console.error('[WebSocket] Erro:', error);
            onMessage({ type: 'error', message: 'WebSocket error' });
        };

        ws.current.onclose = () => {
            console.log('[WebSocket] Desconectado');
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [onMessage]);

    const send = useCallback((data: any) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data));
        }
    }, []);

    return { send };
};
