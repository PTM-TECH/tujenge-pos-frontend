"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTaxRules, createTaxRule, updateTaxRule, deleteTaxRule } from "./api";
import type { TaxRuleFormValues } from "@/lib/validators";
import { useUiStore } from "@/store/uiStore";

const TAX_RULES_KEY = ["tax-rules"];

export function useTaxRules() {
  return useQuery({ queryKey: TAX_RULES_KEY, queryFn: fetchTaxRules });
}

export function useCreateTaxRule() {
  const queryClient = useQueryClient();
  const showToast = useUiStore((s) => s.showToast);
  return useMutation({
    mutationFn: (payload: TaxRuleFormValues) => createTaxRule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAX_RULES_KEY });
      showToast({ title: "Tax rule created", variant: "success" });
    },
    onError: () => showToast({ title: "Could not create tax rule", variant: "error" }),
  });
}

export function useUpdateTaxRule() {
  const queryClient = useQueryClient();
  const showToast = useUiStore((s) => s.showToast);
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TaxRuleFormValues> }) =>
      updateTaxRule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAX_RULES_KEY });
      showToast({ title: "Tax rule updated", variant: "success" });
    },
    onError: () => showToast({ title: "Could not update tax rule", variant: "error" }),
  });
}

export function useDeleteTaxRule() {
  const queryClient = useQueryClient();
  const showToast = useUiStore((s) => s.showToast);
  return useMutation({
    mutationFn: (id: string) => deleteTaxRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAX_RULES_KEY });
      showToast({ title: "Tax rule deleted", variant: "success" });
    },
    onError: () => showToast({ title: "Could not delete tax rule", variant: "error" }),
  });
}