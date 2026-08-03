"use client";

import { useMemo, useState } from "react";
import { UserPlus, Users, UserCheck, UserX } from "lucide-react";
import { RequireRole } from "@/components/shared/RequireRole";
import { Topbar } from "@/components/layout/Topbar";
import { StatCard } from "@/components/layout/StatCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAuthStore } from "@/store/authStore";
import {
  useUsers,
  useInviteUser,
  useUpdateUser,
  useDeleteUser,
} from "@/features/user-management/hooks";
import { UserTable } from "@/features/user-management/components/UserTable";
import { InviteUserModal } from "@/features/user-management/components/InviteUserModal";
import type { User } from "@/features/user-management/types";
import type { InviteUserFormValues } from "@/lib/validators";
import type { Role } from "@/types";

function UserManagementContent() {
  const currentUser = useAuthStore((s) => s.user);
  const { data: users = [], isLoading } = useUsers();
  const inviteMutation = useInviteUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const summary = useMemo(() => {
    const active = users.filter((u) => u.status === "active");
    return { activeCount: active.length, inactiveCount: users.length - active.length };
  }, [users]);

  function handleInviteClick() {
    setEditingUser(null);
    setModalOpen(true);
  }

  function handleEditClick(user: User) {
    setEditingUser(user);
    setModalOpen(true);
  }

  function handleModalSubmit(values: InviteUserFormValues) {
    if (editingUser) {
      updateMutation.mutate(
        { id: editingUser.id, payload: { role: values.role } },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      inviteMutation.mutate(values, { onSuccess: () => setModalOpen(false) });
    }
  }

  function handleRoleChange(user: User, role: Role) {
    updateMutation.mutate({ id: user.id, payload: { role } });
  }

  function handleToggleStatus(user: User) {
    updateMutation.mutate({
      id: user.id,
      payload: { status: user.status === "active" ? "inactive" : "active" },
    });
  }

  function handleConfirmDelete() {
    if (!deletingUser) return;
    deleteMutation.mutate(deletingUser.id, { onSuccess: () => setDeletingUser(null) });
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <Topbar title="User Management" description="Manage store users, roles, and access" />
        <Button onClick={handleInviteClick} className="shrink-0">
          <UserPlus className="h-4 w-4" />
          Invite User
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Users" value={String(users.length)} icon={Users} iconTone="brand" />
        <StatCard
          label="Active"
          value={String(summary.activeCount)}
          icon={UserCheck}
          iconTone="success"
        />
        <StatCard
          label="Inactive"
          value={String(summary.inactiveCount)}
          icon={UserX}
          iconTone="warning"
        />
      </div>

      <Card className="p-0">
        <CardHeader className="px-5 pt-5">
          <CardTitle>All Users</CardTitle>
          <span className="text-xs text-navy-400">
            {summary.activeCount} active &middot; {summary.inactiveCount} inactive
          </span>
        </CardHeader>
        <UserTable
          users={users}
          currentUserId={currentUser?.id}
          isLoading={isLoading}
          onRoleChange={handleRoleChange}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEditClick}
          onDelete={setDeletingUser}
        />
      </Card>

      <InviteUserModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        isSubmitting={inviteMutation.isPending || updateMutation.isPending}
        initialUser={editingUser}
      />

      <ConfirmDialog
        open={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleConfirmDelete}
        title={`Remove "${deletingUser?.name}"?`}
        description="They'll lose access to TujengePOS immediately."
        confirmLabel="Remove User"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default function UserManagementPage() {
  return (
    <RequireRole allow={["SUPER_ADMIN"]}>
      <UserManagementContent />
    </RequireRole>
  );
}