import { api } from "@/lib/api-client";
import type { ProductFormValues } from "@/lib/validators";
import type { Product } from "@/types";

// Shared with Dev C's New Sale screen — they should import `fetchProducts`
// from here rather than writing a second fetcher (per the work-distribution
// doc's cross-cutting rules).
export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/products");
  return data;
}

export async function createProduct(payload: ProductFormValues): Promise<Product> {
  const { data } = await api.post<Product>("/products", payload);
  return data;
}

export async function updateProduct(
  id: string,
  payload: Partial<ProductFormValues>
): Promise<Product> {
  const { data } = await api.patch<Product>(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}