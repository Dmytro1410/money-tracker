import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '@/types/common.ts';

// ─── Auth store ──────────────────────────────────────────────────────
interface AuthState {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
    }),
    { name: 'auth-store' },
  ),
);

// ─── UI store ────────────────────────────────────────────────────────
interface UIState {
  sidebarOpen: boolean
  selectedYear: number
  selectedMonth: number
  toggleSidebar: () => void
  setMonth: (year: number, month: number) => void
}

const now = new Date();

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  selectedYear: now.getFullYear(),
  selectedMonth: now.getMonth() + 1,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setMonth: (year, month) => set({ selectedYear: year, selectedMonth: month }),
}));

// ─── Budget store ────────────────────────────────────────────────────
// Хранит локальные оптимистичные обновления бюджетов
interface BudgetState {
  pendingBudgetIds: Set<string>
  markPending: (id: string) => void
  clearPending: (id: string) => void
}

export const useBudgetStore = create<BudgetState>()((set) => ({
  pendingBudgetIds: new Set(),
  markPending: (id) => set((s) => ({ pendingBudgetIds: new Set(s.pendingBudgetIds).add(id) })),
  clearPending: (id) => set((s) => {
    const next = new Set(s.pendingBudgetIds);
    next.delete(id);
    return { pendingBudgetIds: next };
  }),
}));
