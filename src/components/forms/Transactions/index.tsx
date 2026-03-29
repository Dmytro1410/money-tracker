import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores';
import { useAccounts, useCategories } from '@/hooks';
import type { TransactionType } from '@/types';
import Select from '@/components/ui/Select.tsx';

const TABS: { value: TransactionType; label: string; activeClass: string }[] = [
  { value: 'expense', label: 'Expense', activeClass: 'text-red-400 bg-red-400/10' },
  { value: 'income', label: 'Income', activeClass: 'text-emerald-400 bg-emerald-400/10' },
  { value: 'transfer', label: 'Transfer', activeClass: 'text-white bg-white/10' },
];

interface Props {
  onClose: () => void
}

export default function AddTransactionForm({ onClose }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const qc = useQueryClient();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [parentCatId, setParentCatId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: accounts = [] } = useAccounts();
  const { data: catData } = useCategories(type);

  const parents = catData?.parents ?? [];
  const children = catData?.children ?? [];
  const subCategories = children.filter((c) => c.parent_id === parentCatId);

  const finalCategoryId = categoryId || parentCatId || null;

  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = parseFloat(amount);
      if (Number.isNaN(parsed) || parsed <= 0) throw new Error('Введите корректную сумму');
      if (!accountId) throw new Error('Выберите счёт');

      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
      const base = {
        category_id: finalCategoryId,
        tags: tagList,
        date,
        note: note || null,
      };

      if (type === 'transfer') {
        if (!toAccountId || toAccountId === accountId) throw new Error('Выберите счёт назначения');
        const fromName = accounts.find((a) => a.id === accountId)?.name;
        const toName = accounts.find((a) => a.id === toAccountId)?.name;

        const { data: d1, error: e1 } = await supabase
          .from('transactions')
          .insert({
            ...base,
            account_id: accountId,
            transfer_to_account_id: toAccountId,
            amount: parsed,
            type: 'transfer',
            note: base.note ?? `Перевод → ${toName}`,
          })
          .select('id')
          .single();
        if (e1) throw e1;

        const { data: d2, error: e2 } = await supabase
          .from('transactions')
          .insert({
            ...base,
            account_id: toAccountId,
            transfer_to_account_id: toAccountId,
            amount: parsed,
            type: 'transfer',
            note: base.note ?? `Перевод ← ${fromName}`,
          })
          .select('id')
          .single();
        if (e2) throw e2;

        await supabase.from('transactions').update({ transfer_pair_id: d2.id }).eq('id', d1.id);
        await supabase.from('transactions').update({ transfer_pair_id: d1.id }).eq('id', d2.id);
      } else {
        const { error: err } = await supabase.from('transactions').insert({
          ...base, account_id: accountId, amount: parsed, type,
        });
        if (err) throw err;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
      qc.invalidateQueries({ queryKey: ['budgets'] });
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  const activeClass = TABS.find((t) => t.value === type)?.activeClass ?? '';

  const isSubmitDisabled = () => {
    if (mutation.isPending || !accountId || !amount) return true;

    if (type === 'transfer') {
      return !toAccountId || toAccountId === accountId;
    }

    return !parentCatId || (subCategories.length > 0 ? !categoryId : !categoryId);
  };

  return (
    <div className="space-y-4">
      <div className="flex rounded-xl overflow-hidden bg-ink-700">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            className={`flex-1 py-2.5 text-sm transition-colors ${
              type === tab.value ? `${tab.activeClass} font-700` : 'text-white/40 hover:text-white/70 font-600'
            }`}
            type="button"
            onClick={() => setType(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Amount</label>
        <div className="relative">
          <input
            autoFocus
            className="input text-xl font-800 pr-16"
            min="0"
            placeholder="0"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/25 font-600">
            {accounts.find((a) => a.id === accountId)?.currency ?? profile?.currency ?? 'CAD'}
          </span>
        </div>
      </div>

      <div className={`grid gap-3 ${type === 'transfer' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <div>
          <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">
            {type === 'transfer' ? 'From' : 'Account'}
          </label>
          <Select
            options={accounts.map((a) => ({ value: a.id, label: a.name }))}
            value={accountId}
            onChange={setAccountId}
          />
        </div>
        {type === 'transfer' && (
          <div>
            <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">To</label>
            <Select
              options={accounts
                .filter((a) => (a.id !== accountId))
                .map((a) => ({ value: a.id, label: a.name }))}
              value={toAccountId}
              onChange={setToAccountId}
            />

          </div>
        )}
      </div>

      {type !== 'transfer' && (
        <div className="space-y-3">
          <div>
            <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Category</label>
            <div className="grid grid-cols-8 gap-1.5 max-h-40 overflow-y-auto pr-0.5">
              {parents.map((cat) => (
                <button
                  key={cat.id}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs transition-all ${
                    parentCatId === cat.id
                      ? activeClass
                      : 'hover:bg-white/5 text-white/50 font-500'
                  }`}
                  type="button"
                  onClick={() => setParentCatId(parentCatId === cat.id ? '' : cat.id)}
                >
                  <span className="text-lg leading-none">{cat.icon}</span>
                  <span className="truncate w-full text-center leading-tight">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {parentCatId && subCategories.length > 0 && (
            <div>
              <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">
                Subcategory
                <span className="text-white/20 normal-case tracking-normal" />
              </label>
              <div className="grid grid-cols-8 gap-1.5">
                {subCategories.map((sub) => (
                  <button
                    key={sub.id}
                    className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs transition-all ${
                      categoryId === sub.id
                        ? activeClass
                        : 'hover:bg-white/5 text-white/50 font-500'
                    }`}
                    type="button"
                    onClick={() => setCategoryId(categoryId === sub.id ? '' : sub.id)}
                  >
                    <span className="text-lg leading-none">{sub.icon}</span>
                    <span className="truncate w-full text-center leading-tight">{sub.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Дата + Заметка */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Date</label>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Note</label>
          <input className="input" placeholder="optional" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>

      {/* Теги */}
      <div>
        <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">
          Tags
          <span className="text-white/20 normal-case tracking-normal">— separated by commas</span>
        </label>
        <input
          className="input"
          placeholder="food, work, family"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-xs font-500 text-red-400 bg-red-400/10 rounded-xl px-3 py-2.5">{error}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button className="btn-ghost flex-1" type="button" onClick={onClose}>Cancel</button>
        <button
          className="btn-primary flex-1"
          disabled={isSubmitDisabled()}
          type="button"
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? 'Submitting…' : `Add ${TABS.find((t) => t.value === type)?.label.toLowerCase()}`}
        </button>
      </div>
    </div>
  );
}
