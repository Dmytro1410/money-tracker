import { useEffect } from 'react';
import clsx from 'clsx';
import type { ModalProps } from '@/types';

export default function Modal({
  children, onClose, open, title, width = 'md',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={clsx(
          'relative z-10 w-full rounded-2xl border border-white/10 bg-night-800',
          'shadow-2xl',
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="font-display text-base font-semibold text-white">{title}</h2>
          <button
            className="text-white/30 hover:text-white transition-colors text-xl leading-none"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
