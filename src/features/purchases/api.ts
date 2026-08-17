import { api } from "@/lib/api-client";
import type { PurchaseFormValues } from "@/lib/validators";
import type { PurchaseOrder } from "@/types";

export async function fetchPurchases(): Promise<PurchaseOrder[]> {
  const { data } = await api.get<PurchaseOrder[]>("/purchases");
  return data;
}

export async function createPurchase(payload: PurchaseFormValues): Promise<PurchaseOrder> {
  const { data } = await api.post<PurchaseOrder>("/purchases", payload);
  return data;
}

// NOTE: work-distribution doc only lists GET/POST /purchases, but PurchaseOrder
// has a "pending" status, implying something eventually flips it to
// "received". Confirm the real endpoint with the backend team before wiring
// a "Mark Received" action into PurchaseTable's row menu.
export async function markPurchaseReceived(id: string): Promise<PurchaseOrder> {
  const { data } = await api.patch<PurchaseOrder>(`/purchases/${id}`, { status: "received" });
  return data;
}