"use client";

import { useMemo, useState } from "react";
import { Plus, CheckCircle2, Tag, Percent } from "lucide-react";
import { RequireRole } from "@/components/shared/RequireRole";
import { Topbar } from "@/components/layout/Topbar";
import { StatCard } from "@/components/layout/StatCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useTaxRules, useCreateTaxRule, useUpdateTaxRule, useDeleteTaxRule } from "@/features/tax-rates/hooks";
import { TaxRuleTable } from "@/features/tax-rates/components/TaxRuleTable";
import { AddTaxRuleModal } from "@/features/tax-rates/components/AddTaxRuleModal";
import type { TaxRule } from "@/features/tax-rates/types";
import type { TaxRuleFormValues } from "@/lib/validators";

function TaxRatesContent() {
  const { data: rules = [], isLoading } = useTaxRules();
  const createMutation = useCreateTaxRule();
  const updateMutation = useUpdateTaxRule();
  const deleteMutation = useDeleteTaxRule();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TaxRule | null>(null);
  const [deletingRule, setDeletingRule] = useState<TaxRule | null>(null);

  const summary = useMemo(() => {
    const active = rules.filter((r) => r.active);
    const categories = new Set(rules.map((r) => r.appliesTo));
    const avgRate =
      active.length > 0 ? active.reduce((sum, r) => sum + r.rate, 0) / active.length : 0;
    return {
      activeCount: active.length,
      inactiveCount: rules.length - active.length,
      categoriesCovered: categories.size,
      avgRate,
    };
  }, [rules]);

  function handleAddClick() {
    setEditingRule(null);
    setModalOpen(true);
  }

  function handleEditClick(rule: TaxRule) {
    setEditingRule(rule);
    setModalOpen(true);
  }

  function handleSubmit(values: TaxRuleFormValues) {
    if (editingRule) {
      updateMutation.mutate(
        { id: editingRule.id, payload: values },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      createMutation.mutate(values, { onSuccess: () => setModalOpen(false) });
    }
  }

  function handleConfirmDelete() {
    if (!deletingRule) return;
    deleteMutation.mutate(deletingRule.id, { onSuccess: () => setDeletingRule(null) });
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <Topbar title="Tax Rate Configuration" description="Super Admin only · manage store tax rules and category rates" />
        <Button onClick={handleAddClick} className="shrink-0">
          <Plus className="h-4 w-4" />
          Add Tax Rule
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Active Rules"
          value={String(summary.activeCount)}
          icon={CheckCircle2}
          iconTone="success"
        />
        <StatCard
          label="Categories Covered"
          value={String(summary.categoriesCovered)}
          icon={Tag}
          iconTone="brand"
        />
        <StatCard
          label="Avg. Active Rate"
          value={`${summary.avgRate.toFixed(1)}%`}
          icon={Percent}
          iconTone="warning"
        />
      </div>

      <Card className="p-0">
        <CardHeader className="px-5 pt-5">
          <CardTitle>Tax Rules</CardTitle>
          <span className="text-xs text-navy-400">{rules.length} rules configured</span>
        </CardHeader>
        <TaxRuleTable
          rules={rules}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={setDeletingRule}
        />
      </Card>

      <AddTaxRuleModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        initialRule={editingRule}
      />

      <ConfirmDialog
        open={Boolean(deletingRule)}
        onClose={() => setDeletingRule(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete "${deletingRule?.name}"?`}
        confirmLabel="Delete Rule"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default function TaxRatesPage() {
  return (
    <RequireRole allow={["SUPER_ADMIN"]}>
      <TaxRatesContent />
    </RequireRole>
  );
}