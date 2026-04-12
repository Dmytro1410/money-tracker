import { useState } from 'react';
import Modal from '@/components/Modal.tsx';
import { BudgetsPageComponent } from '@/pages/Budgets/component.tsx';
import { UpsertBudgetsForm } from '@/modals/Budgets/Upsert';
import { IBudget } from '@/types/Budgets.ts';

export default function BudgetsPage() {
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<IBudget | null>(null);

  const handleOnShowBudgetModal = (budget?: IBudget) => {
    if (budget) setBudgetToEdit(budget);
    setShowBudgetModal(true);
  };
  const handleOnHideBudgetModal = () => {
    setShowBudgetModal(false);
  };

  return (
    <>
      <BudgetsPageComponent onShowBudgetModal={handleOnShowBudgetModal} />
      <Modal
        open={showBudgetModal}
        title={`${budgetToEdit ? 'Edit' : 'New'} Budget`}
        width="4xl"
        onClose={handleOnHideBudgetModal}
      >
        <UpsertBudgetsForm budget={budgetToEdit} onClose={handleOnHideBudgetModal} />
      </Modal>

    </>

  );
}
