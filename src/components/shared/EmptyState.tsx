import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 px-6 py-12 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-navy-50">
          <Icon className="h-6 w-6 text-navy-400" />
        </div>
      )}
      <p className="text-sm font-semibold text-navy-700">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-navy-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}