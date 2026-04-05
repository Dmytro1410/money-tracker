import { BudgetPeriod } from '@/types/common.ts';
import { useCategories } from '@/hooks';
import { useState } from 'react';
import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';
import { ParentBudget } from '@/pages/Budgets/components/BudgetList/ParentBudget.tsx';
import { EditBudgetForm } from '@/modals/EditBudgetForm.tsx';
import Modal from '@/components/ui/Modal.tsx';
import { IBudgetsBudgetListProps, TBudgetEditPayload } from '@/types/Budgets.ts';

export function BudgetList({
  budgets,
  currency,
  isLoading,
  onShowAdd,
}: IBudgetsBudgetListProps) {
  const { data: catData } = useCategories(TRANSACTION_TYPES.EXPENSE);
  const { all: categories = [] } = catData || {};

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<{
    id: string;
    amount: number;
    period: BudgetPeriod;
    categoryId: string
  } | null>(null);
  if (isLoading) return <p className="text-white/25 text-sm font-500 text-center py-12">Загрузка…</p>;

  const isExpanded = (bId: string) => expandedIds.has(bId);

  const handleOnExpand = (bId: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bId)) newSet.delete(bId);
      else newSet.add(bId);
      return newSet;
    });
  };

  const handleOnShowEdit = (val: TBudgetEditPayload) => {
    setEditing(val);
  };

  const handleOnHideEdit = () => {
    setEditing(null);
  };

  if (budgets.all.length === 0) {
    return (
      <div
        className="card p-12 text-center cursor-pointer hover:bg-white/5 transition-colors"
        onClick={onShowAdd}
      >
        <div className="w-14 h-14 rounded-2xl bg-lime/10 flex items-center justify-center mx-auto mb-4">
          <svg
            fill="none"
            height="24"
            stroke="#CFF008"
            strokeLinecap="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <p className="text-white/50 text-sm font-700">Нет бюджетов на этот месяц</p>
        <p className="text-white/20 text-xs font-500 mt-1">Нажмите чтобы добавить первый</p>
      </div>
    );
  }

  return (
    <div
      className="space-y-4 overflow-y-auto max-h-[calc(100vh_-_330px)] xl:max-h-[calc(100vh_-_300px)]"
    >
      {budgets.parents.map((b) => (
        <ParentBudget
          key={b.id}
          budget={b}
          categories={categories}
          childBudgets={budgets.children}
          currency={currency}
          isExpanded={isExpanded(b.id)}
          onEdit={handleOnShowEdit}
          onExpand={handleOnExpand}
        />
      ))}
      <Modal open={!!editing} title="Редактировать бюджет" onClose={handleOnHideEdit}>
        {editing && (
          <EditBudgetForm
            editAmount={editing.amount}
            editCategoryId={editing.categoryId}
            editId={editing.id}
            editPeriod={editing.period}
            onClose={handleOnHideEdit}
          />
        )}
      </Modal>
    </div>
  );
}
