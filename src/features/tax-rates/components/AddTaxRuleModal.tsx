"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { taxRuleSchema, type TaxRuleFormValues } from "@/lib/validators";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { TaxRule } from "../types";

export interface AddTaxRuleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TaxRuleFormValues) => void;
  isSubmitting?: boolean;
  initialRule?: TaxRule | null;
}

const categoryOptions = [
  { label: "All", value: "All" },
  ...PRODUCT_CATEGORIES.map((c) => ({ label: c, value: c })),
];

export function AddTaxRuleModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  initialRule,
}: AddTaxRuleModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaxRuleFormValues>({
    resolver: zodResolver(taxRuleSchema),
    defaultValues: { active: true },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialRule
          ? {
              name: initialRule.name,
              appliesTo: initialRule.appliesTo,
              rate: initialRule.rate,
              effectiveDate: initialRule.effectiveDate,
              active: initialRule.active,
            }
          : { name: "", appliesTo: "", rate: 0, effectiveDate: "", active: true }
      );
    }
  }, [open, initialRule, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialRule ? "Edit Tax Rule" : "Add Tax Rule"}
      description="Category-specific rules override the “All” default rate."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            form="tax-rule-form"
            type="submit"
            isLoading={isSubmitting}
          >
            {initialRule ? "Save Changes" : "Add Rule"}
          </Button>
        </>
      }
    >
      <form
        id="tax-rule-form"
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Rule Name"
          placeholder="e.g. Standard VAT"
          error={errors.name?.message}
          {...register("name")}
        />
        <Select
          label="Applies To"
          placeholder="Select a category"
          options={categoryOptions}
          error={errors.appliesTo?.message}
          {...register("appliesTo")}
        />
        <Input
          label="Rate (%)"
          type="number"
          step="0.1"
          placeholder="16"
          error={errors.rate?.message}
          {...register("rate")}
        />
        <Input
          label="Effective Date"
          type="date"
          error={errors.effectiveDate?.message}
          {...register("effectiveDate")}
        />
        <label className="flex items-center gap-2 text-sm text-navy-600">
          <input type="checkbox" className="h-4 w-4 rounded border-navy-300" {...register("active")} />
          Rule is active
        </label>
      </form>
    </Modal>
  );
}