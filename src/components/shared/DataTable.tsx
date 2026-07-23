"use client";

import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your filters or add a new record.",
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return <TableSkeleton cols={columns.length} />;
  }

  if (data.length === 0) {
    return <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} className="m-4" />;
  }

  return (
    <Table>
      <Thead>
        <Tr>
          {columns.map((col) => (
            <Th key={col.key} className={col.className}>
              {col.header}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.map((row) => (
          <Tr
            key={rowKey(row)}
            onClick={() => onRowClick?.(row)}
            className={onRowClick ? "cursor-pointer" : undefined}
          >
            {columns.map((col) => (
              <Td key={col.key} className={col.className}>
                {col.render(row)}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}