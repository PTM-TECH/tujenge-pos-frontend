"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Plus } from "lucide-react";
import { StatsRow } from "@/features/dashboard/components/StatsRow";
import { AnnualPerformanceChart } from "@/features/dashboard/components/AnnualPerformanceChart";
import { MonthlyPerformanceChart } from "@/features/dashboard/components/MonthlyPerformanceChart";
import { ProductCategoriesGrid } from "@/features/dashboard/components/ProductCategoriesGrid";
import { OutstandingBalancesTable } from "@/features/dashboard/components/OutstandingBalancesTable";

function formatDateTime(date: Date) {
  const datePart = date.toLocaleDateString("en-KE", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} · ${timePart}`;
}

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  return (
    <div className="flex flex-col gap-6 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Store Overview</h1>
          <p className="text-sm text-navy-400">
            {now ? formatDateTime(now) : "\u00A0"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-xl border border-navy-100 px-4 py-2 text-sm font-medium text-navy-700 transition hover:bg-navy-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => router.push("/new-sale")}
            className="flex items-center gap-2 rounded-xl bg-success-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-success-600"
          >
            <Plus className="h-4 w-4" />
            New Sale
          </button>
        </div>
      </div>
      <StatsRow />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnnualPerformanceChart />
        <MonthlyPerformanceChart />
      </div>
      <ProductCategoriesGrid onSelectCategory={setSelectedCategory} />
      {selectedCategory && (
        <p className="text-xs text-navy-400">
          Selected category: {selectedCategory} — hook this up to New Sale's product filter later.
        </p>
      )}
      <OutstandingBalancesTable />
    </div>
  );
}