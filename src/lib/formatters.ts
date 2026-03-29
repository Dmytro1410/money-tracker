import { format, formatDistanceToNow } from 'date-fns';
import { enCA } from 'date-fns/locale';

// ─── Деньги ─────────────────────────────────────────────────────────
export function formatCurrency(
  amount: number,
  currency = 'CAD',
  locale = 'en-CA',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatAmount(amount: number, locale = 'en-CA'): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─── Даты ───────────────────────────────────────────────────────────
export function formatDate(date: string | Date, pattern = 'd MMM yyyy'): string {
  return format(typeof date === 'string' ? new Date(date) : date, pattern, {
    locale: enCA,
  });
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(
    typeof date === 'string' ? new Date(date) : date,
    { addSuffix: true, locale: enCA },
  );
}

export function formatMonth(year: number, month: number): string {
  return format(new Date(year, month - 1), 'MMMM yyyy', { locale: enCA });
}

// ─── Проценты ───────────────────────────────────────────────────────
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// ─── Кредитный лимит ────────────────────────────────────────────────
export function creditUsagePercent(balance: number, limit: number): number {
  if (limit === 0) return 0;
  if (balance > 0) return 0;
  // balance отрицательный при задолженности
  return Math.min(100, Math.round((Math.abs(balance) / limit) * 100));
}

// ─── Вклады ─────────────────────────────────────────────────────────
export function calcDepositIncome(
  amount: number,
  ratePercent: number,
  termMonths: number,
  capitalized: boolean,
): number {
  const r = ratePercent / 100;
  if (capitalized) {
    return amount * (1 + r / 12) ** termMonths - amount;
  }
  return amount * r * (termMonths / 12);
}
