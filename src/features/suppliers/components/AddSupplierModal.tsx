"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { supplierSchema, type SupplierFormValues } from "@/lib/validators";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { Supplier } from "@/types";

export interface AddSupplierModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: SupplierFormValues) => void;
  isSubmitting?: boolean;
  initialSupplier?: Supplier | null;
}

const categoryOptions = PRODUCT_CATEGORIES.map((c) => ({ label: c, value: c }));

export function AddSupplierModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  initialSupplier,
}: AddSupplierModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
  });

  useEffect(() => {
    if (open) {
      reset(
        initialSupplier
          ? {
              name: initialSupplier.name,
              category: initialSupplier.category,
              phone: initialSupplier.phone,
              email: initialSupplier.email,
              address: initialSupplier.address,
            }
          : { name: "", category: "", phone: "", email: "", address: "" }
      );
    }
  }, [open, initialSupplier, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialSupplier ? "Edit Supplier" : "Add Supplier"}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button form="supplier-form" type="submit" isLoading={isSubmitting}>
            {initialSupplier ? "Save Changes" : "Add Supplier"}
          </Button>
        </>
      }
    >
      <form id="supplier-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Supplier Name"
          placeholder="Alpine Roasters"
          error={errors.name?.message}
          {...register("name")}
        />
        <Select
          label="Category"
          placeholder="Select a category"
          options={categoryOptions}
          error={errors.category?.message}
          {...register("category")}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Phone"
            placeholder="+1 (503) 442-8800"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Email"
            placeholder="orders@supplier.com"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
        <Input
          label="Address"
          placeholder="2218 NW Market St, Portland OR 97210"
          error={errors.address?.message}
          {...register("address")}
        />
      </form>
    </Modal>
  );
}