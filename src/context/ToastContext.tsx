import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Toast, ToastProps, ToastType, ToastContainer } from '@/components/ui/Toast';

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: React.ReactNode;
  duration?: number;
}

export interface ToastContextType {
  toasts: ToastProps[];
  showToast: (message: React.ReactNode, options?: ToastOptions) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
  success: (message: React.ReactNode, title?: React.ReactNode, duration?: number) => string;
  error: (message: React.ReactNode, title?: React.ReactNode, duration?: number) => string;
  warning: (message: React.ReactNode, title?: React.ReactNode, duration?: number) => string;
  info: (message: React.ReactNode, title?: React.ReactNode, duration?: number) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}> = ({ children, position = 'top-right' }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (message: React.ReactNode, options: ToastOptions = {}) => {
      const id = options.id || uuidv4();
      const newToast: ToastProps = {
        id,
        type: options.type || 'info',
        title: options.title,
        message,
        duration: options.duration !== undefined ? options.duration : 5000,
        onDismiss: dismissToast,
      };

      setToasts((prev) => {
        // Replace existing toast if id matches, otherwise append
        const filtered = prev.filter((t) => t.id !== id);
        return [...filtered, newToast];
      });

      return id;
    },
    [dismissToast]
  );

  const success = useCallback(
    (message: React.ReactNode, title?: React.ReactNode, duration?: number) => {
      return showToast(message, { type: 'success', title, duration });
    },
    [showToast]
  );

  const error = useCallback(
    (message: React.ReactNode, title?: React.ReactNode, duration?: number) => {
      return showToast(message, { type: 'error', title, duration });
    },
    [showToast]
  );

  const warning = useCallback(
    (message: React.ReactNode, title?: React.ReactNode, duration?: number) => {
      return showToast(message, { type: 'warning', title, duration });
    },
    [showToast]
  );

  const info = useCallback(
    (message: React.ReactNode, title?: React.ReactNode, duration?: number) => {
      return showToast(message, { type: 'info', title, duration });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        dismissToast,
        clearToasts,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} position={position} />
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
