import { DatePicker } from '@/components/DatePicker';

export interface IDashboardHeaderProps {
  firstName: string,

}

export function Header({ firstName }: IDashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="header-main">
        {firstName}
      </h1>
      <div className="hidden xl:block"><DatePicker /></div>
    </div>
  );
}
