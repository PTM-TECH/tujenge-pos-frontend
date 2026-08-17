import type MockAdapter from "axios-mock-adapter";
import type { Product } from "@/types";

let products: Product[] = [
  {
    id: "prod-1",
    sku: "COF-001",
    name: "Espresso Blend 500g",
    description: "Dark roast, Ethiopian single origin",
    category: "Coffee",
    supplierId: "sup-1",
    supplierName: "Alpine Roasters",
    taxRuleId: null,
    taxRate: 16,
    price: 18.5,
    stock: 142,
    lowStockThreshold: 20,
  },
  {
    id: "prod-2",
    sku: "COF-002",
    name: "Cold Brew Concentrate",
    description: "12-hour steep, 32oz ready-to-dilute",
    category: "Coffee",
    supplierId: "sup-1",
    supplierName: "Alpine Roasters",
    taxRuleId: null,
    taxRate: 16,
    price: 12.0,
    stock: 58,
    lowStockThreshold: 15,
  },
  {
    id: "prod-3",
    sku: "TEA-003",
    name: "Ginger Honey Blend",
    description: "Immunity blend, 80g tin",
    category: "Tea",
    supplierId: "sup-3",
    supplierName: "Cascade Tea Works",
    taxRuleId: null,
    taxRate: 16,
    price: 11.0,
    stock: 0,
    lowStockThreshold: 10,
  },
  {
    id: "prod-4",
    sku: "EQP-004",
    name: "Drip Coffee Kit",
    description: "Complete starter kit, limited run",
    category: "Equipment",
    supplierId: "sup-4",
    supplierName: "BaristaSupply Inc.",
    taxRuleId: null,
    taxRate: 0,
    price: 65.0,
    stock: 8,
    lowStockThreshold: 10,
  },
];

export function registerProductMocks(mock: MockAdapter) {
  mock.onGet("/products").reply(() => [200, products]);

  mock.onPost("/products").reply((config) => {
    const payload = JSON.parse(config.data);
    const newProduct: Product = { id: `prod-${Date.now()}`, ...payload };
    products = [...products, newProduct];
    return [201, newProduct];
  });

  mock.onPatch(/\/products\/.+/).reply((config) => {
    const id = config.url!.split("/").pop();
    const payload = JSON.parse(config.data);
    products = products.map((p) => (p.id === id ? { ...p, ...payload } : p));
    const updated = products.find((p) => p.id === id);
    return updated ? [200, updated] : [404, { message: "Product not found" }];
  });

  mock.onDelete(/\/products\/.+/).reply((config) => {
    const id = config.url!.split("/").pop();
    products = products.filter((p) => p.id !== id);
    return [204];
  });
}