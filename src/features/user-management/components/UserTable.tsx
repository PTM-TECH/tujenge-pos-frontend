"use client";

import { Pencil, Trash2, Power } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusPill } from "@/components/shared/StatusPill";
import { Select } from "@/components/ui/Select";
import { ROLE_LABELS } from "@/lib/constants";
import { initials, cn } from "@/lib/utils";
import type { User } from "../types";
import type { Role } from "@/types";

const ROLE_OPTIONS = (Object.keys(ROLE_LABELS) as Role[]).map((value) => ({
  label: ROLE_LABELS[value],
  value,
}));

export interface UserTableProps {
  users: User[];
  currentUserId?: string;
  isLoading?: boolean;
  onRoleChange: (user: User, role: Role) => void;
  onToggleStatus: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({
  users,
  currentUserId,
  isLoading,
  onRoleChange,
  onToggleStatus,
  onEdit,
  onDelete,
}: UserTableProps) {
  const columns: Column<User>[] = [
    {
      key: "user",
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
            {initials(u.name)}
          </div>
          <span className="font-semibold text-navy-900">{u.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (u) => <span className="text-navy-500">{u.email}</span>,
    },
    {
      key: "role",
      header: "Role",
      render: (u) => (
        <Select
          aria-label={`Change role for ${u.name}`}
          options={ROLE_OPTIONS}
          value={u.role}
          onChange={(e) => onRoleChange(u, e.target.value as Role)}
          disabled={u.id === currentUserId}
          className="h-9 w-40 text-xs font-semibold"
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (u) => <StatusPill status={u.status} />,
    },
    {
      key: "lastLogin",
      header: "Last Login",
      render: (u) => <span className="text-navy-500">{u.lastLogin ?? "Never"}</span>,
    },
    {
      key: "sales",
      header: "Sales",
      render: (u) => <span className="font-semibold text-navy-900">{u.salesCount}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (u) => {
        const isSelf = u.id === currentUserId;
        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleStatus(u)}
              disabled={isSelf}
              title={isSelf ? "You can't deactivate your own account" : undefined}
              aria-label={u.status === "active" ? `Deactivate ${u.name}` : `Activate ${u.name}`}
              className={cn(
                "rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-700",
                isSelf && "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-navy-400"
              )}
            >
              <Power className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(u)}
              aria-label={`Edit ${u.name}`}
              className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-700"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(u)}
              disabled={isSelf}
              title={isSelf ? "You can't remove your own account" : undefined}
              aria-label={`Delete ${u.name}`}
              className={cn(
                "rounded-lg p-1.5 text-navy-400 hover:bg-danger-50 hover:text-danger-500",
                isSelf && "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-navy-400"
              )}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      rowKey={(u) => u.id}
      isLoading={isLoading}
      emptyTitle="No users yet"
      emptyDescription="Invite a teammate to get started."
    />
  );
}