import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export interface SelectOption {
  value: string
  label: string
  icon?: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
}

export default function Select({
  className, onChange, options, placeholder = 'Выберите...', value,
}: Props) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected = options.find((o) => o.value === value);

  // Определяем направление открытия
  function calcDirection() {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setDropUp(spaceBelow < 240 && spaceAbove > spaceBelow);
  }

  function handleOpen() {
    calcDirection();
    setOpen((o) => !o);
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div ref={ref} className={clsx('relative', className)}>
      {/* Trigger */}

      <button
        ref={triggerRef}
        className={clsx(
          'w-full flex items-center justify-between gap-2',
          'rounded-xl border border-white/10 bg-night-700',
          'px-3.5 py-2.5 text-sm text-white font-500 text-left placeholder:text-white/25',
          'transition-all duration-150 outline-none',
          open
            ? 'border-violet-500/50 ring-2 ring-violet-500/30'
            : 'border-white/8 hover:border-white/20',
        )}
        type="button"
        onClick={handleOpen}
      >
        <span className="flex items-center gap-2 truncate flex-1 min-w-0">
          {selected ? (
            <>
              {selected.icon && <span className="text-base flex-shrink-0">{selected.icon}</span>}
              <span className="text-white truncate">{selected.label}</span>
            </>
          ) : (
            <span className="text-white/25">{placeholder}</span>
          )}
        </span>
        <svg
          className="flex-shrink-0 transition-transform duration-150"
          fill="none"
          height="14"
          stroke="rgba(255,255,255,0.35)"
          strokeLinecap="round"
          strokeWidth="2"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          viewBox="0 0 24 24"
          width="14"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={clsx(
            'absolute z-[9999] w-full',
            'rounded-xl border border-white/10 bg-night-700',
            'shadow-2xl shadow-black/60',
            'max-h-56 overflow-y-auto',
            dropUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
          )}
        >
          {options.length === 0 && (
            <div className="px-3.5 py-3 text-sm text-white/25 text-center">
              Нет вариантов
            </div>
          )}
          {options.map((opt) => (
            <button
              key={opt.value}
              className={clsx(
                'w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left',
                'transition-colors duration-100 first:rounded-t-xl last:rounded-b-xl',
                opt.value === value
                  ? 'bg-night-600 text-white font-700'
                  : 'text-white/70 hover:bg-night-800 hover:text-white font-500',
              )}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.icon && (
                <span className="text-base w-5 text-center flex-shrink-0">{opt.icon}</span>
              )}
              <span className="truncate flex-1">{opt.label}</span>
              {opt.value === value && (
                <svg
                  className="flex-shrink-0"
                  fill="none"
                  height="13"
                  stroke="#8b5cf6"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  width="13"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
