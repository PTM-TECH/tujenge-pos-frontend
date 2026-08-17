"use client";

import { AlertTriangle } from "lucide-react";
import { getStockStatus } from "@/lib/utils";
import type { Product } from "@/types";

interface LowStockBannerProps {
  products: Product[];
}

export function LowStockBanner({ products }: LowStockBannerProps) {
  const lowStockItems = products.filter(
    (p) => getStockStatus(p.stock, p.lowStockThreshold) !== "in_stock"
  );

  if (lowStockItems.length === 0) return null;

  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-warning-200 bg-warning-50 px-4 py-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-500" />
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span className="font-semibold text-warning-900">
          Low Stock Alert — {lowStockItems.length} item
          {lowStockItems.length !== 1 ? "s" : ""} below threshold
        </span>
        <span className="text-warning-300">·</span>
        {lowStockItems.map((item, i) => {
          const isOut = item.stock <= 0;
          return (
            <span key={item.id} className="whitespace-nowrap">
              <span className={isOut ? "font-semibold text-danger-600" : "text-warning-700"}>
                {item.name} ({isOut ? "OUT" : item.stock})
              </span>
              {i < lowStockItems.length - 1 && <span className="text-warning-300">,</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}