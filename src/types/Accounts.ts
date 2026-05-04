import { Account } from '@/types/common.ts';

export interface IAccountComponentProps {
  accounts: Account[],
  isLoading: boolean,
  totalBalance: number,
  onShowModal: () => void,
}

export interface IAccountItemProps {
  account: Account
  onEdit: (account: Account) => void
}
