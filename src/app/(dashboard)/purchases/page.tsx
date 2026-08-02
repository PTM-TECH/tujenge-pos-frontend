"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { RequireRole } from "@/components/shared/RequireRole";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCreatePurchase, usePurchases } from "@/features/purchases/hooks";
import { PurchaseTable } from "@/features/purchases/components/PurchaseTable";
import { NewPurchaseModal } from "@/features/purchases/components/NewPurchaseModal";
import type { PurchaseFormValues } from "@/lib/validators";

function PurchasesContent() {
  const { data: purchases = [], isLoading } = usePurchases();
  const createMutation = useCreatePurchase();
  const [isModalOpen, setModalOpen] = useState(false);

  function handleSubmit(values: PurchaseFormValues) {
    createMutation.mutate(values, { onSuccess: () => setModalOpen(false) });
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <Topbar title="Purchases Log" description="Bulk order history & purchase records" />
        <Button onClick={() => setModalOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4" />
          New Purchase / Record Delivery
        </Button>
      </div>

      <Card className="p-0">
        <PurchaseTable purchases={purchases} isLoading={isLoading} />
      </Card>

      <NewPurchaseModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}

export default function PurchasesPage() {
  // Nav config: STAFF only sees New Sale, Inventory, and Sales Log —
  // Purchases is ADMIN/SUPER_ADMIN only. Confirm this matches nav.config.ts.
  return (
    <RequireRole allow={["SUPER_ADMIN", "ADMIN"]}>
      <PurchasesContent />
    </RequireRole>
  );
}