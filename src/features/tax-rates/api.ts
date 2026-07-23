import { api } from "@/lib/api-client";
import type { TaxRuleFormValues } from "@/lib/validators";
import type { TaxRule } from "./types";

export async function fetchTaxRules(): Promise<TaxRule[]> {
  const { data } = await api.get<TaxRule[]>("/tax-rules");
  return data;
}

export async function createTaxRule(payload: TaxRuleFormValues): Promise<TaxRule> {
  const { data } = await api.post<TaxRule>("/tax-rules", payload);
  return data;
}

export async function updateTaxRule(
  id: string,
  payload: Partial<TaxRuleFormValues>
): Promise<TaxRule> {
  const { data } = await api.patch<TaxRule>(`/tax-rules/${id}`, payload);
  return data;
}

export async function deleteTaxRule(id: string): Promise<void> {
  await api.delete(`/tax-rules/${id}`);
}