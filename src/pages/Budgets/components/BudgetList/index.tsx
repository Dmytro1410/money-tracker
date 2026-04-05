import { Budget, BudgetPeriod } from '@/types/common.ts';
import { useCategories } from '@/hooks';
import { ParentBudget } from '@/pages/Budgets/components/BudgetList/ParentBudget.tsx';
import { useState } from 'react';
import Modal from '@/components/ui/Modal.tsx';
import { EditBudgetForm } from '@/modals/EditBudgetForm.tsx';
import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';

export interface IBudgetsListProps {
  budgets: { all: Budget[], childBudgets: Budget[], parentBudgets: Budget[] };
  currency: string;
  isLoading: boolean;
  onDeleteBudget: (id: string) => void;
  onShowAdd: () => void;
}

export function BudgetList({
  budgets,
  currency,
  isLoading,
  onDeleteBudget,
  onShowAdd,
}: IBudgetsListProps) {
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

  const handleOnShowEdit = (val: any) => {
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
    <div className="grid grid-cols-3 gap-3">
      {budgets.parentBudgets.map((b) => (
        <ParentBudget
          budget={b}
          categories={categories}
          childBudgets={budgets.childBudgets}
          currency={currency}
          isExpanded={isExpanded(b.id)}
          onDelete={onDeleteBudget}
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
