"use client";

import { Pencil, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusPill } from "@/components/shared/StatusPill";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { TaxRule } from "../types";

export interface TaxRuleTableProps {
  rules: TaxRule[];
  isLoading?: boolean;
  onEdit: (rule: TaxRule) => void;
  onDelete: (rule: TaxRule) => void;
}

export function TaxRuleTable({ rules, isLoading, onEdit, onDelete }: TaxRuleTableProps) {
  const columns: Column<TaxRule>[] = [
    {
      key: "name",
      header: "Rule Name",
      render: (rule) => <span className="font-semibold text-navy-900">{rule.name}</span>,
    },
    {
      key: "appliesTo",
      header: "Applies To",
      render: (rule) => <Badge tone="success">{rule.appliesTo}</Badge>,
    },
    {
      key: "rate",
      header: "Rate",
      render: (rule) => <span className="font-semibold">{rule.rate}%</span>,
    },
    {
      key: "effectiveDate",
      header: "Effective Date",
      render: (rule) => formatDate(rule.effectiveDate),
    },
    {
      key: "lastUpdated",
      header: "Last Updated",
      render: (rule) => formatDate(rule.lastUpdated),
    },
    {
      key: "updatedBy",
      header: "Updated By",
      render: (rule) => rule.updatedBy,
    },
    {
      key: "status",
      header: "Status",
      render: (rule) => <StatusPill status={rule.active ? "active" : "inactive"} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (rule) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(rule)}
            aria-label={`Edit ${rule.name}`}
            className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(rule)}
            aria-label={`Delete ${rule.name}`}
            className="rounded-lg p-1.5 text-navy-400 hover:bg-danger-50 hover:text-danger-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rules}
      rowKey={(rule) => rule.id}
      isLoading={isLoading}
      emptyTitle="No tax rules yet"
      emptyDescription="Add a tax rule to start applying rates at checkout."
    />
  );
}