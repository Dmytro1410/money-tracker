import { useState } from 'react';
import { useAccounts } from '@/hooks';
import { AccountsComponent } from '@/pages/Accounts/component.tsx';
import AddAccountForm from '@/components/modals/Accounts';
import Modal from '@/components/ui/Modal.tsx';
import { getTotalBalance } from '@/pages/Accounts/utils.ts';

export default function Accounts() {
  const { data: accounts = [], isLoading } = useAccounts();
  const [showAdd, setShowAdd] = useState(false);
  const totalBalance = getTotalBalance(accounts);

  const handleOnShowAdd = () => {
    setShowAdd(true);
  };
  const handleOnHideAdd = () => {
    setShowAdd(false);
  };

  return (
    <>
      <AccountsComponent
        accounts={accounts}
        isLoading={isLoading}
        totalBalance={totalBalance}
        onShowAdd={handleOnShowAdd}
      />
      <Modal open={showAdd} title="Новый счёт" onClose={handleOnHideAdd}>
        <AddAccountForm onClose={handleOnHideAdd} />
      </Modal>
    </>
  );
}
