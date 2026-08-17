"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { RequireRole } from "@/components/shared/RequireRole";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import {
  useCreateSupplier,
  useSuppliers,
  useUpdateSupplier,
} from "@/features/suppliers/hooks";
import { SupplierCardGrid } from "@/features/suppliers/components/SupplierCardGrid";
import { AddSupplierModal } from "@/features/suppliers/components/AddSupplierModal";
import type { Supplier } from "@/types";
import type { SupplierFormValues } from "@/lib/validators";

function SuppliersContent() {
  const { data: suppliers = [], isLoading } = useSuppliers();
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  function handleAddClick() {
    setEditingSupplier(null);
    setModalOpen(true);
  }

  function handleEditClick(supplier: Supplier) {
    setEditingSupplier(supplier);
    setModalOpen(true);
  }

  function handleSubmit(values: SupplierFormValues) {
    if (editingSupplier) {
      updateMutation.mutate(
        { id: editingSupplier.id, payload: values },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      createMutation.mutate(values, { onSuccess: () => setModalOpen(false) });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <Topbar
          title="Suppliers Directory"
          description={`${suppliers.length} vendors · click a card to contact`}
        />
        <Button onClick={handleAddClick} className="shrink-0">
          <Plus className="h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <SupplierCardGrid suppliers={suppliers} isLoading={isLoading} onEdit={handleEditClick} />

      <AddSupplierModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        initialSupplier={editingSupplier}
      />
    </div>
  );
}

export default function SuppliersPage() {
  // Nav config: STAFF only sees New Sale, Inventory, and Sales Log —
  // Suppliers is ADMIN/SUPER_ADMIN only. Confirm this matches nav.config.ts.
  return (
    <RequireRole allow={["SUPER_ADMIN", "ADMIN"]}>
      <SuppliersContent />
    </RequireRole>
  );
}