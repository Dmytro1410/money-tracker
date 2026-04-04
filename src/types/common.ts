// ─── Пользователь / семья ────────────────────────────────────────────
import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';
import { RefObject } from 'react';

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

export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  type: TRANSACTION_TYPES
  parent_id: string | null
  is_system: boolean
}

// ─── Транзакции ──────────────────────────────────────────────────────
export type RecurRule = 'daily' | 'weekly' | 'monthly' | 'yearly'

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

// Date picker
export interface IDatePickerProps {
  date: string; // YYYY-MM-DD
  onSetDate: (date: string) => void;
}

export interface IDatePickerComponentProps {
  calendarDays: Date[];
  containerRef: RefObject<HTMLDivElement | null>;
  handleSelect: (day: Date) => void;
  isOpen: boolean;
  monthStart: Date;
  selectedDate: Date;
  setIsOpen: (isOpen: boolean) => void;
  setViewDate: (viewDate: Date) => void;
  viewDate: Date;
}
