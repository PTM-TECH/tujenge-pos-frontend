import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; isPositive: boolean };
  iconTone?: "brand" | "success" | "warning" | "danger";
}

const toneClasses = {
  brand: "bg-brand-50 text-brand-600",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
};

export function StatCard({ label, value, icon: Icon, trend, iconTone = "brand" }: StatCardProps) {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="label-caps">{label}</p>
        <p className="mt-2 text-2xl font-bold text-navy-900">{value}</p>
        {trend && (
          <p
            className={cn(
              "mt-1 text-xs font-semibold",
              trend.isPositive ? "text-success-600" : "text-danger-500"
            )}
          >
            {trend.isPositive ? "↗" : "↘"} {trend.value}
          </p>
        )}
      </div>
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", toneClasses[iconTone])}>
        <Icon className="h-5 w-5" />
      </div>
    </Card>
  );
}