// ─── Пользователь / семья ────────────────────────────────────────────
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  currency: string
  locale: string
  created_at: string
}

export type FamilyRole = 'owner' | 'member' | 'viewer'

export interface FamilyMember {
  id: string
  owner_id: string
  member_id: string
  role: FamilyRole
  profile: Pick<Profile, 'id' | 'email' | 'full_name' | 'avatar_url'>
}

// ─── Счета ───────────────────────────────────────────────────────────
export type AccountType = 'bank' | 'card' | 'cash' | 'deposit'

export interface Account {
  id: string
  user_id: string
  name: string
  type: AccountType
  balance: number
  currency: string
  credit_limit: number | null
  color: string | null
  icon: string | null
  is_archived: boolean
  created_at: string
}

// ─── Категории ───────────────────────────────────────────────────────
export type TransactionType = 'income' | 'expense' | 'transfer'

export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  type: TransactionType
  parent_id: string | null
  is_system: boolean
}

// ─── Транзакции ──────────────────────────────────────────────────────
export type RecurRule = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface Transaction {
  id: string
  account_id: string
  category_id: string | null
  amount: number
  type: TransactionType
  date: string
  note: string | null
  tags: string[]
  is_recurring: boolean
  recur_rule: RecurRule | null
  recur_end_date: string | null
  imported_hash: string | null
  // Трансфер
  transfer_to_account_id: string | null // id счёта-получателя
  transfer_pair_id: string | null // id парной транзакции (для авто-удаления)
  created_at: string
  // joined
  account?: Pick<Account, 'id' | 'name' | 'currency' | 'color'>
  to_account?: Pick<Account, 'id' | 'name' | 'currency' | 'color'> // счёт-получатель
  category?: Pick<Category, 'id' | 'name' | 'icon' | 'color'>
}

// ─── Бюджеты ─────────────────────────────────────────────────────────
export type BudgetPeriod = 'month' | 'quarter' | 'year'

export interface Budget {
  id: string
  user_id: string
  category_id: string
  children_amount: number
  parent_category_id: string | null
  amount: number
  period: BudgetPeriod
  year: number
  month: number | null
  spent?: number
  category?: Pick<Category, 'id' | 'name' | 'icon' | 'color'>
}

// ─── Вклады ──────────────────────────────────────────────────────────
export interface Deposit {
  id: string
  account_id: string
  amount: number
  rate: number
  term_months: number
  start_date: string
  end_date: string
  is_capitalized: boolean
  projected_income?: number
}

// ─── Аналитика ───────────────────────────────────────────────────────
export interface PeriodSummary {
  income: number
  expense: number
  balance: number
  by_category: CategoryStat[]
  by_day: DayStat[]
}

export interface CategoryStat {
  category_id: string
  category_name: string
  category_icon: string
  category_color: string
  total: number
  count: number
  percent: number
}

export interface DayStat {
  date: string
  income: number
  expense: number
}

// ─── UI helpers ───────────────────────────────────────────────────────
export type AuthMode = 'login' | 'register'

export type DateRange = {
  from: Date
  to: Date
}

export type ModalWidth =
  | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl' | '10xl'

export type SortOrder = 'asc' | 'desc'

export type TransactionFilter = TransactionType | 'all'

export interface ModalProps {
  children: React.ReactNode
  onClose: () => void
  open: boolean
  title: string
  width?: ModalWidth
}

export interface PaginationParams {
  page: number
  per_page: number
}
