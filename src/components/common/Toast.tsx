// src/components/common/Toast.tsx
import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import type { ToastPosition } from '../../hooks/useToast';
import { useToast } from '../../hooks/useToast';

const Toast = () => {
  const { toasts, hideToast, position } = useToast();
  const [exiting, setExiting] = useState<Set<string>>(new Set());

  const handleClose = (id: string) => {
    setExiting(prev => new Set(prev).add(id));
    setTimeout(() => {
      hideToast(id);
      setExiting(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  };

  const positionClasses: Record<ToastPosition, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const toastConfig = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
    },
  };

  if (toasts.length === 0) return null;

  return (
    <div className={`fixed z-50 ${positionClasses[position]} space-y-3`}>
      {toasts.map((toast) => {
        const config = toastConfig[toast.type];
        const isExiting = exiting.has(toast.id);

        return (
          <div
            key={toast.id}
            className={`
              flex items-start w-full max-w-sm p-4 rounded-lg shadow-lg
              ${config.bgColor} ${config.borderColor} border
              transform transition-all duration-300
              ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            `}
            role="alert"
          >
            <div className={`shrink-0 ${config.iconColor}`}>
              {config.icon}
            </div>
            
            <div className={`ml-3 text-sm font-medium ${config.textColor} flex-1`}>
              {toast.message}
            </div>
            
            <button
              type="button"
              className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 ${config.iconColor} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2`}
              onClick={() => handleClose(toast.id)}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const ToastContainer = () => {
  return <Toast />;
};

export default Toast;