import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

type Variant = 'info' | 'success' | 'error';
type Toast = { id: string; message: string; variant: Variant };

type ToastContextType = {
  showToast: (message: string, variant?: Variant) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const Icon = ({ variant }: { variant: Variant }) => {
  if (variant === 'success') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M20 6L9 17l-5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (variant === 'error') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M18 6L6 18M6 6l12 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 9v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Durations per variant (ms)
  const DURATION: Record<Variant, number> = {
    info: 3500,
    success: 4500,
    error: 5500,
  };

  const showToast = (message: string, variant: Variant = 'info') => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = { id, message, variant };
    setToasts((t) => [...t, toast]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, DURATION[variant]);
  };

  const dismiss = (id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const el = document.querySelector('[data-toast-container]') as HTMLElement | null;
      if (el) el.focus();
    }
  }, [toasts.length]);

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        data-toast-container
        tabIndex={-1}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              `flex items-center gap-2 px-4 py-2 rounded-md shadow-md text-white` +
              (t.variant === 'success'
                ? ' bg-green-600'
                : t.variant === 'error'
                  ? ' bg-red-600'
                  : ' bg-blue-600')
            }
            role="status"
            aria-live="polite"
            style={{ minWidth: 260, alignItems: 'center' }}
          >
            <Icon variant={t.variant} />
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              aria-label="Dismiss toast"
              onClick={() => dismiss(t.id)}
              className="ml-2 text-white/90"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ((message: string, variant?: Variant) => void) => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.showToast;
};

export default ToastProvider;
