// src/hooks/useToast.ts
import { useState, useCallback, useRef, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface UseToastReturn {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
  position: ToastPosition;
  setPosition: (position: ToastPosition) => void;
}

export const useToast = (defaultPosition: ToastPosition = 'top-right'): UseToastReturn => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [position, setPosition] = useState<ToastPosition>(defaultPosition);
  const toastIdCounter = useRef(0);

  const showToast = useCallback((message: string, type: ToastType, duration = 5000) => {
    const id = `toast-${Date.now()}-${toastIdCounter.current++}`;
    const newToast: Toast = { id, message, type, duration };

    setToasts(prev => {
      // Limit to 5 toasts maximum
      const newToasts = [...prev, newToast];
      if (newToasts.length > 5) {
        return newToasts.slice(1);
      }
      return newToasts;
    });

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      setToasts([]);
    };
  }, []);

  return {
    toasts,
    showToast,
    hideToast,
    position,
    setPosition,
  };
};