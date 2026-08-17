"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { productSchema, type ProductFormValues } from "@/lib/validators";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { useSuppliers } from "@/features/suppliers/hooks";
import type { Product } from "@/types";

export interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
  isSubmitting?: boolean;
  initialProduct?: Product | null;
}

// Raw form input shape (before zod coercion) differs from the parsed output
// shape (ProductFormValues) because of z.coerce.number() fields. useForm
// needs both — this is what fixes the TS2322/TS2345 resolver mismatch.
type ProductFormInput = z.input<typeof productSchema>;

const categoryOptions = PRODUCT_CATEGORIES.map((c) => ({ label: c, value: c }));

export function AddProductModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  initialProduct,
}: AddProductModalProps) {
  const { data: suppliers = [] } = useSuppliers();
  const supplierOptions = suppliers.map((s) => ({ label: s.name, value: s.id }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormInput, any, ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (open) {
      reset(
        initialProduct
          ? {
              name: initialProduct.name,
              sku: initialProduct.sku,
              description: initialProduct.description ?? "",
              category: initialProduct.category,
              supplierId: initialProduct.supplierId,
              taxRuleId: initialProduct.taxRuleId,
              taxRate: initialProduct.taxRate,
              price: initialProduct.price,
              stock: initialProduct.stock,
              lowStockThreshold: initialProduct.lowStockThreshold,
            }
          : {
              name: "",
              sku: "",
              description: "",
              category: "",
              supplierId: "",
              taxRuleId: null,
              taxRate: 16,
              price: 0,
              stock: 0,
              lowStockThreshold: 10,
            }
      );
    }
  }, [open, initialProduct, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialProduct ? "Edit Product" : "Add Product"}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button form="product-form" type="submit" isLoading={isSubmitting}>
            {initialProduct ? "Save Changes" : "Add Product"}
          </Button>
        </>
      }
    >
      <form id="product-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Product Name"
          placeholder="Espresso Blend 500g"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Description"
          placeholder="Dark roast, Ethiopian single origin"
          error={errors.description?.message}
          {...register("description")}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="SKU"
            placeholder="COF-001"
            error={errors.sku?.message}
            {...register("sku")}
          />
          <Select
            label="Category"
            placeholder="Select a category"
            options={categoryOptions}
            error={errors.category?.message}
            {...register("category")}
          />
        </div>
        <Select
          label="Supplier"
          placeholder="Select a supplier"
          options={supplierOptions}
          error={errors.supplierId?.message}
          {...register("supplierId")}
        />
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Price (KES)"
            type="number"
            step="0.01"
            error={errors.price?.message}
            {...register("price")}
          />
          <Input
            label="Tax Rate (%)"
            type="number"
            step="0.1"
            placeholder="16"
            error={errors.taxRate?.message}
            {...register("taxRate")}
          />
          <Input label="Stock" type="number" error={errors.stock?.message} {...register("stock")} />
        </div>
        <Input
          label="Low Stock Threshold"
          type="number"
          error={errors.lowStockThreshold?.message}
          {...register("lowStockThreshold")}
        />
      </form>
    </Modal>
  );
}