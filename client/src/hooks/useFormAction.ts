import { useState, useCallback } from 'react';

interface FormActionState {
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

interface UseFormActionReturn extends FormActionState {
    execute: <T>(action: () => Promise<T>) => Promise<T | null>;
    reset: () => void;
}

/**
 * Hook reutilizável para gerenciar estado de loading, erro e sucesso em formulários.
 *
 * Uso:
 *   const { isLoading, error, success, execute, reset } = useFormAction();
 *
 *   const handleSave = () => execute(async () => {
 *     await apiService.save(data);
 *   });
 */
export function useFormAction(): UseFormActionReturn {
    const [state, setState] = useState<FormActionState>({
        isLoading: false,
        error: null,
        success: false,
    });

    const execute = useCallback(async <T>(action: () => Promise<T>): Promise<T | null> => {
        setState({ isLoading: true, error: null, success: false });
        try {
            const result = await action();
            setState({ isLoading: false, error: null, success: true });
            // Limpa o estado de sucesso após 3 segundos
            setTimeout(() => {
                setState(prev => ({ ...prev, success: false }));
            }, 3000);
            return result;
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Ocorreu um erro inesperado. Tente novamente.';
            setState({ isLoading: false, error: message, success: false });
            return null;
        }
    }, []);

    const reset = useCallback(() => {
        setState({ isLoading: false, error: null, success: false });
    }, []);

    return { ...state, execute, reset };
}
