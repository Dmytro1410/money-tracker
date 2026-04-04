import { TABS } from '@/constants/Transactions.ts';
import { ITransactionFormTypeSelectorProps } from '@/types/Transactions.ts';

export function TypeSelector({ onSetType, type }: ITransactionFormTypeSelectorProps) {
  return (
    <div className="flex rounded-xl overflow-hidden bg-night-700">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          className={`flex-1 py-2.5 text-sm transition-colors ${
            type === tab.value ? `${tab.activeClass} font-700` : 'text-white/40 hover:text-white/70 font-600'
          }`}
          type="button"
          onClick={() => onSetType(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
