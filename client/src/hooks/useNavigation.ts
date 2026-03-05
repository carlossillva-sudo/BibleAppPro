import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseKeyboardNavigationOptions {
  enabled?: boolean;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
  onNextVerse?: () => void;
  onPrevVerse?: () => void;
}

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { enabled = true, onNextChapter, onPrevChapter, onNextVerse, onPrevVerse } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
          if (event.altKey) {
            event.preventDefault();
            onNextChapter?.();
          }
          break;
        case 'ArrowLeft':
          if (event.altKey) {
            event.preventDefault();
            onPrevChapter?.();
          }
          break;
        case 'j':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onNextVerse?.();
          }
          break;
        case 'k':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onPrevVerse?.();
          }
          break;
        case 'Escape':
          navigate(-1);
          break;
        case 'Home':
          if (location.pathname.startsWith('/reader')) {
            event.preventDefault();
            const match = location.pathname.match(/\/reader\/(\d+)\/(\d+)/);
            if (match) {
              navigate(`/reader/${match[1]}/1`);
            }
          }
          break;
        case 'End':
          if (location.pathname.startsWith('/reader')) {
            event.preventDefault();
          }
          break;
      }
    },
    [enabled, navigate, location, onNextChapter, onPrevChapter, onNextVerse, onPrevVerse]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function usePageTransition() {
  const navigate = useNavigate();

  const goTo = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goForward = useCallback(() => {
    navigate(1);
  }, [navigate]);

  return { goTo, goBack, goForward };
}

export function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
}
