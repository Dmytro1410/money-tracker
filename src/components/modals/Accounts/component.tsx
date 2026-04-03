import { AccountType } from '@/models/common.ts';

export interface IAccountsFormProps {
  balance: string;
  color: string;
  creditLimit: string;
  currency: string;
  error: string | null;
  isLoading: boolean;
  name: string;
  onChangeBalance: (b: string) => void;
  onChangeColor: (col: string) => void;
  onChangeCreditLimit: (cl: string) => void;
  onChangeCurrency: (c: string) => void;
  onChangeName: (n: string) => void;
  onChangeType: (t: AccountType) => void;
  onClose: () => void;
  onSubmit: () => void;
  type: AccountType;
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];
const TYPES: { value: AccountType; label: string; icon: string }[] = [
  { value: 'bank', label: 'Банковский счёт', icon: '🏦' },
  { value: 'card', label: 'Кредитная карта', icon: '💳' },
  { value: 'cash', label: 'Наличные', icon: '💵' },
  { value: 'deposit', label: 'Вклад', icon: '📈' },
];

export function AccountsFormsComponent({
  balance,
  color,
  creditLimit,
  currency,
  error,
  isLoading,
  name,
  onChangeBalance,
  onChangeColor,
  onChangeCreditLimit,
  onChangeCurrency,
  onChangeName,
  onChangeType,
  onClose,
  onSubmit,
  type,
}: IAccountsFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/60 mb-2">Тип счёта</label>
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                type === t.value
                  ? 'border-violet-500/60 bg-violet-500/10 text-violet-300 font-medium'
                  : 'border-white/10 text-white/70 hover:border-white/20 hover:bg-white/5'
              }`}
              type="button"
              onClick={() => {
                onChangeType(t.value);
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/60 mb-1.5">Название</label>
        <input
          autoFocus
          className="input"
          placeholder="Название счета"
          value={name}
          onChange={(e) => {
            onChangeName(e.target.value);
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-white/60 mb-1.5">
            {type === 'card' ? 'Текущий баланс (отрицательный = долг)' : 'Начальный баланс'}
          </label>
          <input
            className="input"
            placeholder="0"
            type="number"
            value={balance}
            onChange={(e) => {
              onChangeBalance(e.target.value);
            }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/60 mb-1.5">Валюта</label>
          <select
            className="input"
            value={currency}
            onChange={(e) => {
              onChangeCurrency(e.target.value);
            }}
          >
            {['CAD', 'USD', 'EUR', 'GBP', 'CNY', 'KZT'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {type === 'card' && (
        <div>
          <label className="block text-xs font-medium text-white/60 mb-1.5">
            Кредитный лимит
          </label>
          <input
            className="input"
            placeholder="100000"
            type="number"
            value={creditLimit}
            onChange={(e) => {
              onChangeCreditLimit(e.target.value);
            }}
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-white/60 mb-2">Цвет</label>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              className="h-7 w-7 rounded-full transition-transform hover:scale-110"
              style={{
                background: c,
                outline: color === c ? `2px solid ${c}` : 'none',
                outlineOffset: '2px',
              }}
              type="button"
              onClick={() => {
                onChangeColor(c);
              }}
            />
          ))}
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-400 bg-rose-400/10 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button className="btn-ghost flex-1 justify-center" type="button" onClick={onClose}>
          Отмена
        </button>
        <button
          className="btn-primary flex-1 justify-center"
          disabled={isLoading}
          type="button"
          onClick={onSubmit}
        >
          {isLoading ? 'Сохранение…' : 'Создать счёт'}
        </button>
      </div>
    </div>
  );
}
