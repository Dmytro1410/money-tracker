import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase.ts';
import { useAuthStore, useUIStore } from '@/stores';
import { useCategories } from '@/hooks';
import type { BudgetPeriod } from '@/types/common.ts';
import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';

const PERIODS: { value: BudgetPeriod; label: string }[] = [
  { value: 'month', label: 'Месяц' },
  { value: 'quarter', label: 'Квартал' },
  { value: 'year', label: 'Год' },
];

interface Props {
  onClose: () => void
}

export default function AddBudgetForm({ onClose }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const { selectedMonth: month, selectedYear: year } = useUIStore();
  const qc = useQueryClient();

  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<BudgetPeriod>('month');
  const [error, setError] = useState<string | null>(null);

  const { data: catData } = useCategories(TRANSACTION_TYPES.EXPENSE);
  const { all: categories = [], children = [], parents = [] } = catData || {};

  useEffect(() => {
    if (categories.length > 0 && !categoryId) setCategoryId(categories[0].id);
  }, [categories, categoryId]);

  const selectedCat = categories.find((c) => c.id === categoryId);
  const isSubCat = !!selectedCat?.parent_id;
  const parentCat = isSubCat ? categories.find((c) => c.id === selectedCat?.parent_id) : null;

  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = parseFloat(amount);
      if (isNaN(parsed) || parsed <= 0) throw new Error('Введите корректную сумму');
      if (!categoryId) throw new Error('Выберите категорию');

      const base = {
        user_id: profile!.id,
        period,
        year,
        month: period === 'month' ? month : null,
      };

      // Если выбрана подкатегория — сначала создаём родительский бюджет
      if (isSubCat && parentCat) {
        const { error: parentErr } = await supabase
          .from('budgets')
          .upsert(
            { ...base, category_id: parentCat.id, amount: 0 },
            { onConflict: 'user_id,category_id,year,month', ignoreDuplicates: true },
          );
        if (parentErr) console.warn('parent budget:', parentErr.message);
      }

      // Создаём бюджет для выбранной категории
      const { error } = await supabase
        .from('budgets')
        .upsert(
          { ...base, category_id: categoryId, amount: parsed },
          { onConflict: 'user_id,category_id,year,month' },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budgets'] });
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <div className="space-y-4">
      {/* Период */}
      <div>
        <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Период</label>
        <div className="flex rounded-xl overflow-hidden border border-white/8 bg-night-700">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              className={`flex-1 py-2.5 text-sm transition-colors ${
                period === p.value ? 'bg-lime text-ink-800 font-700' : 'text-white/40 hover:text-white/70 font-600'
              }`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Категория */}
      <div>
        <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Категория</label>
        <div className="rounded-xl border border-white/8 bg-night-700 max-h-52 overflow-y-auto">
          {parents.map((parent) => {
            const subs = children.filter((c) => c.parent_id === parent.id);
            return (
              <div key={parent.id}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${
                    categoryId === parent.id ? 'bg-lime/10 text-lime' : 'text-white/70 hover:bg-white/5'
                  }`}
                  onClick={() => setCategoryId(parent.id)}
                >
                  <span className="text-base w-6 text-center flex-shrink-0">{parent.icon}</span>
                  <span className="text-sm font-700 flex-1">{parent.name}</span>
                  {categoryId === parent.id && (
                    <svg
                      className="flex-shrink-0"
                      fill="none"
                      height="14"
                      stroke="#CFF008"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      width="14"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                {subs.map((sub) => (
                  <button
                    key={sub.id}
                    className={`w-full flex items-center gap-3 px-3 py-2 pl-10 transition-colors text-left ${
                      categoryId === sub.id ? 'bg-lime/10 text-lime' : 'text-white/40 hover:bg-white/5 hover:text-white/60'
                    }`}
                    onClick={() => setCategoryId(sub.id)}
                  >
                    <span className="text-sm w-5 text-center flex-shrink-0">{sub.icon}</span>
                    <span className="text-xs font-600 flex-1">{sub.name}</span>
                    {categoryId === sub.id && (
                      <svg
                        className="flex-shrink-0"
                        fill="none"
                        height="12"
                        stroke="#CFF008"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        width="12"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* Подсказка — показывается только при выборе подкатегории */}
        {isSubCat && parentCat && (
          <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-lime/8 border border-lime/20">
            <svg
              fill="none"
              height="14"
              stroke="#CFF008"
              strokeLinecap="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="14"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <p className="text-xs text-lime/80 font-500">
              Автоматически создастся родительский бюджет
              {' '}
              <span className="font-700">
                {parentCat.icon}
                {' '}
                {parentCat.name}
              </span>
            </p>
          </div>
        )}

        {selectedCat && !isSubCat && (
          <p className="text-xs text-white/30 font-500 mt-1.5">
            Выбрано:
            {' '}
            <span className="text-lime font-700">
              {selectedCat.icon}
              {' '}
              {selectedCat.name}
            </span>
          </p>
        )}
      </div>

      {/* Сумма */}
      <div>
        <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">
          Лимит на
          {' '}
          {period === 'month' ? 'месяц' : period === 'quarter' ? 'квартал' : 'год'}
        </label>
        <div className="relative">
          <input
            autoFocus
            className="input text-xl font-800 pr-16"
            min="0"
            placeholder="0"
            step="100"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/25 font-600">
            {profile?.currency ?? 'RUB'}
          </span>
        </div>
      </div>

      {error && <p className="text-xs font-500 text-red-400 bg-red-400/10 rounded-xl px-3 py-2.5">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button className="btn-ghost flex-1" onClick={onClose}>Отмена</button>
        <button
          className="btn-primary flex-1"
          disabled={mutation.isPending || !amount || !categoryId}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? 'Сохранение…' : 'Сохранить бюджет'}
        </button>
      </div>
    </div>
  );
}
