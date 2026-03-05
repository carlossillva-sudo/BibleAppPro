import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

let globalToasts: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

function notifyListeners() {
  listeners.forEach((fn) => fn([...globalToasts]));
}

export function toast(message: string, type: Toast['type'] = 'info', duration = 3000) {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast: Toast = { id, message, type, duration };

  globalToasts.push(newToast);
  notifyListeners();

  if (duration > 0) {
    setTimeout(() => {
      globalToasts = globalToasts.filter((t) => t.id !== id);
      notifyListeners();
    }, duration);
  }

  return id;
}

export function dismissToast(id: string) {
  globalToasts = globalToasts.filter((t) => t.id !== id);
  notifyListeners();
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'info', duration = 3000) => {
      const id = toast(message, type, duration);
      setToasts([...globalToasts]);
      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    dismissToast(id);
    setToasts([...globalToasts]);
  }, []);

  return { toast: showToast, dismiss, toasts };
}

export function useActionFeedback() {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async <T>(
      actionId: string,
      action: () => Promise<T>,
      onSuccess?: (result: T) => void,
      onError?: (error: Error) => void
    ): Promise<T | null> => {
      setLoading(actionId);
      setSuccess(null);
      setError(null);

      try {
        const result = await action();
        setSuccess(actionId);
        onSuccess?.(result);
        toast('Operação realizada com sucesso!', 'success');
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        onError?.(err as Error);
        toast(errorMessage, 'error');
        return null;
      } finally {
        setLoading(null);
        setTimeout(() => {
          setSuccess(null);
          setError(null);
        }, 2000);
      }
    },
    []
  );

  return {
    loading,
    success,
    error,
    execute,
    isLoading: (id: string) => loading === id,
    wasSuccessful: (_id: string) => success !== null,
    hadError: (_id: string) => error !== null,
  };
}

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast('Copiado para a área de transferência!', 'success');
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      toast('Erro ao copiar', 'error');
      return false;
    }
  }, []);

  return { copied, copy };
}
