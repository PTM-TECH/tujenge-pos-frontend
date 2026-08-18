
"use client";

import { useState } from "react";
import { StatsRow } from "@/features/dashboard/components/StatsRow";
import { AnnualPerformanceChart } from "@/features/dashboard/components/AnnualPerformanceChart";
import { MonthlyPerformanceChart } from "@/features/dashboard/components/MonthlyPerformanceChart";
import { ProductCategoriesGrid } from "@/features/dashboard/components/ProductCategoriesGrid";

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Store Overview</h1>
        <p className="text-sm text-navy-400">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
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
    </div>
  );
}