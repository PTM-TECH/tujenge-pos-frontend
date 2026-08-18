import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDashboardPerformance } from "../hooks";

function formatYTD(value: number) {
  return `$${Math.round(value / 1000)}K YTD`;
}

function formatAxisTick(value: number) {
  return `$${Math.round(value / 1000)}k`;
}

export function AnnualPerformanceChart() {
  const { data, isLoading, error } = useDashboardPerformance();

  if (isLoading) {
    return <Skeleton className="h-[420px] w-full rounded-2xl" />;
  }

  if (error || !data) {
    return (
      <Card>
        <p className="text-sm text-danger-500">Failed to load annual performance.</p>
      </Card>
    );
  }

  const { ytdTotal, data: chartData } = data.annual;

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-navy-900">Annual Sales Performance</h3>
          <p className="text-sm text-navy-400">Revenue vs target · 2026 YTD</p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
          {formatYTD(ytdTotal)}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-border, #E5E7EB)" />
          <XAxis
            dataKey="month"
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
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
            cursor={{ fill: "var(--color-brand-50, #F0FDF4)" }}
          />
          <Bar dataKey="revenue" fill="var(--color-success-500, #22C55E)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}