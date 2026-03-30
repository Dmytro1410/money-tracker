import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { LogoContainer } from '@/components/layout/components/LogoContainer.tsx';
import { Navigation } from '@/components/layout/components/Navigation.tsx';
import { UserSettings } from '@/components/layout/components/UserSettings.tsx';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-night-800">

      {/* Desktop */}
      <aside className="hidden xl:flex flex-col w-56 bg-night-900 border-r border-white/5 flex-shrink-0">
        <LogoContainer />
        <Navigation />
        <UserSettings />
      </aside>

      {/* Mobile */}
      {sidebarOpen && (
        <div
          className="xl:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={clsx(
        'xl:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col',
        'bg-night-900 border-r border-white/5',
        'transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      )}
      >
        <div className="px-5"><LogoContainer /></div>
        <Navigation onCloseSideBar={() => {
          setSidebarOpen(false);
        }}
        />
        <UserSettings />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <header
          className="xl:hidden flex items-center justify-between px-4 h-14 bg-night-900 border-b border-white/5 flex-shrink-0"
        >
          <LogoContainer />
          <button
            className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            type="button"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              fill="none"
              height="18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="18"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-night-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
