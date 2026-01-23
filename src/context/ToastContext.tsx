// src/context/ToastContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import type { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (
    message: string, 
    type: ToastType, 
    options?: {
      title?: string;
      duration?: number;
      action?: { label: string; onClick: () => void };
      onClose?: () => void;
    }
  ) => string;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  position: ToastPosition;
  setPosition: (position: ToastPosition) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast container component
interface ToastContainerProps {
  position: ToastPosition;
  toasts: Toast[];
  onHide: (id: string) => void;
}

export const ToastContainerComponent: React.FC<ToastContainerProps> = ({ 
  position, 
  toasts, 
  onHide 
}) => {
  const positionClasses: Record<ToastPosition, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const toastConfig: Record<ToastType, {
    icon: React.ReactNode;
    bgColor: string;
    borderColor: string;
    textColor: string;
    iconColor: string;
    titleColor: string;
  }> = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
      titleColor: 'text-green-900',
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
      titleColor: 'text-red-900',
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-900',
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-900',
    },
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]} space-y-3`}>
      {toasts.map((toast) => {
        const config = toastConfig[toast.type];

        return (
          <div
            key={toast.id}
            className={`
              w-full max-w-sm p-4 rounded-lg shadow-lg border transform
              transition-all duration-300 ease-out animate-slide-in
              ${config.bgColor} ${config.borderColor}
            `}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="flex items-start">
              <div className={`shrink-0 ${config.iconColor}`}>
                {config.icon}
              </div>
              
              <div className="ml-3 flex-1">
                {toast.title && (
                  <h3 className={`text-sm font-semibold mb-1 ${config.titleColor}`}>
                    {toast.title}
                  </h3>
                )}
                <div className={`text-sm ${config.textColor}`}>
                  {toast.message}
                </div>
                
                {toast.action && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={toast.action.onClick}
                      className={`
                        text-sm font-medium rounded-md px-3 py-1.5
                        ${toast.type === 'success' ? 'bg-green-100 hover:bg-green-200 text-green-800' : ''}
                        ${toast.type === 'error' ? 'bg-red-100 hover:bg-red-200 text-red-800' : ''}
                        ${toast.type === 'warning' ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' : ''}
                        ${toast.type === 'info' ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' : ''}
                        transition-colors
                      `}
                    >
                      {toast.action.label}
                    </button>
                  </div>
                )}
              </div>
              
              <button
                type="button"
                className={`
                  ml-4 shrink-0 rounded-md p-1
                  ${config.iconColor} hover:opacity-75
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${toast.type === 'success' ? 'focus:ring-green-500' : ''}
                  ${toast.type === 'error' ? 'focus:ring-red-500' : ''}
                  ${toast.type === 'warning' ? 'focus:ring-yellow-500' : ''}
                  ${toast.type === 'info' ? 'focus:ring-blue-500' : ''}
                `}
                onClick={() => {
                  onHide(toast.id);
                  toast.onClose?.();
                }}
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {toast.duration && toast.duration > 0 && (
              <div className="mt-2">
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`
                      h-full ${toast.type === 'success' ? 'bg-green-400' : ''}
                      ${toast.type === 'error' ? 'bg-red-400' : ''}
                      ${toast.type === 'warning' ? 'bg-yellow-400' : ''}
                      ${toast.type === 'info' ? 'bg-blue-400' : ''}
                    `}
                    style={{
                      animation: `shrink ${toast.duration}ms linear forwards`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
      
    </div>
  );
};

// Toast provider component
interface ToastProviderProps {
  children: ReactNode;
  defaultPosition?: ToastPosition;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  defaultPosition = 'top-right',
  maxToasts = 5
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [position, setPosition] = useState<ToastPosition>(defaultPosition);

  const showToast = useCallback((
    message: string, 
    type: ToastType, 
    options?: {
      title?: string;
      duration?: number;
      action?: { label: string; onClick: () => void };
      onClose?: () => void;
    }
  ): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      message,
      type,
      title: options?.title,
      duration: options?.duration ?? 5000,
      action: options?.action,
      onClose: options?.onClose,
    };

    setToasts(prev => {
      const newToasts = [...prev, newToast];
      // Limit number of toasts
      if (newToasts.length > maxToasts) {
        return newToasts.slice(1);
      }
      return newToasts;
    });

    // Auto-dismiss after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    }

    return id;
  }, [maxToasts]);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => {
      const toastToRemove = prev.find(t => t.id === id);
      if (toastToRemove) {
        toastToRemove.onClose?.();
      }
      return prev.filter(toast => toast.id !== id);
    });
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts(prev => {
      // Call onClose for all toasts
      prev.forEach(toast => toast.onClose?.());
      return [];
    });
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<Toast>) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  }, []);

  const value: ToastContextType = {
    toasts,
    showToast,
    hideToast,
    hideAllToasts,
    updateToast,
    position,
    setPosition,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainerComponent
        position={position}
        toasts={toasts}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
};

// Hook for using toast context
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Convenience hook with predefined toast types
export const useToaster = () => {
  const { showToast, hideToast, hideAllToasts, updateToast } = useToast();

  const success = useCallback((
    message: string, 
    options?: {
      title?: string;
      duration?: number;
      action?: { label: string; onClick: () => void };
      onClose?: () => void;
    }
  ) => {
    return showToast(message, 'success', options);
  }, [showToast]);

  const error = useCallback((
    message: string, 
    options?: {
      title?: string;
      duration?: number;
      action?: { label: string; onClick: () => void };
      onClose?: () => void;
    }
  ) => {
    return showToast(message, 'error', options);
  }, [showToast]);

  const warning = useCallback((
    message: string, 
    options?: {
      title?: string;
      duration?: number;
      action?: { label: string; onClick: () => void };
      onClose?: () => void;
    }
  ) => {
    return showToast(message, 'warning', options);
  }, [showToast]);

  const info = useCallback((
    message: string, 
    options?: {
      title?: string;
      duration?: number;
      action?: { label: string; onClick: () => void };
      onClose?: () => void;
    }
  ) => {
    return showToast(message, 'info', options);
  }, [showToast]);

  const promise = useCallback(
    async <T,>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error: string;
      },
      options?: {
        successTitle?: string;
        errorTitle?: string;
        onSuccess?: (data: T) => void;
        onError?: (error: any) => void;
      }
    ): Promise<T> => {
      const loadingId = showToast(messages.loading, 'info', { 
        duration: undefined, // No auto-dismiss for loading
      });

      try {
        const data = await promise;
        hideToast(loadingId);
        
        showToast(messages.success, 'success', {
          title: options?.successTitle,
          onClose: () => options?.onSuccess?.(data),
        });
        
        return data;
      } catch (err) {
        hideToast(loadingId);
        
        showToast(messages.error, 'error', {
          title: options?.errorTitle,
          onClose: () => options?.onError?.(err),
        });
        
        throw err;
      }
    },
    [showToast, hideToast]
  );

  return {
    success,
    error,
    warning,
    info,
    promise,
    hideToast,
    hideAllToasts,
    updateToast,
  };
};

// Toast container wrapper (for use in Layout)
export const ToastContainer = () => {
  const { toasts, hideToast, position } = useToast();
  return <ToastContainerComponent position={position} toasts={toasts} onHide={hideToast} />;
};

export default ToastProvider;