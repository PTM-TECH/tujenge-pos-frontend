"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { purchaseSchema, type PurchaseFormValues } from "@/lib/validators";
import { formatCurrency } from "@/lib/utils";
import { useSuppliers } from "@/features/suppliers/hooks";
import { useProducts } from "@/features/inventory/hooks";

export interface NewPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: PurchaseFormValues) => void;
  isSubmitting?: boolean;
}

// Raw form input shape (before zod coercion) differs from the parsed output
// shape (PurchaseFormValues) because of z.coerce.number() on quantity/unitCost.
type PurchaseFormInput = z.input<typeof purchaseSchema>;

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Received", value: "received" },
  { label: "Cancelled", value: "cancelled" },
];

export function NewPurchaseModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: NewPurchaseModalProps) {
  const { data: suppliers = [] } = useSuppliers();
  const { data: products = [] } = useProducts();
  const supplierOptions = suppliers.map((s) => ({ label: s.name, value: s.id }));
  const productOptions = products.map((p) => ({ label: p.name, value: p.id }));

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PurchaseFormInput, any, PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierId: "",
      date: new Date().toISOString().slice(0, 10),
      status: "pending",
      items: [{ productId: "", quantity: 1, unitCost: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");
  const total = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitCost) || 0),
    0
  );

  function handleFormSubmit(values: PurchaseFormValues) {
    onSubmit(values);
    reset();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Purchase / Record Delivery"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button form="purchase-form" type="submit" isLoading={isSubmitting}>
            Save Purchase
          </Button>
        </>
      }
    >
      <form
        id="purchase-form"
        className="space-y-4"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Supplier"
            placeholder="Select a supplier"
            options={supplierOptions}
            error={errors.supplierId?.message}
            {...register("supplierId")}
          />
          <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
          <Select label="Status" options={statusOptions} {...register("status")} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-navy-400">
              Line Items
            </label>
            <button
              type="button"
              onClick={() => append({ productId: "", quantity: 1, unitCost: 0 })}
              className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add item
            </button>
          </div>

          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <Select
                    placeholder="Select a product"
                    options={productOptions}
                    error={errors.items?.[index]?.productId?.message}
                    {...register(`items.${index}.productId` as const)}
                  />
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    min={1}
                    placeholder="Qty"
                    error={errors.items?.[index]?.quantity?.message}
                    {...register(`items.${index}.quantity` as const)}
                  />
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Unit cost"
                    error={errors.items?.[index]?.unitCost?.message}
                    {...register(`items.${index}.unitCost` as const)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="mt-2 rounded-lg p-2 text-navy-400 hover:bg-danger-50 hover:text-danger-500 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          {errors.items?.message && (
            <p className="mt-1 text-xs text-danger-500">{errors.items.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl bg-navy-50 px-4 py-3">
          <span className="text-sm text-navy-500">Total</span>
          <span className="text-lg font-bold text-navy-900">{formatCurrency(total)}</span>
        </div>
      </form>
    </Modal>
  );
}