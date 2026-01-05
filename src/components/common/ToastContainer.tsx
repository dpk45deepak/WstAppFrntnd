// src/components/common/ToastContainer.tsx
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import type { Toast as ToastType, ToastPosition } from '../../context/ToastContext';

interface ToastProps {
  toast: ToastType;
  onHide: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onHide }) => {
  const toastConfig = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
      titleColor: 'text-green-900',
      actionBg: 'bg-green-100 hover:bg-green-200 text-green-800',
      ringColor: 'focus:ring-green-500',
      progressColor: 'bg-green-400',
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
      titleColor: 'text-red-900',
      actionBg: 'bg-red-100 hover:bg-red-200 text-red-800',
      ringColor: 'focus:ring-red-500',
      progressColor: 'bg-red-400',
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-900',
      actionBg: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800',
      ringColor: 'focus:ring-yellow-500',
      progressColor: 'bg-yellow-400',
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-900',
      actionBg: 'bg-blue-100 hover:bg-blue-200 text-blue-800',
      ringColor: 'focus:ring-blue-500',
      progressColor: 'bg-blue-400',
    },
  };

  const config = toastConfig[toast.type];

  return (
    <div
      className={`
        w-full max-w-sm p-4 rounded-lg shadow-lg border transform
        transition-all duration-300 ease-out
        ${config.bgColor} ${config.borderColor}
        animate-slide-in
      `}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
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
                  text-sm font-medium rounded-md px-3 py-1.5 transition-colors
                  ${config.actionBg}
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
            ml-4 flex-shrink-0 rounded-md p-1 transition-colors
            ${config.iconColor} hover:opacity-75
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${config.ringColor}
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
              className={`h-full ${config.progressColor} transition-all duration-100`}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, hideToast, position } = useToast();

  const positionClasses: Record<ToastPosition, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div 
      className={`fixed z-50 ${positionClasses[position]} space-y-3`}
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onHide={hideToast} />
      ))}
    </div>
  );
};

export default ToastContainer;