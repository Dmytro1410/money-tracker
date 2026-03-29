import Papa from 'papaparse'
import type { Transaction } from '@/types'

export interface CsvRow {
  date: string
  amount: number
  description: string
  type: 'income' | 'expense'
}

// Стратегии разных банков — легко расширять
const BANK_STRATEGIES: Record<string, (row: Record<string, string>) => CsvRow | null> = {
  sberbank: (row) => {
    const amount = parseFloat(row['Сумма операции']?.replace(',', '.') ?? '0')
    if (isNaN(amount)) return null
    return {
      date: row['Дата операции']?.slice(0, 10) ?? '',
      amount: Math.abs(amount),
      description: row['Описание'] ?? '',
      type: amount < 0 ? 'expense' : 'income',
    }
  },
  tinkoff: (row) => {
    const amount = parseFloat(row['Сумма платежа']?.replace(',', '.') ?? '0')
    if (isNaN(amount)) return null
    return {
      date: row['Дата операции']?.slice(0, 10) ?? '',
      amount: Math.abs(amount),
      description: row['Описание'] ?? '',
      type: amount < 0 ? 'expense' : 'income',
    }
  },
  generic: (row) => {
    // Пытаемся угадать колонки
    const dateKey = Object.keys(row).find(k => /date|дата/i.test(k)) ?? ''
    const amountKey = Object.keys(row).find(k => /amount|сумма/i.test(k)) ?? ''
    const descKey = Object.keys(row).find(k => /desc|описание|назначение/i.test(k)) ?? ''
    const amount = parseFloat(row[amountKey]?.replace(',', '.') ?? '0')
    if (!dateKey || isNaN(amount)) return null
    return {
      date: row[dateKey]?.slice(0, 10) ?? '',
      amount: Math.abs(amount),
      description: row[descKey] ?? '',
      type: amount < 0 ? 'expense' : 'income',
    }
  },
}

function makeHash(row: CsvRow, accountId: string): string {
  return btoa(`${accountId}:${row.date}:${row.amount}:${row.description}`).slice(0, 32)
}

export async function parseCsv(
  file: File,
  accountId: string,
  bank: keyof typeof BANK_STRATEGIES = 'generic',
): Promise<Omit<Transaction, 'id' | 'created_at'>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const strategy = BANK_STRATEGIES[bank] ?? BANK_STRATEGIES.generic
        const rows = (data as Record<string, string>[])
          .map(strategy)
          .filter((r): r is CsvRow => r !== null && r.date !== '')

        const transactions = rows.map((row) => ({
          account_id: accountId,
          category_id: null,
          amount: row.amount,
          type: row.type,
          date: row.date,
          note: row.description,
          tags: [] as string[],
          is_recurring: false,
          recur_rule: null,
          recur_end_date: null,
          imported_hash: makeHash(row, accountId),
        }))

        resolve(transactions)
      },
      error: reject,
    })
  })
}
