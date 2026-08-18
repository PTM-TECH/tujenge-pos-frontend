// features/dashboard/components/MonthlyPerformanceChart.tsx
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDashboardPerformance } from "../hooks";

function formatAxisTick(value: number) {
  return `$${Math.round(value / 1000)}k`;
}

export function MonthlyPerformanceChart() {
  const { data, isLoading, error } = useDashboardPerformance();

  if (isLoading) {
    return <Skeleton className="h-[420px] w-full rounded-2xl" />;
  }

  if (error || !data) {
    return (
      <Card>
        <p className="text-sm text-danger-500">Failed to load monthly performance.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-navy-900">Monthly Performance</h3>
          <p className="text-sm text-navy-400">Revenue, Balance & Profit · 8 weeks</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-danger-50 px-3 py-1 text-xs font-semibold text-danger-500">
          <span className="h-1.5 w-1.5 rounded-full bg-danger-500" />
          LIVE
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.monthly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-border, #E5E7EB)" />
          <XAxis
            dataKey="week"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-navy-400, #94A3B8)", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatAxisTick}
            tick={{ fill: "var(--color-navy-400, #94A3B8)", fontSize: 12 }}
          />
          <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
          <Legend
            iconType="circle"
            formatter={(value) => <span className="text-xs text-navy-500">{value}</span>}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="revenue"
            stroke="var(--color-success-500, #22C55E)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="balance"
            name="balance"
            stroke="var(--color-brand-500, #3B82F6)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="profit"
            name="profit"
            stroke="var(--color-warning-500, #F59E0B)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}