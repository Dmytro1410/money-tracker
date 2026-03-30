import { type ReactNode, useEffect } from 'react';
import clsx from 'clsx';

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
}

export default function Modal({
  children, onClose, open, title, width = 'md',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('keydown', h);
    };
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center lg:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={clsx(
          'relative z-10 w-full rounded-2xl lg:rounded-3xl bg-night-800 shadow-2xl h-full',
          width === 'sm' && 'max-w-sm',
          width === 'md' && 'max-w-md',
          width === 'lg' && 'max-w-lg',
          width === 'xl' && 'max-w-xl',
          width === '2xl' && 'max-w-2xl',
          width === '3xl' && 'max-w-3xl',
          width === '4xl' && 'max-w-4xl',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-base font-800 text-white">{title}</h2>
          <button
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all text-lg leading-none"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
