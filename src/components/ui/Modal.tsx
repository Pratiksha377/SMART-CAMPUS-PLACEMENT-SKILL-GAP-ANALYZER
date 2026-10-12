import React, { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] h-[90vh]',
};

export const ModalHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}> = ({ children, className = '', onClose, showCloseButton }) => (
  <div
    className={`flex items-start justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-800/80 shrink-0 ${className}`}
  >
    <div className="space-y-1">{children}</div>
    {showCloseButton && onClose && (
      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="touch-target p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors ml-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <X className="w-5 h-5" />
      </button>
    )}
  </div>
);

export const ModalBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div
    className={`px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto max-h-[75vh] text-slate-200 text-sm leading-relaxed ${className}`}
  >
    {children}
  </div>
);

export const ModalFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div
    className={`flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-t border-slate-800/80 bg-slate-950/40 rounded-b-2xl shrink-0 ${className}`}
  >
    {children}
  </div>
);

export const Modal: React.FC<ModalProps> & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
} = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = '',
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md transition-opacity duration-200 animate-fadeIn"
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={`
          relative w-full max-h-[92vh] flex flex-col bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl shadow-black/60
          backdrop-blur-xl overflow-hidden transition-all transform duration-200 scale-100
          ${sizeClasses[size]}
          ${className}
        `}
      >
        {(title || showCloseButton) && (
          <ModalHeader onClose={onClose} showCloseButton={showCloseButton}>
            {title && (
              <h2 id={titleId} className="text-lg font-semibold text-slate-100 tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p id={descriptionId} className="text-xs text-slate-400">
                {description}
              </p>
            )}
          </ModalHeader>
        )}

        <ModalBody>{children}</ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </div>
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
