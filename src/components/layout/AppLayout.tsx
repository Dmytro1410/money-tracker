import { Outlet } from 'react-router-dom';
import { LogoContainer } from '@/components/layout/components/LogoContainer.tsx';
import { Navigation } from '@/components/layout/components/Navigation.tsx';
import { UserSettings } from '@/components/layout/components/UserSettings.tsx';

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-56 flex flex-col bg-ink-900 border-r border-white/5 flex-shrink-0">
        <LogoContainer />
        <Navigation />
        <UserSettings />
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
