import { Badge } from "@/components/ui";

type Status =
  | "active"
  | "inactive"
  | "complete"
  | "refunded"
  | "pending"
  | "received"
  | "out_of_stock"
  | "low_stock"
  | "in_stock";

const STATUS_CONFIG: Record<Status, { label: string; tone: "success" | "danger" | "warning" | "neutral" }> = {
  active: { label: "Active", tone: "success" },
  inactive: { label: "Inactive", tone: "neutral" },
  complete: { label: "Complete", tone: "success" },
  refunded: { label: "Refunded", tone: "danger" },
  pending: { label: "Pending", tone: "warning" },
  received: { label: "Received", tone: "success" },
  out_of_stock: { label: "Out of stock", tone: "danger" },
  low_stock: { label: "Low stock", tone: "warning" },
  in_stock: { label: "In stock", tone: "success" },
};

export function StatusPill({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge tone={config.tone} className="gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}