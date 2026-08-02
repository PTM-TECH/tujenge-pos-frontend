"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPurchase, fetchPurchases, markPurchaseReceived } from "./api";
import type { PurchaseFormValues } from "@/lib/validators";
import { useUiStore } from "@/store/uiStore";

const PURCHASES_KEY = ["purchases"];

export function usePurchases() {
  return useQuery({ queryKey: PURCHASES_KEY, queryFn: fetchPurchases });
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();
  const showToast = useUiStore((s) => s.showToast);
  return useMutation({
    mutationFn: (payload: PurchaseFormValues) => createPurchase(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PURCHASES_KEY });
      queryClient.invalidateQueries({ queryKey: ["products"] }); // stock may change
      showToast({ title: "Purchase recorded", variant: "success" });
    },
    onError: () => showToast({ title: "Could not record purchase", variant: "error" }),
  });
}

// See NOTE in api.ts — endpoint not yet confirmed with backend.
export function useMarkPurchaseReceived() {
  const queryClient = useQueryClient();
  const showToast = useUiStore((s) => s.showToast);
  return useMutation({
    mutationFn: (id: string) => markPurchaseReceived(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PURCHASES_KEY });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast({ title: "Marked as received", variant: "success" });
    },
    onError: () => showToast({ title: "Could not update purchase", variant: "error" }),
  });
}