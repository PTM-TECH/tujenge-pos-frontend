import { DollarSign, CreditCard, ShoppingBag, Wallet } from "lucide-react";
import { StatCard } from "@/components/layout/StatCard";
import { useDashboardStats } from "../hooks";
import { Skeleton } from "@/components/ui/Skeleton";

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatTrend(changePct: number) {
  return {
    value: `${Math.abs(changePct).toFixed(1)}% vs yesterday`,
    isPositive: changePct >= 0,
  };
}

export function StatsRow() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm text-danger-500">Failed to load dashboard stats.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Today's Revenue"
        value={formatCurrency(data.todaysRevenue.value)}
        icon={DollarSign}
        trend={formatTrend(data.todaysRevenue.changePct)}
        iconTone="success"
      />
      <StatCard
        label="Transactions"
        value={data.transactions.value.toLocaleString()}
        icon={CreditCard}
        trend={formatTrend(data.transactions.changePct)}
        iconTone="brand"
      />
      <StatCard
        label="Items Sold"
        value={data.itemsSold.value.toLocaleString()}
        icon={ShoppingBag}
        trend={formatTrend(data.itemsSold.changePct)}
        iconTone="warning"
      />
      <StatCard
        label="Outstanding Balance"
        value={formatCurrency(data.outstandingBalance.value)}
        icon={Wallet}
        trend={{
          value: `${data.outstandingBalance.partialPaymentAccounts} accounts with partial payments`,
          isPositive: false,
        }}
        iconTone="danger"
      />
    </div>
  );
}