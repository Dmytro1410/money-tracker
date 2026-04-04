import { MonthSelector } from '@/components/MonthSelector';

export interface IDashboardHeaderProps {
  firstName: string,

}

export function Header({ firstName }: IDashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="header-main">
        {firstName}
      </h1>
      <div className="hidden xl:block"><MonthSelector /></div>
    </div>
  );
}
