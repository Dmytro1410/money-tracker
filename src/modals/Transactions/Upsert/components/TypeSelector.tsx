import { TABS, TRANSACTION_TYPES } from '@/constants/Transactions.ts';
import { ITransactionFormTypeSelectorProps } from '@/types/Transactions.ts';

const availableTypesOnEdit:
  Record<TRANSACTION_TYPES, TRANSACTION_TYPES[]> = {
    [TRANSACTION_TYPES.ALL]: [],
    [TRANSACTION_TYPES.INCOME]: [TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE],
    [TRANSACTION_TYPES.EXPENSE]: [TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE],
    [TRANSACTION_TYPES.TRANSFER]: [TRANSACTION_TYPES.TRANSFER],
  };

export function TypeSelector({ isEdit, onSetType, type }: ITransactionFormTypeSelectorProps) {
  const filteredTabs = TABS.filter((t) => {
    if (!isEdit) return true;
    return availableTypesOnEdit[type].includes(t.value);
  });

  const isSelected = (tab: typeof TABS[number]) => {
    if (type === TRANSACTION_TYPES.ALL) return tab.value === TRANSACTION_TYPES.EXPENSE;
    return type === tab.value;
  };
  return (
    <div className="flex rounded-xl overflow-hidden bg-night-700">
      {filteredTabs.map((tab) => (
        <button
          key={tab.value}
          className={`flex-1 py-2.5 text-sm transition-colors ${
            isSelected(tab) ? `${tab.activeClass} font-700` : 'text-white/40 hover:text-white/70 font-600'
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
