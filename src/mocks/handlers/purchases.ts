import type MockAdapter from "axios-mock-adapter";
import type { PurchaseOrder } from "@/types";

let purchases: PurchaseOrder[] = [
  {
    id: "po-1",
    poNumber: "PO-0412",
    date: "2026-07-14",
    supplierId: "sup-1",
    supplierName: "Alpine Roasters",
    contactName: "Derek Holt",
    itemsCount: 12,
    total: 840.0,
    status: "received",
  },
  {
    id: "po-2",
    poNumber: "PO-0410",
    date: "2026-07-10",
    supplierId: "sup-3",
    supplierName: "Cascade Tea Works",
    contactName: "Priya Nair",
    itemsCount: 8,
    total: 215.5,
    status: "pending",
  },
];

export function registerPurchaseMocks(mock: MockAdapter) {
  mock.onGet("/purchases").reply(() => [200, purchases]);

  mock.onPost("/purchases").reply((config) => {
    const payload = JSON.parse(config.data);
    const newPurchase: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-${1000 + purchases.length}`,
      supplierName: "Unknown Supplier", // real backend fills this from supplierId
      contactName: "—",
      itemsCount: payload.items?.length ?? 0,
      total:
        payload.items?.reduce(
          (sum: number, i: { quantity: number; unitCost: number }) =>
            sum + i.quantity * i.unitCost,
          0
        ) ?? 0,
      ...payload,
    };
    purchases = [...purchases, newPurchase];
    return [201, newPurchase];
  });
}