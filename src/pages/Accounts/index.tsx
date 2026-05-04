import { useState } from 'react';
import { AccountsComponent } from '@/pages/Accounts/component.tsx';
import AccountForm from '@/modals/Accounts/Upsert';
import Modal from '@/components/Modal.tsx';
import { getTotalBalance } from '@/pages/Accounts/utils.ts';
import { Account } from '@/types/common.ts';
import { useFetchAccounts } from '@/hooks/Accounts.ts';

export default function Accounts() {
  const { data: accounts = [], isLoading } = useFetchAccounts();
  const [accToEdit, setAccToEdit] = useState<Account | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const totalBalance = getTotalBalance(accounts);

  const handleOnShowModal = (account?: Account) => {
    setAccToEdit(account);
    setShowModal(true);
  };
  const handleOnHideModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <AccountsComponent
        accounts={accounts}
        isLoading={isLoading}
        totalBalance={totalBalance}
        onShowModal={handleOnShowModal}
      />
      <Modal
        open={showModal}
        title={accToEdit ? 'Edit account' : 'New account'}
        width="4xl"
        onClose={handleOnHideModal}
      >
        <AccountForm account={accToEdit} onClose={handleOnHideModal} />
      </Modal>
    </>
  );
}
