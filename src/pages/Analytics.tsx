import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAuthStore, useUIStore } from '@/stores';
import { useAnalytics } from '@/hooks';
import { formatCurrency, formatMonth } from '@/lib/formatters';

const TOOLTIP_STYLE = {
  backgroundColor: '#16162a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '12px',
};

export default function Analytics() {
  const profile = useAuthStore((s) => s.profile);
  const { selectedMonth: month, selectedYear: year } = useUIStore();
  const currency = profile?.currency ?? 'CAD';
  const { data, isLoading } = useAnalytics(year, month);

  if (isLoading) return <div className="p-7 text-white/30 text-sm">Загрузка аналитики…</div>;

  return (
    <div className="p-7 max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Аналитика</h1>
        <p className="text-sm text-white/30 mt-0.5 capitalize">{formatMonth(year, month)}</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Доходы', value: data?.income ?? 0, color: '#34d399' },
          { label: 'Расходы', value: data?.expense ?? 0, color: '#fb7185' },
          { label: 'Баланс', value: (data?.income ?? 0) - (data?.expense ?? 0), color: '#a78bfa' },
        ].map((item) => (
          <div key={item.label} className="card-dark p-4">
            <p className="text-xs text-white/30 mb-1">{item.label}</p>
            <p className="font-display text-xl font-semibold" style={{ color: item.color }}>
              {formatCurrency(item.value, currency)}
            </p>
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div className="card-dark p-5">
        <p className="font-display text-sm font-semibold text-white mb-4">Доходы и расходы по дням</p>
        <ResponsiveContainer height={200} width="100%">
          <AreaChart data={data?.by_day ?? []}>
            <defs>
              <linearGradient id="gi" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ge" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              axisLine={false}
              dataKey="date"
              tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }}
              tickFormatter={(v) => formatCurrency(v, currency)}
              tickLine={false}
              width={60}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v) => formatCurrency(Number(v), currency)}
            />
            <Area dataKey="income" fill="url(#gi)" name="Доходы" stroke="#34d399" strokeWidth={2} type="monotone" />
            <Area dataKey="expense" fill="url(#ge)" name="Расходы" stroke="#fb7185" strokeWidth={2} type="monotone" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Pie */}
        <div className="card-dark p-5">
          <p className="font-display text-sm font-semibold text-white mb-4">Расходы по категориям</p>
          <ResponsiveContainer height={200} width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={data?.by_category ?? []}
                dataKey="total"
                innerRadius={50}
                nameKey="category_name"
                outerRadius={80}
                paddingAngle={3}
              >
                {(data?.by_category ?? []).map((cat, i) => (
                  <Cell key={cat.category_id} fill={cat.category_color || `hsl(${i * 45 + 200}, 70%, 60%)`} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v) => formatCurrency(Number(v), currency)}
              />
              <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div className="card-dark p-5">
          <p className="font-display text-sm font-semibold text-white mb-4">Топ категорий</p>
          <ResponsiveContainer height={200} width="100%">
            <BarChart data={(data?.by_category ?? []).slice(0, 6)} layout="vertical">
              <XAxis
                axisLine={false}
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
                tickFormatter={(v) => formatCurrency(v, currency)}
                tickLine={false}
                type="number"
              />
              <YAxis
                axisLine={false}
                dataKey="category_name"
                tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }}
                tickLine={false}
                type="category"
                width={90}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v) => formatCurrency(Number(v), currency)}
              />
              <Bar dataKey="total" name="Сумма" radius={[0, 6, 6, 0]}>
                {(data?.by_category ?? []).slice(0, 6).map((cat, i) => (
                  <Cell key={cat.category_id} fill={`hsl(${i * 40 + 200}, 70%, 60%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
