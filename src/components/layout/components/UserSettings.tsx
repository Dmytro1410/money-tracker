import { useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase.ts';

export function UserSettings() {
  const profile = useAuthStore((s) => s.profile);

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)
      .toUpperCase()
    : profile?.email?.[0].toUpperCase() ?? '?';
  return (
    <div className="p-4 border-t border-white/5">
      <div
        className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
      >
        <div
          className="w-8 h-8 rounded-full bg-lime flex items-center justify-center text-ink-800 text-xs font-800 flex-shrink-0"
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-600 text-white/70 truncate">{profile?.full_name ?? profile?.email}</p>
          <p className="text-2xs text-white/25 truncate">{profile?.currency ?? 'CAD'}</p>
        </div>
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-400"
          type="button"
          onClick={() => supabase.auth.signOut()}
        >
          <svg
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="14"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
