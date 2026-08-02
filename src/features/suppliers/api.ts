import { api } from "@/lib/api-client";
import type { SupplierFormValues } from "@/lib/validators";
import type { Supplier } from "@/types";

export async function fetchSuppliers(): Promise<Supplier[]> {
  const { data } = await api.get<Supplier[]>("/suppliers");
  return data;
}

export async function createSupplier(payload: SupplierFormValues): Promise<Supplier> {
  const { data } = await api.post<Supplier>("/suppliers", payload);
  return data;
}

export async function updateSupplier(
  id: string,
  payload: Partial<SupplierFormValues>
): Promise<Supplier> {
  const { data } = await api.patch<Supplier>(`/suppliers/${id}`, payload);
  return data;
}

// NOTE: work-distribution doc lists GET/POST/PATCH /suppliers only — no
// DELETE. The Figma card grid has no delete affordance either, so this is
// intentional, not an oversight.