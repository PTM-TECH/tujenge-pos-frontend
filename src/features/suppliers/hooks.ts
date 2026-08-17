"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSupplier, fetchSuppliers, updateSupplier } from "./api";
import type { SupplierFormValues } from "@/lib/validators";
import { useUiStore } from "@/store/uiStore";

const SUPPLIERS_KEY = ["suppliers"];

export function useSuppliers() {
  return useQuery({ queryKey: SUPPLIERS_KEY, queryFn: fetchSuppliers });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const showToast = useUiStore((s) => s.showToast);
  return useMutation({
    mutationFn: (payload: SupplierFormValues) => createSupplier(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY });
      showToast({ title: "Supplier added", variant: "success" });
    },
    onError: () => showToast({ title: "Could not add supplier", variant: "error" }),
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const showToast = useUiStore((s) => s.showToast);
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SupplierFormValues> }) =>
      updateSupplier(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY });
      showToast({ title: "Supplier updated", variant: "success" });
    },
    onError: () => showToast({ title: "Could not update supplier", variant: "error" }),
  });
}