"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProduct, fetchProducts, updateProduct } from "./api";
import type { ProductFormValues } from "@/lib/validators";
import { useUiStore } from "@/store/uiStore";

const PRODUCTS_KEY = ["products"];

export function useProducts() {
  return useQuery({ queryKey: PRODUCTS_KEY, queryFn: fetchProducts });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const showToast = useUiStore((s) => s.showToast);
  return useMutation({
    mutationFn: (payload: ProductFormValues) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      showToast({ title: "Product added", variant: "success" });
    },
    onError: () => showToast({ title: "Could not add product", variant: "error" }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const showToast = useUiStore((s) => s.showToast);
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ProductFormValues> }) =>
      updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      showToast({ title: "Product updated", variant: "success" });
    },
    onError: () => showToast({ title: "Could not update product", variant: "error" }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const showToast = useUiStore((s) => s.showToast);
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      showToast({ title: "Product deleted", variant: "success" });
    },
    onError: () => showToast({ title: "Could not delete product", variant: "error" }),
  });
}