"use client";

import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusPill } from "@/components/shared/StatusPill";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PurchaseOrder } from "@/types";

export interface PurchaseTableProps {
  purchases: PurchaseOrder[];
  isLoading?: boolean;
}

export function PurchaseTable({ purchases, isLoading }: PurchaseTableProps) {
  const columns: Column<PurchaseOrder>[] = [
    {
      key: "poNumber",
      header: "PO Number",
      render: (po) => <span className="font-semibold text-navy-900">{po.poNumber}</span>,
    },
    {
      key: "date",
      header: "Date",
      render: (po) => formatDate(po.date),
    },
    {
      key: "supplierName",
      header: "Supplier",
      render: (po) => <span className="font-medium text-navy-800">{po.supplierName}</span>,
    },
    {
      key: "contactName",
      header: "Contact",
      render: (po) => po.contactName,
    },
    {
      key: "itemsCount",
      header: "Items",
      render: (po) => po.itemsCount,
    },
    {
      key: "total",
      header: "Total",
      render: (po) => (
        <span className="font-semibold text-navy-900">{formatCurrency(po.total)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      // StatusPill's Status type doesn't include "cancelled" yet — fall back
      // to a plain Badge for that case. Ask the lead whether to extend
      // StatusPill's Status type instead (shared file, small PR) so this
      // whole cell can just be <StatusPill status={po.status} />.
      render: (po) =>
        po.status === "cancelled" ? (
          <Badge tone="danger">Cancelled</Badge>
        ) : (
          <StatusPill status={po.status} />
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={purchases}
      rowKey={(po) => po.id}
      isLoading={isLoading}
      emptyTitle="No purchase orders yet"
      emptyDescription="Record your first delivery to see it show up here."
    />
  );
}