import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

const LIME = '#CFF008';
// const LIME_DIM = 'rgba(207,240,8,0.12)';
// const WHITE_DIM = 'rgba(255,255,255,0.06)';

// Палитра для категорий — lime первый, потом убывающие оттенки
const CAT_COLORS = [
  '#CFF008', '#a3c200', '#7a9200', '#f97316', '#fb923c',
  '#facc15', '#4ade80', '#38bdf8', '#a78bfa', '#f472b6',
];

const AXIS_STYLE = {
  fontSize: 11,
  fill: 'rgba(255,255,255,0.25)',
  fontFamily: 'Urbanist, sans-serif',
  fontWeight: 600,
};

const GRID_STYLE = {
  stroke: 'rgba(255,255,255,0.05)',
  strokeDasharray: '4 4',
};

// Кастомный тултип
function CustomTooltip({
  active, currency, label, payload,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
  currency: string
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1a1a1a',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12,
      padding: '10px 14px',
      fontFamily: 'Urbanist, sans-serif',
      minWidth: 140,
    }}
    >
      {label && (
        <p style={{
          color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, marginBottom: 6,
        }}
        >
          {label}
        </p>
      )}
      {payload.map((entry, i) => (
        <div
          key={entry.name}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: i < payload.length - 1 ? 4 : 0,
          }}
        >
          <span style={{ color: entry.color, fontSize: 12, fontWeight: 600 }}>{entry.name}</span>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{formatCurrency(entry.value, currency)}</span>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const profile = useAuthStore((s) => s.profile);
  const { selectedMonth: month, selectedYear: year, setMonth } = useUIStore();
  const currency = profile?.currency ?? 'RUB';
  const { data, isLoading } = useAnalytics(year, month);

  function prevMonth() {
    if (month === 1) {
      setMonth(year - 1, 12);
    } else {
      setMonth(year, month - 1);
    }
  }

  function nextMonth() {
    if (month === 12) {
      setMonth(year + 1, 1);
    } else {
      setMonth(year, month + 1);
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 lg:p-7 text-white/25 text-sm font-500 flex items-center justify-center h-40">
        Загрузка аналитики…
      </div>
    );
  }

  const byDay = data?.by_day ?? [];
  const byCat = data?.by_category ?? [];

  return (
    <div className="p-4 lg:p-7 max-w-5xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-800 text-white tracking-tight">Аналитика</h1>
          <p className="text-sm text-white/30 font-500 mt-0.5 capitalize">{formatMonth(year, month)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-icon" type="button" onClick={prevMonth}>
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="14"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="text-sm font-700 text-white/60 capitalize w-32 text-center">{formatMonth(year, month)}</span>
          <button className="btn-icon" type="button" onClick={nextMonth}>
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="14"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Доходы', value: data?.income ?? 0, color: LIME },
          { label: 'Расходы', value: data?.expense ?? 0, color: 'rgba(255,255,255,0.5)' },
          {
            label: 'Баланс',
            value: (data?.income ?? 0) - (data?.expense ?? 0),
            color: (data?.income ?? 0) >= (data?.expense ?? 0) ? LIME : '#f87171',
          },
        ].map((item) => (
          <div key={item.label} className="card p-4">
            <p className="text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">{item.label}</p>
            <p className="text-lg sm:text-xl font-800 tabular-nums" style={{ color: item.color }}>
              {formatCurrency(item.value, currency)}
            </p>
          </div>
        ))}
      </div>

      {/* Area chart — доходы и расходы по дням */}
      <div className="card p-5">
        <p className="text-sm font-800 text-white tracking-tight mb-5">Доходы и расходы по дням</p>
        {byDay.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-white/20 text-sm">Нет данных</div>
        ) : (
          <ResponsiveContainer height={200} width="100%">
            <AreaChart
              data={byDay}
              margin={{
                top: 4, right: 4, left: 0, bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="grad-income" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={LIME} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={LIME} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-expense" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fff" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#fff" stopOpacity={0} />
                </linearGradient>
              </defs>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <CartesianGrid vertical={false} {...GRID_STYLE} />
              <XAxis axisLine={false} dataKey="date" dy={8} tick={AXIS_STYLE} tickLine={false} />
              <YAxis
                axisLine={false}
                tick={AXIS_STYLE}
                tickFormatter={(v) => formatCurrency(Number(v), currency)}
                tickLine={false}
                width={70}
              />
              <Tooltip content={<CustomTooltip currency={currency} />} />
              <Area
                activeDot={{
                  r: 4, fill: LIME, stroke: '#131313', strokeWidth: 2,
                }}
                dataKey="income"
                dot={false}
                fill="url(#grad-income)"
                name="Доходы"
                stroke={LIME}
                strokeWidth={2.5}
                type="monotone"
              />
              <Area
                activeDot={{
                  r: 4, fill: '#fff', stroke: '#131313', strokeWidth: 2,
                }}
                dataKey="expense"
                dot={false}
                fill="url(#grad-expense)"
                name="Расходы"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Donut — расходы по категориям */}
        <div className="card p-5">
          <p className="text-sm font-800 text-white tracking-tight mb-4">По категориям</p>
          {byCat.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-white/20 text-sm">Нет данных</div>
          ) : (
            <>
              <ResponsiveContainer height={180} width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={byCat}
                    dataKey="total"
                    innerRadius={52}
                    nameKey="category_name"
                    outerRadius={80}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {byCat.map((cat, i) => (
                      <Cell key={cat.category_id} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip currency={currency} />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Легенда вручную */}
              <div className="mt-3 space-y-1.5 max-h-32 overflow-y-auto">
                {byCat.slice(0, 6).map((cat, i) => (
                  <div key={cat.category_id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: CAT_COLORS[i % CAT_COLORS.length] }}
                      />
                      <span className="text-xs font-500 text-white/50 truncate">{cat.category_name}</span>
                    </div>
                    <span className="text-xs font-700 text-white/70 flex-shrink-0">
                      {cat.percent}
                      %
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Horizontal bar — топ категорий */}
        <div className="card p-5">
          <p className="text-sm font-800 text-white tracking-tight mb-4">Топ категорий</p>
          {byCat.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-white/20 text-sm">Нет данных</div>
          ) : (
            <ResponsiveContainer height={220} width="100%">
              <BarChart
                data={byCat.slice(0, 6)}
                layout="vertical"
                margin={{
                  top: 0, right: 4, left: 0, bottom: 0,
                }}
              >
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <CartesianGrid horizontal={false} {...GRID_STYLE} />
                <XAxis
                  axisLine={false}
                  tick={AXIS_STYLE}
                  tickFormatter={(v) => formatCurrency(Number(v), currency)}
                  tickLine={false}
                  type="number"
                />
                <YAxis
                  axisLine={false}
                  dataKey="category_name"
                  tick={{ ...AXIS_STYLE, fill: 'rgba(255,255,255,0.45)' }}
                  tickLine={false}
                  type="category"
                  width={80}
                />
                <Tooltip content={<CustomTooltip currency={currency} />} />
                <Bar dataKey="total" maxBarSize={22} name="Сумма" radius={[0, 6, 6, 0]}>
                  {byCat.slice(0, 6).map((_, i) => (
                    <Cell
                      key={i}
                      fill={CAT_COLORS[i % CAT_COLORS.length]}
                      fillOpacity={i === 0 ? 1 : 0.7}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
